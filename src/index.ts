#!/usr/bin/env node

import * as R from "ranger-compiler";
import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";
import * as childProcess from "child_process";
import * as util from "util";
import * as ora from "ora";
import * as watchman from "fb-watchman";
import anymatch from "anymatch";

require("events").EventEmitter.prototype._maxListeners = 100;

const exec = util.promisify(childProcess.exec);
const spawn = util.promisify(childProcess.spawn);
const watchmanClient = new watchman.Client();

let watcherType: "chokidar" | "watchman" = "chokidar";
let subCnt = 1;
const watchers: Array<chokidar.FSWatcher> = [];
const unsubscribers: Array<() => void> = [];
const testers: Array<(resp: WatchResponse) => void> = [];

interface CommandOptions {
  [key: string]: R.CodeNode;
}

interface Watch {
  watch: any;
  relative_path: string;
}

interface ChangedFile {
  name: string;
  size: number;
  exists: boolean;
  type: string;
}

// { root: '/private/tmp/foo',
//   subscription: 'mysubscription',
//   files: [ { name: 'node_modules/fb-watchman/index.js',
//       size: 4768,
//       exists: true,
//       type: 'f' } ] }

interface WatchResponse {
  root: string;
  subscription: string;
  files: ChangedFile[];
  is_fresh_instance: boolean;
}

// create a watch for a certain directory
async function WatchmanWatch(directoryName: string): Promise<Watch> {
  return (await new Promise((resolve, reject) => {
    watchmanClient.command(["watch-project", directoryName], function(
      error,
      resp
    ) {
      if (error) {
        console.error("Error initiating watch:", error);
        reject(error);
        return;
      }
      if ("warning" in resp) {
        console.log("warning: ", resp.warning);
      }
      resolve(resp as Watch);
    });
  })) as Watch;
}

async function WatchmanSubscribe(
  watcherInstance: Watch,
  name: string,
  expression: any[],
  onEvent: (resp: WatchResponse) => void
) {
  return new Promise((resolve, reject) => {
    const watch = watcherInstance.watch;
    const relative_path = watcherInstance.relative_path;

    const sub = {
      // Match any `.js` file in the dir_of_interest
      expression,
      // Which fields we're interested in
      fields: ["name", "size", "mtime_ms", "exists", "type"],
      relative_path
    };
    watchmanClient.command(["subscribe", watch, name, sub], function(
      error,
      resp
    ) {
      if (error) {
        // Probably an error in the subscription criteria
        console.error("failed to subscribe: ", error);
        return;
      }

      let eventCnt = 0;
      watchmanClient.on("subscription", function(resp: WatchResponse) {
        if (resp.is_fresh_instance) {
          return;
        }
        if (resp.subscription !== name) return;
        // console.log(resp);
        // console.log("My Sub ", name, " event ", resp.subscription, expression);
        onEvent(resp);
      });

      unsubscribers.push(async () => {
        await new Promise(done =>
          watchmanClient.command(["unsubscribe", watch, name], done)
        );
      });
      resolve(resp);
    });
  });
}

const lookForBlockCommand = async (
  cmd: string,
  node?: R.CodeNode,
  cb?: (block: R.CodeNode, opts: CommandOptions) => Promise<void>
) => {
  if (node) {
    if (node.children[0] && node.children[0].vref === cmd) {
      const opts: CommandOptions = {};
      let i = 0;
      let vname = "";
      for (const ch of node.children.slice(1)) {
        if (ch.is_block_node) {
          await cb(ch, opts);
        } else {
          if (i === 0) {
            if (ch.vref) {
              vname = ch.vref;
            }
            i++;
          } else {
            opts[vname] = ch;
            i = 0;
          }
        }
      }
    }
  }
};

const lookForCommand = async (
  cmd: string,
  node?: R.CodeNode,
  cb?: (node: R.CodeNode) => Promise<void>
) => {
  if (node) {
    if (node.children[0] && node.children[0].vref === cmd) {
      await cb(node);
    }
  }
};

const debouncers = new WeakMap();
const resolveInSeconds = (secs: number) => {
  return new Promise(resolve => setTimeout(resolve, secs * 1000));
};

export async function TestCompiler() {
  const compilerInit = ora("Starting robowatch").start("Initializing Robo");
  // read the makefile
  for (const w of watchers) {
    w.close();
  }

  for (const uns of unsubscribers) {
    await uns();
  }
  unsubscribers.length = 0;
  testers.length = 0;

  try {
    const sourceFile = new R.SourceCode(fs.readFileSync("Robo", "utf8"));
    const parser = new R.RangerLispParser(sourceFile);
    parser.parse(true);

    const parseDirectoryCommands = async (
      node?: R.CodeNode,
      fileName?: string
    ) => {
      if (node) {
        const spinners: ora.Ora[] = [];
        try {
          for (const ch of node.children) {
            await lookForBlockCommand("shell", ch, async (block, opts) => {
              for (const cmd of block.children) {
                await lookForCommand("debounce", cmd, async cmd => {
                  const secs =
                    cmd.children[1].int_value ||
                    cmd.children[1].double_value ||
                    0;
                  if (debouncers.get(ch)) {
                    debouncers.set(ch, resolveInSeconds(secs));
                    throw "skipping";
                  }
                  let awaiter = resolveInSeconds(secs);
                  const msg =
                    (cmd.children[2] && cmd.children[2].string_value) ||
                    `waiting ${secs} seconds`;
                  debouncers.set(ch, awaiter);
                  const spinner = ora(msg).start();
                  spinners.push(spinner);
                  await awaiter;
                  while (awaiter !== debouncers.get(ch)) {
                    awaiter = debouncers.get(ch);
                    await awaiter;
                  }
                  debouncers.delete(ch);
                  spinner.succeed(msg);
                });
                await lookForCommand("log", cmd, async cmd => {
                  const spinner = ora("").start();
                  spinners.push(spinner);
                  spinner.info(cmd.children[1].string_value);
                });
                if (cmd.string_value) {
                  const spinner = ora(cmd.string_value).start();
                  spinners.push(spinner);
                  const { stdout, stderr } = await exec(
                    `FILE="${fileName}"; ${cmd.string_value}`,
                    {
                      shell: opts["use"]
                        ? opts["use"].string_value || opts["use"].vref
                        : "/bin/bash"
                    }
                  );
                  if (stderr) {
                    spinner.fail(String(stderr));
                  } else {
                    if (stdout) {
                      spinner.succeed(stdout);
                    } else {
                      spinner.succeed(cmd.string_value);
                    }
                  }
                }
              }
            });
          }
        } catch (e) {
          spinners.forEach(s => {
            s.fail(String(e));
          });
        }
      }
    };
    const watcher =
      watcherType === "watchman" ? await WatchmanWatch(process.cwd()) : null;

    if (watcherType === "watchman") {
      // .. .anymatch
      const dirWatcher = await WatchmanWatch(process.cwd());
      WatchmanSubscribe(
        dirWatcher,
        `sub${subCnt++}`,
        ["allof", ["match", "**"]],
        resp => {
          for (const tester of testers) {
            tester(resp);
          }
        }
      );
    }
    parser.rootNode.children.forEach(async (node, index) => {
      const first = node.getFirst();

      const args = node.children.slice(1).filter(n => !n.is_block_node);
      const block = node.children.slice(1).filter(n => n.is_block_node);

      const files: string[] = [];
      const parseArg = (a: R.CodeNode) => {
        if (a.string_value) {
          files.push(a.string_value);
        }
        if (a.vref) {
          files.push(a.vref);
        }
      };
      args.forEach((a, index) => {
        if (a.children.length > 0) {
          a.children.forEach(parseArg);
        } else {
          parseArg(a);
        }
      });

      if (first && first.vref === "watch") {
        const followedFiles = files.filter(f => !(f.charAt(0) === "!"));
        const ignoredFiles = files
          .filter(f => f.charAt(0) === "!")
          .map(f => f.substring(1));

        if (watcherType === "watchman") {
          testers.push(resp => {
            for (const f of resp.files) {
              if (anymatch(ignoredFiles, f.name)) {
                continue;
              }
              if (anymatch(followedFiles, f.name)) {
                parseDirectoryCommands(block[0], f.name);
              }
            }
          });
        }
        if (watcherType === "chokidar") {
          const watcher = chokidar
            .watch(followedFiles, {
              ignored: ignoredFiles
            })
            .on("change", (event, path) => {
              // console.log("change ", event);
              parseDirectoryCommands(block[0], event);
            });
          watchers.push(watcher);
        }
      }
    });

    compilerInit.succeed(`Robowatch is running, using ${watcherType}`);
  } catch (e) {
    compilerInit.fail(String(e));
  }
}

async function startService() {
  try {
    try {
      await TestSetup();
    } catch (e) {}
    chokidar.watch("Robo").on("all", (event, path) => {
      TestCompiler();
    });
  } catch (e) {
    ora("Error").fail(String(e));
  }
}

async function TestSetup() {
  if (!watchmanClient) {
    return;
  }
  try {
    await new Promise((resolve, reject) => {
      try {
        watchmanClient.on("error", () => {
          reject();
        });
        watchmanClient.capabilityCheck(
          { optional: [], required: ["relative_root"] },
          function(error, resp) {
            if (error) {
              reject(error);
              return;
            }
            // resp will be an extended version response:
            // {'version': '3.8.0', 'capabilities': {'relative_root': true}}
            watcherType = "watchman";
            resolve(resp);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  } catch (e) {}
}

startService();

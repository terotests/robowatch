#!/usr/bin/env node

import * as R from "ranger-compiler";
import * as fs from "fs";
import * as chokidar from "chokidar";
import * as process from "child_process";
import * as util from "util";
import * as ora from "ora";

const exec = util.promisify(process.exec);
const spawn = util.promisify(process.spawn);

const watchers: Array<chokidar.FSWatcher> = [];

interface CommandOptions {
  [key: string]: R.CodeNode;
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

export function TestCompiler() {
  // read the makefile
  for (const w of watchers) {
    w.close();
  }

  try {
    const sourceFile = new R.SourceCode(fs.readFileSync("Robo", "utf8"));
    const parser = new R.RangerLispParser(sourceFile);
    parser.parse(true);

    const parseDirectoryCommands = async (
      node?: R.CodeNode,
      fileName?: string
    ) => {
      if (node) {
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
                  spinner.info(cmd.children[1].string_value);
                });
                if (cmd.string_value) {
                  const spinner = ora(cmd.string_value).start();
                  const { stdout, stderr } = await exec(
                    `FILE="${fileName}"; ${cmd.string_value}`
                  );
                  if (stderr) {
                    spinner.fail(String(stderr));
                  } else {
                    if (stdout) {
                      spinner.succeed(stdout);
                    } else {
                      spinner.succeed("Done");
                    }
                  }

                  // console.log(stdout);
                  // if (stdout) {
                  //   spinner.succeed(stdout);
                  // } else {
                  //   spinner.succeed("Done");
                  // }
                }
              }
            });
          }
        } catch (e) {}
      }
    };

    parser.rootNode.children.forEach((node, index) => {
      const first = node.getFirst();
      const second = node.getSecond();
      if (first && first.vref === "watch") {
        const watcher = chokidar
          .watch(second.vref)
          .on("change", (event, path) => {
            // console.log("change ", event);
            parseDirectoryCommands(node.children[2], event);
          });
        watchers.push(watcher);
      }
    });
  } catch (e) {}
}

chokidar.watch("Robo").on("all", (event, path) => {
  TestCompiler();
});

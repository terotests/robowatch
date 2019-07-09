#!/usr/bin/env node

import * as R from "ranger-compiler";
import * as fs from "fs";
import * as chokidar from "chokidar";
import * as process from "child_process";
import * as util from "util";

const exec = util.promisify(process.exec);

const watchers: Array<chokidar.FSWatcher> = [];

export function TestCompiler() {
  // read the makefile
  for (const w of watchers) {
    w.close();
  }

  const sourceFile = new R.SourceCode(fs.readFileSync("Robo", "utf8"));

  const parser = new R.RangerLispParser(sourceFile);
  parser.parse(true);

  const parseDirectoryCommands = async (node?: R.CodeNode) => {
    if (node) {
      for (const ch of node.children) {
        const first = ch.getFirst();
        const second = ch.getSecond();
        if (first) {
          if (first.vref === "shell" && second.is_block_node) {
            for (const cmd of second.children) {
              if (cmd.string_value) {
                const { stdout, stderr } = await exec(cmd.string_value);
                console.log(stdout);
              }
            }
          }
        }
      }
    }
  };

  parser.rootNode.children.forEach((node, index) => {
    const first = node.getFirst();
    const second = node.getSecond();
    if (first && first.vref === "watch") {
      const watcher = chokidar
        .watch(second.vref)
        .on("change", (event, path) => {
          // console.log(event, path);
          parseDirectoryCommands(node.children[2]);
        });
      watchers.push(watcher);
    }
  });
}

chokidar.watch("Robo").on("all", (event, path) => {
  TestCompiler();
});

#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("ranger-compiler");
var fs = require("fs");
var chokidar = require("chokidar");
var process = require("child_process");
var util = require("util");
var ora = require("ora");
var exec = util.promisify(process.exec);
var watchers = [];
function TestCompiler() {
    var _this = this;
    // read the makefile
    for (var _i = 0, watchers_1 = watchers; _i < watchers_1.length; _i++) {
        var w = watchers_1[_i];
        w.close();
    }
    var sourceFile = new R.SourceCode(fs.readFileSync("Robo", "utf8"));
    var parser = new R.RangerLispParser(sourceFile);
    parser.parse(true);
    var parseDirectoryCommands = function (node) { return __awaiter(_this, void 0, void 0, function () {
        var _i, _a, ch, first, second, _b, _c, cmd, spinner, _d, stdout, stderr;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!node) return [3 /*break*/, 6];
                    _i = 0, _a = node.children;
                    _e.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    ch = _a[_i];
                    first = ch.getFirst();
                    second = ch.getSecond();
                    if (!first) return [3 /*break*/, 5];
                    if (!(first.vref === "shell" && second.is_block_node)) return [3 /*break*/, 5];
                    _b = 0, _c = second.children;
                    _e.label = 2;
                case 2:
                    if (!(_b < _c.length)) return [3 /*break*/, 5];
                    cmd = _c[_b];
                    if (!cmd.string_value) return [3 /*break*/, 4];
                    spinner = ora(cmd.string_value).start();
                    return [4 /*yield*/, exec(cmd.string_value)];
                case 3:
                    _d = _e.sent(), stdout = _d.stdout, stderr = _d.stderr;
                    console.log(stdout);
                    if (stdout) {
                        spinner.succeed(stdout);
                    }
                    else {
                        spinner.succeed("Done");
                    }
                    _e.label = 4;
                case 4:
                    _b++;
                    return [3 /*break*/, 2];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    parser.rootNode.children.forEach(function (node, index) {
        var first = node.getFirst();
        var second = node.getSecond();
        if (first && first.vref === "watch") {
            var watcher = chokidar
                .watch(second.vref)
                .on("change", function (event, path) {
                // console.log(event, path);
                parseDirectoryCommands(node.children[2]);
            });
            watchers.push(watcher);
        }
    });
}
exports.TestCompiler = TestCompiler;
chokidar.watch("Robo").on("all", function (event, path) {
    TestCompiler();
});
//# sourceMappingURL=index.js.map
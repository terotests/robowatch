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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("ranger-compiler");
var fs = require("fs");
var chokidar = require("chokidar");
var process = require("child_process");
var util = require("util");
var ora = require("ora");
var exec = util.promisify(process.exec);
var spawn = util.promisify(process.spawn);
var watchers = [];
var lookForBlockCommand = function (cmd, node, cb) { return __awaiter(_this, void 0, void 0, function () {
    var opts, i, vname, _i, _a, ch;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!node) return [3 /*break*/, 5];
                if (!(node.children[0] && node.children[0].vref === cmd)) return [3 /*break*/, 5];
                opts = {};
                i = 0;
                vname = "";
                _i = 0, _a = node.children.slice(1);
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                ch = _a[_i];
                if (!ch.is_block_node) return [3 /*break*/, 3];
                return [4 /*yield*/, cb(ch, opts)];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                if (i === 0) {
                    if (ch.vref) {
                        vname = ch.vref;
                    }
                    i++;
                }
                else {
                    opts[vname] = ch;
                    i = 0;
                }
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
var lookForCommand = function (cmd, node, cb) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!node) return [3 /*break*/, 2];
                if (!(node.children[0] && node.children[0].vref === cmd)) return [3 /*break*/, 2];
                return [4 /*yield*/, cb(node)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
var debouncers = new WeakMap();
var resolveInSeconds = function (secs) {
    return new Promise(function (resolve) { return setTimeout(resolve, secs * 1000); });
};
function TestCompiler() {
    var _this = this;
    // read the makefile
    for (var _i = 0, watchers_1 = watchers; _i < watchers_1.length; _i++) {
        var w = watchers_1[_i];
        w.close();
    }
    try {
        var sourceFile = new R.SourceCode(fs.readFileSync("Robo", "utf8"));
        var parser = new R.RangerLispParser(sourceFile);
        parser.parse(true);
        var parseDirectoryCommands_1 = function (node, fileName) { return __awaiter(_this, void 0, void 0, function () {
            var spinners_1, _loop_1, _i, _a, ch, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!node) return [3 /*break*/, 7];
                        spinners_1 = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        _loop_1 = function (ch) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, lookForBlockCommand("shell", ch, function (block, opts) { return __awaiter(_this, void 0, void 0, function () {
                                            var _i, _a, cmd, spinner, _b, stdout, stderr;
                                            var _this = this;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        _i = 0, _a = block.children;
                                                        _c.label = 1;
                                                    case 1:
                                                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                                                        cmd = _a[_i];
                                                        return [4 /*yield*/, lookForCommand("debounce", cmd, function (cmd) { return __awaiter(_this, void 0, void 0, function () {
                                                                var secs, awaiter, msg, spinner;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            secs = cmd.children[1].int_value ||
                                                                                cmd.children[1].double_value ||
                                                                                0;
                                                                            if (debouncers.get(ch)) {
                                                                                debouncers.set(ch, resolveInSeconds(secs));
                                                                                throw "skipping";
                                                                            }
                                                                            awaiter = resolveInSeconds(secs);
                                                                            msg = (cmd.children[2] && cmd.children[2].string_value) ||
                                                                                "waiting " + secs + " seconds";
                                                                            debouncers.set(ch, awaiter);
                                                                            spinner = ora(msg).start();
                                                                            spinners_1.push(spinner);
                                                                            return [4 /*yield*/, awaiter];
                                                                        case 1:
                                                                            _a.sent();
                                                                            _a.label = 2;
                                                                        case 2:
                                                                            if (!(awaiter !== debouncers.get(ch))) return [3 /*break*/, 4];
                                                                            awaiter = debouncers.get(ch);
                                                                            return [4 /*yield*/, awaiter];
                                                                        case 3:
                                                                            _a.sent();
                                                                            return [3 /*break*/, 2];
                                                                        case 4:
                                                                            debouncers.delete(ch);
                                                                            spinner.succeed(msg);
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); })];
                                                    case 2:
                                                        _c.sent();
                                                        return [4 /*yield*/, lookForCommand("log", cmd, function (cmd) { return __awaiter(_this, void 0, void 0, function () {
                                                                var spinner;
                                                                return __generator(this, function (_a) {
                                                                    spinner = ora("").start();
                                                                    spinners_1.push(spinner);
                                                                    spinner.info(cmd.children[1].string_value);
                                                                    return [2 /*return*/];
                                                                });
                                                            }); })];
                                                    case 3:
                                                        _c.sent();
                                                        if (!cmd.string_value) return [3 /*break*/, 5];
                                                        spinner = ora(cmd.string_value).start();
                                                        spinners_1.push(spinner);
                                                        return [4 /*yield*/, exec("FILE=\"" + fileName + "\"; " + cmd.string_value, {
                                                                shell: opts["use"]
                                                                    ? opts["use"].string_value || opts["use"].vref
                                                                    : "/bin/bash"
                                                            })];
                                                    case 4:
                                                        _b = _c.sent(), stdout = _b.stdout, stderr = _b.stderr;
                                                        if (stderr) {
                                                            spinner.fail(String(stderr));
                                                        }
                                                        else {
                                                            if (stdout) {
                                                                spinner.succeed(stdout);
                                                            }
                                                            else {
                                                                spinner.succeed(cmd.string_value);
                                                            }
                                                        }
                                                        _c.label = 5;
                                                    case 5:
                                                        _i++;
                                                        return [3 /*break*/, 1];
                                                    case 6: return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _a = node.children;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        ch = _a[_i];
                        return [5 /*yield**/, _loop_1(ch)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _b.sent();
                        spinners_1.forEach(function (s) {
                            s.fail();
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        parser.rootNode.children.forEach(function (node, index) {
            var first = node.getFirst();
            var args = node.children.slice(1).filter(function (n) { return !n.is_block_node; });
            var block = node.children.slice(1).filter(function (n) { return n.is_block_node; });
            var files = [];
            var parseArg = function (a) {
                if (a.string_value) {
                    files.push(a.string_value);
                }
                if (a.vref) {
                    files.push(a.vref);
                }
            };
            args.forEach(function (a, index) {
                if (a.children.length > 0) {
                    a.children.forEach(parseArg);
                }
                else {
                    parseArg(a);
                }
            });
            if (first && first.vref === "watch") {
                var watcher = chokidar
                    .watch(files.filter(function (f) { return !(f.charAt(0) === "!"); }), {
                    ignored: files
                        .filter(function (f) { return f.charAt(0) === "!"; })
                        .map(function (f) { return f.substring(1); })
                })
                    .on("change", function (event, path) {
                    // console.log("change ", event);
                    parseDirectoryCommands_1(block[0], event);
                });
                watchers.push(watcher);
            }
        });
    }
    catch (e) { }
}
exports.TestCompiler = TestCompiler;
chokidar.watch("Robo").on("all", function (event, path) {
    TestCompiler();
});
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @redux true
 */
var IncModel = /** @class */ (function () {
    function IncModel() {
        this.cnt = 0;
        this.msg = "Also: Hello World!!!";
    }
    IncModel.prototype.increment = function () {
        this.cnt++;
    };
    IncModel.prototype.decrement = function () {
        this.cnt--;
    };
    return IncModel;
}());
exports.IncModel = IncModel;
//# sourceMappingURL=simple.js.map
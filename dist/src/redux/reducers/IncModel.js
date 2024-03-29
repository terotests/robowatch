"use strict";
/********************************************************************************
 *                                                                               *
 *   Redux Reducers and React Context API Provider/Consumer for state IncModel   *
 *   Generated by ts2redux from Source file ../simple.ts                         *
 *                                                                               *
 ********************************************************************************/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var immer = require("immer");
var react_redux_1 = require("react-redux");
var React = require("react");
function pick(o) {
    var props = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        props[_i - 1] = arguments[_i];
    }
    return props.reduce(function (a, e) {
        var _a;
        return (__assign({}, a, (_a = {}, _a[e] = o[e], _a)));
    }, {});
}
function mapStateToPropsWithKeys(state, keys) {
    return pick.apply(void 0, [state.IncModel].concat(keys));
}
exports.mapStateToPropsWithKeys = mapStateToPropsWithKeys;
exports.mapStateToProps = function (state) {
    return {
        cnt: state.IncModel.cnt,
        msg: state.IncModel.msg
    };
};
function mapDispatchToPropsWithKeys(dispatch, keys) {
    return pick.apply(void 0, [exports.mapDispatchToProps(dispatch)].concat(keys));
}
exports.mapDispatchToProps = function (dispatch) {
    return {
        increment: function () {
            return dispatch(RIncModel.increment());
        },
        decrement: function () {
            return dispatch(RIncModel.decrement());
        }
    };
};
function ConnectKeys(keys, methods) {
    return react_redux_1.connect(function (state) { return mapStateToPropsWithKeys(state, keys); }, function (dispatch) { return mapDispatchToPropsWithKeys(dispatch, methods); });
}
exports.ConnectKeys = ConnectKeys;
exports.StateConnector = react_redux_1.connect(exports.mapStateToProps, exports.mapDispatchToProps);
var initIncModel = function () {
    var o = new IncModel();
    return {
        cnt: o.cnt,
        msg: o.msg
    };
};
var initWithMethodsIncModel = function () {
    var o = new IncModel();
    return {
        cnt: o.cnt,
        msg: o.msg,
        increment: o.increment,
        decrement: o.decrement
    };
};
/**
 * @generated true
 */
var RIncModel = /** @class */ (function () {
    function RIncModel(state, dispatch, getState) {
        this._state = state;
        this._dispatch = dispatch;
        this._getState = getState;
    }
    Object.defineProperty(RIncModel.prototype, "cnt", {
        get: function () {
            if (this._getState) {
                return this._getState().IncModel.cnt;
            }
            else {
                if (this._state) {
                    return this._state.cnt;
                }
            }
            throw "Invalid State in IncModel_cnt";
        },
        set: function (value) {
            if (this._state && typeof value !== "undefined") {
                this._state.cnt = value;
            }
            else {
                // dispatch change for item cnt
                if (this._dispatch) {
                    this._dispatch({ type: exports.IncModelEnums.IncModel_cnt, payload: value });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RIncModel.prototype, "msg", {
        get: function () {
            if (this._getState) {
                return this._getState().IncModel.msg;
            }
            else {
                if (this._state) {
                    return this._state.msg;
                }
            }
            throw "Invalid State in IncModel_msg";
        },
        set: function (value) {
            if (this._state && typeof value !== "undefined") {
                this._state.msg = value;
            }
            else {
                // dispatch change for item msg
                if (this._dispatch) {
                    this._dispatch({ type: exports.IncModelEnums.IncModel_msg, payload: value });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    RIncModel.prototype.increment = function () {
        if (this._state) {
            this.cnt++;
        }
        else {
            if (this._dispatch) {
                this._dispatch({ type: exports.IncModelEnums.IncModel_increment });
            }
        }
    };
    RIncModel.increment = function () {
        return function (dispatcher, getState) {
            new RIncModel(undefined, dispatcher, getState).increment();
        };
    };
    RIncModel.prototype.decrement = function () {
        if (this._state) {
            this.cnt--;
        }
        else {
            if (this._dispatch) {
                this._dispatch({ type: exports.IncModelEnums.IncModel_decrement });
            }
        }
    };
    RIncModel.decrement = function () {
        return function (dispatcher, getState) {
            new RIncModel(undefined, dispatcher, getState).decrement();
        };
    };
    return RIncModel;
}());
exports.RIncModel = RIncModel;
exports.IncModelEnums = {
    IncModel_cnt: "IncModel_cnt",
    IncModel_msg: "IncModel_msg",
    IncModel_increment: "IncModel_increment",
    IncModel_decrement: "IncModel_decrement"
};
exports.IncModelReducer = function (state, action) {
    if (state === void 0) { state = initIncModel(); }
    return immer.produce(state, function (draft) {
        switch (action.type) {
            case exports.IncModelEnums.IncModel_cnt:
                new RIncModel(draft).cnt = action.payload;
                break;
            case exports.IncModelEnums.IncModel_msg:
                new RIncModel(draft).msg = action.payload;
                break;
            case exports.IncModelEnums.IncModel_increment:
                new RIncModel(draft).increment();
                break;
            case exports.IncModelEnums.IncModel_decrement:
                new RIncModel(draft).decrement();
                break;
        }
    });
};
/********************************
 * React Context API component   *
 ********************************/
exports.IncModelContext = React.createContext(initWithMethodsIncModel());
exports.IncModelConsumer = exports.IncModelContext.Consumer;
var instanceCnt = 1;
var IncModelProvider = /** @class */ (function (_super) {
    __extends(IncModelProvider, _super);
    function IncModelProvider(props) {
        var _this = _super.call(this, props) || this;
        _this.state = initIncModel();
        _this.__devTools = null;
        _this.lastSetState = _this.state;
        _this.increment = _this.increment.bind(_this);
        _this.decrement = _this.decrement.bind(_this);
        var devs = window["__REDUX_DEVTOOLS_EXTENSION__"]
            ? window["__REDUX_DEVTOOLS_EXTENSION__"]
            : null;
        if (devs) {
            _this.__devTools = devs.connect({ name: "IncModel" + instanceCnt++ });
            _this.__devTools.init(_this.state);
            _this.__devTools.subscribe(function (msg) {
                if (msg.type === "DISPATCH" && msg.state) {
                    _this.setState(JSON.parse(msg.state));
                }
            });
        }
        return _this;
    }
    IncModelProvider.prototype.componentWillUnmount = function () {
        if (this.__devTools) {
            this.__devTools.unsubscribe();
        }
    };
    IncModelProvider.prototype.setStateSync = function (state) {
        this.lastSetState = state;
        this.setState(state);
    };
    IncModelProvider.prototype.increment = function () {
        var nextState = immer.produce(this.state, function (draft) {
            return new RIncModel(draft).increment();
        });
        if (this.__devTools) {
            this.__devTools.send("increment", nextState);
        }
        this.setStateSync(nextState);
    };
    IncModelProvider.prototype.decrement = function () {
        var nextState = immer.produce(this.state, function (draft) {
            return new RIncModel(draft).decrement();
        });
        if (this.__devTools) {
            this.__devTools.send("decrement", nextState);
        }
        this.setStateSync(nextState);
    };
    IncModelProvider.prototype.render = function () {
        return (React.createElement(exports.IncModelContext.Provider, { value: __assign({}, this.state, { increment: this.increment, decrement: this.decrement }) },
            " ",
            this.props.children));
    };
    return IncModelProvider;
}(React.Component));
exports.IncModelProvider = IncModelProvider;
//# sourceMappingURL=IncModel.js.map
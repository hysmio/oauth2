"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
function checkStatus(res) {
    if (res.status >= 200 && res.status < 303) {
        return res;
    }
    throw {
        body: res.body,
        message: res.statusText,
        response: res,
        status: res.status
    };
}
exports.default = (url, options) => {
    return node_fetch_1.default(url, options)
        .then(checkStatus)
        .then((res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return res.json();
        }
        return res;
    });
};
//# sourceMappingURL=request.js.map
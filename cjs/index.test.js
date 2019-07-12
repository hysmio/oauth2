"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
describe("ClientCredentials", () => {
    it("should instantiate", () => {
        new index_1.default.ClientCrentials({
            autoRenew: {
                ttl: 3600,
            },
            clientId: 'perfectplay',
            clientSecret: 'askdjna',
            scope: 'accounts',
            tokenEndpoint: 'oauth2/token',
        });
    });
    const client = new index_1.default.ClientCrentials({
        clientId: 'perfectplay',
        clientSecret: 'askdjna',
        scope: 'accounts',
        tokenEndpoint: 'oauth2/token',
    });
    it("shouldn't error", () => {
        client.on("error", console.error);
    });
});
//# sourceMappingURL=index.test.js.map
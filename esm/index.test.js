import index from "./index";
describe("ClientCredentials", () => {
    it("should instantiate", () => {
        new index.ClientCrentials({
            autoRenew: {
                ttl: 3600,
            },
            clientId: 'perfectplay',
            clientSecret: 'askdjna',
            scope: 'accounts',
            tokenEndpoint: 'oauth2/token',
        });
    });
    const client = new index.ClientCrentials({
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
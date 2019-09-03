var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { URLSearchParams } from "url";
import request from "../util/request";
export default class ClientCredentials {
    constructor(options) {
        this.eventHandlers = {};
        this.options = options;
        if (this.options.autoRenew) {
            this.getToken()
                .then(() => {
                this.startAutoRenew();
            })
                .catch(ex => {
                throw ex;
            });
        }
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = new URLSearchParams();
            body.append("grant_type", "client_credentials");
            const basicAuth = Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`).toString('base64');
            if (Array.isArray(this.options.scope)) {
                let scope = "";
                this.options.scope.forEach((s) => {
                    scope += `${s} `;
                });
                body.append("scope", scope);
            }
            else {
                body.append("scope", this.options.scope);
            }
            try {
                const tokenResponse = yield request(this.options.tokenEndpoint.toString(), {
                    body: body.toString(),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Basic ${basicAuth}`
                    },
                    method: "POST"
                });
                const expiresAt = new Date();
                expiresAt.setSeconds(expiresAt.getSeconds() + tokenResponse.expires_in);
                const accessToken = {
                    accessToken: tokenResponse.access_token,
                    expiresAt,
                    scope: tokenResponse.scope,
                    ttl: tokenResponse.expires_in
                };
                if (this.options.autoRenew) {
                    if (this.options.autoRenew.autoConfigTTL) {
                        this.options.autoRenew.ttl = accessToken.ttl;
                        clearInterval(this.renewTimerHandle);
                        this.startAutoRenew((accessToken.ttl - 30) * 1000);
                        this.options.autoRenew.autoConfigTTL = false;
                    }
                    if (this.eventHandlers.token) {
                        this.eventHandlers.token({
                            clientId: this.options.clientId,
                            scope: this.options.scope,
                            ttl: this.options.autoRenew.ttl,
                            token: accessToken
                        });
                    }
                }
                this.accessToken = accessToken;
                return accessToken;
            }
            catch (ex) {
                if (this.eventHandlers.error) {
                    this.eventHandlers.error(ex);
                }
            }
        });
    }
    on(event, handler) {
        this.eventHandlers[event] = handler;
    }
    startAutoRenew(ms) {
        if (this.options.autoRenew) {
            const ttl = this.options.autoRenew.ttl || 0;
            this.renewTimerHandle = setInterval(() => this.getToken(), ms || (ttl - 1) * 1000 || 3599 * 1000);
        }
    }
}
//# sourceMappingURL=clientCredentials.js.map
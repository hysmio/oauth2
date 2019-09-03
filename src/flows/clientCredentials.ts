import { AccessToken } from "./OAuth2";
import { URLSearchParams } from "url";
import request from "../util/request";

export interface Options {
    /* Optional parameters */
    autoRenew?: {
        ttl?: number;
        autoConfigTTL?: boolean;
    };
    /* OAuth2 Neccessary parameters for Client Credentials Flow */
    clientId: string;
    clientSecret: string;
    scope: string | Array<string>;
    tokenEndpoint: string | URL;
}

export interface EventHandlers {
    token?: (token: any) => void;
    error?: (ex: any) => void;
}

export type Event = "token" | "error";

export default class ClientCredentials {
  public accessToken?: AccessToken;
  private options: Options;
  private renewTimerHandle: any;
  private eventHandlers: EventHandlers = {};

  constructor(options: Options) {
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

  public async getToken(): Promise<any> {
    const body = new URLSearchParams();
    body.append("grant_type", "client_credentials");

    const basicAuth = btoa(`${this.options.clientId}:${this.options.clientSecret}`);

    if (Array.isArray(this.options.scope)) {
      let scope: string = "";
      this.options.scope.forEach((s: string) => {
        scope += `${s} `;
      });
      body.append("scope", scope);
    } else {
      body.append("scope", this.options.scope);
    }

    try {
      const tokenResponse = await request(
        this.options.tokenEndpoint.toString(),
        {
          body: body.toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basicAuth}`
          },
          method: "POST"
        }
      );

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokenResponse.expires_in);

      const accessToken: AccessToken = {
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
    } catch (ex) {
      if (this.eventHandlers.error) {
        this.eventHandlers.error(ex);
      }
    }
  }

  public on(event: Event, handler: (value: any) => void) {
    this.eventHandlers[event] = handler;
  }

  // Private Instance Methods
  private startAutoRenew(ms?: number): void {
    if (this.options.autoRenew) {
      const ttl = this.options.autoRenew.ttl || 0;
      this.renewTimerHandle = setInterval(
        () => this.getToken(),
        ms || (ttl - 1) * 1000 || 3599 * 1000
      );
    }
  }
}

import { AccessToken } from "./OAuth2";
export interface Options {
    autoRenew?: {
        ttl?: number;
        autoConfigTTL?: boolean;
    };
    clientId: string;
    clientSecret: string;
    scope: string | Array<string>;
    tokenEndpoint: string | URL;
}
export interface EventHandlers {
    token?: (token: any) => void;
    error?: (ex: any) => void;
}
export declare type Event = "token" | "error";
export default class ClientCredentials {
    accessToken?: AccessToken;
    private options;
    private renewTimerHandle;
    private eventHandlers;
    constructor(options: Options);
    getToken(): Promise<any>;
    on(event: Event, handler: (value: any) => void): void;
    private startAutoRenew;
}

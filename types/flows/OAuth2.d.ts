export interface AccessToken {
    accessToken: string;
    scope: string | Array<string>;
    expiresAt: Date;
    ttl: number;
}

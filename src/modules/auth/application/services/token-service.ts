export interface AccessTokenPayload {
  sub: string;
  email: string;
}
export interface IssuedRefreshToken {
  token: string;
  hash: string;
  expiresAt: Date;
}

export abstract class TokenService {
  abstract signAccessToken(payload: AccessTokenPayload): Promise<string>;
  /** Returns null when the token is invalid or expired. */
  abstract verifyAccessToken(token: string): Promise<AccessTokenPayload | null>;
  abstract issueRefreshToken(): IssuedRefreshToken;
  abstract hashRefreshToken(token: string): string;
}

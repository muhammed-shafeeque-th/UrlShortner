export interface AuthResult {
  user: { id: string; email: string };
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

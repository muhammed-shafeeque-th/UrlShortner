import { Injectable } from '@nestjs/common';
import { AuthResult } from '../auth-result';
import { RefreshSession } from '../../domain/entities/refresh-session';
import { User } from '../../domain/entities/user';
import { SessionRepository } from '../../domain/repositories/session.repository';
import { TokenService } from './token-service';

/** Creates an access token + a new server-side refresh session for a user. */
@Injectable()
export class SessionIssuer {
  constructor(private readonly tokens: TokenService, private readonly sessions: SessionRepository) {}

  async issue(user: User, rotatedFrom?: string): Promise<AuthResult> {
    const refresh = this.tokens.issueRefreshToken();
    await this.sessions.create(
      RefreshSession.create({ userId: user.id, tokenHash: refresh.hash, expiresAt: refresh.expiresAt, rotatedFrom }),
    );
    const accessToken = await this.tokens.signAccessToken({ sub: user.id, email: user.email });
    return {
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken: refresh.token,
      refreshExpiresAt: refresh.expiresAt,
    };
  }
}

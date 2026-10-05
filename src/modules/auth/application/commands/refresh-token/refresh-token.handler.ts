import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InvalidRefreshTokenError } from '../../../domain/errors';
import { SessionRepository } from '../../../domain/repositories/session.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { SessionIssuer } from '../../services/session-issuer';
import { TokenService } from '../../services/token-service';
import { RefreshTokenCommand } from './refresh-token.command';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  private readonly logger = new Logger(RefreshTokenHandler.name);

  constructor(
    private readonly tokens: TokenService,
    private readonly sessions: SessionRepository,
    private readonly users: UserRepository,
    private readonly issuer: SessionIssuer,
  ) {}

  async execute({ refreshToken }: RefreshTokenCommand) {
    const session = await this.sessions.findByTokenHash(this.tokens.hashRefreshToken(refreshToken));
    if (!session) throw new InvalidRefreshTokenError();

    if (session.revokedAt) {
      // A rotated/revoked token was replayed: assume theft and kill every session of this user.
      this.logger.warn(`Refresh token reuse detected for user ${session.userId}; revoking all sessions`);
      await this.sessions.revokeAllForUser(session.userId);
      throw new InvalidRefreshTokenError();
    }
    if (session.isExpired()) throw new InvalidRefreshTokenError();
    // Atomic: only one of several concurrent refreshes can win.
    if (!(await this.sessions.revokeIfActive(session.id))) throw new InvalidRefreshTokenError();

    const user = await this.users.findById(session.userId);
    if (!user) throw new InvalidRefreshTokenError();
    return this.issuer.issue(user, session.id);
  }
}

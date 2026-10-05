import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../domain/repositories/session.repository';
import { TokenService } from '../../services/token-service';
import { LogoutUserCommand } from './logout-user.command';

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(private readonly tokens: TokenService, private readonly sessions: SessionRepository) {}

  async execute({ refreshToken }: LogoutUserCommand): Promise<void> {
    if (!refreshToken) return;
    const session = await this.sessions.findByTokenHash(this.tokens.hashRefreshToken(refreshToken));
    if (session) await this.sessions.revokeIfActive(session.id);
  }
}

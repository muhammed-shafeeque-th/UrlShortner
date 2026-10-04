import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InvalidCredentialsError } from '../../../domain/errors';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { PasswordHasher } from '../../services/password-hasher';
import { SessionIssuer } from '../../services/session-issuer';
import { LoginUserCommand } from './login-user.command';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly sessions: SessionIssuer,
  ) {}

  async execute({ email, password }: LoginUserCommand) {
    const user = await this.users.findByEmail(email.trim().toLowerCase());
    if (!user) {
      await this.hasher.hash(password); // equalise timing to avoid user enumeration
      throw new InvalidCredentialsError();
    }
    const isPasswordMatch = await this.hasher.verify(password, user.passwordHash)
    if (!isPasswordMatch) throw new InvalidCredentialsError();
    return this.sessions.issue(user);
  }
}

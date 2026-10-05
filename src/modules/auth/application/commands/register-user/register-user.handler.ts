import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../../domain/entities/user';
import { EmailAlreadyRegisteredError } from '../../../domain/errors';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { PasswordHasher } from '../../services/password-hasher';
import { RegisterUserCommand } from './register-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(private readonly users: UserRepository, private readonly hasher: PasswordHasher) {}

  async execute({ email, password }: RegisterUserCommand) {
    const normalized = email.trim().toLowerCase();
    // Fast path only.
    if (await this.users.findByEmail(normalized)) throw new EmailAlreadyRegisteredError();
    const user = User.create({ email: normalized, passwordHash: await this.hasher.hash(password) });
    // UNIQUE(email) constraint is the real guarantee (repo throws on violation)
    await this.users.create(user);
    return { id: user.id, email: user.email };
  }
}

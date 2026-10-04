import { Command } from '@nestjs/cqrs';
import { AuthResult } from '../../auth-result';

export class LoginUserCommand extends Command<AuthResult> {
  constructor(public readonly email: string, public readonly password: string) { super(); }
}

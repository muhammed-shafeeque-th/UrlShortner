import { Command } from '@nestjs/cqrs';

export class RegisterUserCommand extends Command<{ id: string; email: string }> {
  constructor(public readonly email: string, public readonly password: string) { super(); }
}

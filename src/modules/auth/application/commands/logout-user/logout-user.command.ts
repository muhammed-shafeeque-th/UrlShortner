import { Command } from '@nestjs/cqrs';

export class LogoutUserCommand extends Command<void> {
  constructor(public readonly refreshToken: string | undefined) { super(); }
}

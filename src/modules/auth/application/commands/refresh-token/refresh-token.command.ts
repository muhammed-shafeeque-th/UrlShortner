import { Command } from '@nestjs/cqrs';
import { AuthResult } from '../../auth-result';

export class RefreshTokenCommand extends Command<AuthResult> {
  constructor(public readonly refreshToken: string) { super(); }
}

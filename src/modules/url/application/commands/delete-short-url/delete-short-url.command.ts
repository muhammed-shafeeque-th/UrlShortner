import { Command } from '@nestjs/cqrs';

export class DeleteShortUrlCommand extends Command<void> {
  constructor(public readonly id: string, public readonly userId: string) { super(); }
}

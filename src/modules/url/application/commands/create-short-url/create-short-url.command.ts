import { Command } from '@nestjs/cqrs';
import { ShortUrl } from '../../../domain/entities/short-url';

export class CreateShortUrlCommand extends Command<ShortUrl> {
  constructor(public readonly userId: string, public readonly url: string) { super(); }
}

import { Query } from '@nestjs/cqrs';
import { ShortUrl } from '../../../domain/entities/short-url';

export class GetShortUrlQuery extends Query<ShortUrl> {
  constructor(public readonly id: string, public readonly userId: string) { super(); }
}

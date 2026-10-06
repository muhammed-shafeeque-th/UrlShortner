import { Query } from '@nestjs/cqrs';

export class RedirectShortUrlQuery extends Query<string> {
  constructor(public readonly shortCode: string) { super(); }
}

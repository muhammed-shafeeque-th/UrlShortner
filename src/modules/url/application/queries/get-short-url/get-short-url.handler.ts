import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ShortUrlNotFoundError } from '../../../domain/errors';
import { ShortUrlRepository } from '../../../domain/repositories/short-url.repository';
import { GetShortUrlQuery } from './get-short-url.query';

@QueryHandler(GetShortUrlQuery)
export class GetShortUrlHandler implements IQueryHandler<GetShortUrlQuery> {
  constructor(private readonly repo: ShortUrlRepository) {}

  async execute({ id, userId }: GetShortUrlQuery) {
    const shortUrl = await this.repo.findById(id);
    if (!shortUrl || shortUrl.userId !== userId) throw new ShortUrlNotFoundError();
    return shortUrl;
  }
}

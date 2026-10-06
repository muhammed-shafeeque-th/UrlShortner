import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ShortUrlRepository } from '../../../domain/repositories/short-url.repository';
import { ListUserUrlsQuery } from './list-user-urls.query';

@QueryHandler(ListUserUrlsQuery)
export class ListUserUrlsHandler implements IQueryHandler<ListUserUrlsQuery> {
  constructor(private readonly repo: ShortUrlRepository) {}

  async execute({ userId, page, limit }: ListUserUrlsQuery) {
    const { items, total } = await this.repo.findByUser(userId, { limit, offset: (page - 1) * limit });
    return { items, total, page, limit };
  }
}

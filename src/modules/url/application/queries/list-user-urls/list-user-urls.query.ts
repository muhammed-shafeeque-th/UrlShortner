import { Query } from '@nestjs/cqrs';
import { ShortUrl } from '../../../domain/entities/short-url';

export interface ListUserUrlsResult {
  items: ShortUrl[];
  total: number;
  page: number;
  limit: number;
}

export class ListUserUrlsQuery extends Query<ListUserUrlsResult> {
  constructor(public readonly userId: string, public readonly page: number, public readonly limit: number) { super(); }
}

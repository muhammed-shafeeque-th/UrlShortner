import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ShortUrlNotFoundError } from '../../../domain/errors';
import { ShortUrlRepository } from '../../../domain/repositories/short-url.repository';
import { UrlCache } from '../../services/url-cache';
import { RedirectShortUrlQuery } from './redirect-short-url.query';

@QueryHandler(RedirectShortUrlQuery)
export class RedirectShortUrlHandler implements IQueryHandler<RedirectShortUrlQuery> {
  private readonly logger = new Logger(RedirectShortUrlHandler.name);

  constructor(private readonly repo: ShortUrlRepository, private readonly cache: UrlCache) {}

  async execute({ shortCode }: RedirectShortUrlQuery): Promise<string> {
    try {
      const cached = await this.cache.get(shortCode);
      if (cached) return cached;
    } catch (e) {
      this.logger.warn(`Cache read failed, falling back to DB: ${(e as Error).message}`);
    }

    const shortUrl = await this.repo.findByCode(shortCode);
    if (!shortUrl) throw new ShortUrlNotFoundError();

    try {
      await this.cache.set(shortCode, shortUrl.originalUrl);
    } catch (e) {
      this.logger.warn(`Cache write failed for ${shortCode}: ${(e as Error).message}`);
    }
    return shortUrl.originalUrl;
  }
}

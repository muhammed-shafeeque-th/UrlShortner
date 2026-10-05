import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ShortUrlNotFoundError } from '../../../domain/errors';
import { ShortUrlRepository } from '../../../domain/repositories/short-url.repository';
import { UrlCache } from '../../services/url-cache';
import { DeleteShortUrlCommand } from './delete-short-url.command';

@CommandHandler(DeleteShortUrlCommand)
export class DeleteShortUrlHandler implements ICommandHandler<DeleteShortUrlCommand> {
  private readonly logger = new Logger(DeleteShortUrlHandler.name);

  constructor(private readonly repo: ShortUrlRepository, private readonly cache: UrlCache) {}

  async execute({ id, userId }: DeleteShortUrlCommand): Promise<void> {
    const shortUrl = await this.repo.findById(id);
    // 404 (not 403) for other users' URLs so ids can't be probed.
    if (!shortUrl || shortUrl.userId !== userId) throw new ShortUrlNotFoundError();

    await this.repo.delete(id); // PostgreSQL is authoritative
    try {
      await this.cache.delete(shortUrl.shortCode);
    } catch (e) {
      // DB delete succeeded; a stale cache entry expires via TTL. Alert on this metric/log.
      this.logger.error(`Cache invalidation failed for ${shortUrl.shortCode}: ${(e as Error).message}`);
    }
  }
}

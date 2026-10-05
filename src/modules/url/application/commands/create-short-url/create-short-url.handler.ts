import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ShortCodeConflictError } from '../../../domain/errors';
import { SHORT_CODE_LENGTH, ShortUrl } from '../../../domain/entities/short-url';
import { ShortUrlRepository } from '../../../domain/repositories/short-url.repository';
import { UrlPolicy } from '../../../domain/url-policy';
import { ShortCodeGenerator } from '../../services/short-code-generator';
import { UrlCache } from '../../services/url-cache';
import { CreateShortUrlCommand } from './create-short-url.command';

export const MAX_CODE_ATTEMPTS = 5;

@CommandHandler(CreateShortUrlCommand)
export class CreateShortUrlHandler implements ICommandHandler<CreateShortUrlCommand> {
  private readonly logger = new Logger(CreateShortUrlHandler.name);

  constructor(
    private readonly repo: ShortUrlRepository,
    private readonly generator: ShortCodeGenerator,
    private readonly cache: UrlCache,
  ) {}

  async execute({ userId, url }: CreateShortUrlCommand): Promise<ShortUrl> {
    const originalUrl = UrlPolicy.normalize(url);

    for (let attempt = 1; attempt <= MAX_CODE_ATTEMPTS; attempt++) {
      const shortUrl = ShortUrl.create({ shortCode: this.generator.generate(SHORT_CODE_LENGTH), originalUrl, userId });
      try {
        // No SELECT-then-INSERT: the UNIQUE constraint is the collision guarantee.
        await this.repo.create(shortUrl);
      } catch (e) {
        if (e instanceof ShortCodeConflictError) {
          this.logger.warn(`Short code collision (attempt ${attempt}/${MAX_CODE_ATTEMPTS})`);
          continue;
        }
        throw e;
      }
      try {
        await this.cache.set(shortUrl.shortCode, shortUrl.originalUrl);
      } catch (e) {
        this.logger.warn(`Cache write failed for ${shortUrl.shortCode}: ${(e as Error).message}`);
      }
      return shortUrl;
    }
    throw new Error(`Could not allocate a unique short code after ${MAX_CODE_ATTEMPTS} attempts`);
  }
}

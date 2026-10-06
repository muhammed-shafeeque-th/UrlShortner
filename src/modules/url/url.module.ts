import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CreateShortUrlHandler } from './application/commands/create-short-url/create-short-url.handler';
import { DeleteShortUrlHandler } from './application/commands/delete-short-url/delete-short-url.handler';
import { GetShortUrlHandler } from './application/queries/get-short-url/get-short-url.handler';
import { ListUserUrlsHandler } from './application/queries/list-user-urls/list-user-urls.handler';
import { RedirectShortUrlHandler } from './application/queries/redirect-short-url/redirect-short-url.handler';
import { ShortCodeGenerator } from './application/services/short-code-generator';
import { UrlCache } from './application/services/url-cache';
import { ShortUrlRepository } from './domain/repositories/short-url.repository';
import { Base62ShortCodeGenerator } from './infrastructure/base62-short-code.generator';
import { RedisUrlCache } from './infrastructure/cache/redis-url-cache';
import { ShortUrlOrmEntity } from './infrastructure/persistence/entities/short-url.orm-entity';
import { TypeOrmShortUrlRepository } from './infrastructure/repositories/typeorm-short-url.repository';
import { RedirectController } from './presentation/controllers/redirect.controller';
import { UrlController } from './presentation/controllers/url.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShortUrlOrmEntity]), AuthModule],
  // Order matters: UrlController's GET /urls must be registered before RedirectController's GET /:shortCode.
  controllers: [UrlController, RedirectController],
  providers: [
    CreateShortUrlHandler, DeleteShortUrlHandler,
    GetShortUrlHandler, ListUserUrlsHandler, RedirectShortUrlHandler,
    { provide: ShortUrlRepository, useClass: TypeOrmShortUrlRepository },
    { provide: ShortCodeGenerator, useClass: Base62ShortCodeGenerator },
    { provide: UrlCache, useClass: RedisUrlCache },
  ],
})
export class UrlModule {}

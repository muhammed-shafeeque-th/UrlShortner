import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { RedisThrottlerStorage } from './infrastructure/security/redis-throttler.storage';
import { AuthModule } from './modules/auth/auth.module';
import { UrlModule } from './modules/url/url.module';
import { DomainExceptionFilter } from './shared/filters/domain-exception.filter';
import { RedisService } from './infrastructure/redis/redis.service';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [
    AppConfigModule,
    CqrsModule.forRoot(),
    DatabaseModule,
    RedisModule,
    ThrottlerModule.forRootAsync({
      inject: [RedisService],
      useFactory: (redis: RedisService) => ({
        throttlers: [{ name: 'default', ttl: 60_000, limit: 100 }],
        storage: new RedisThrottlerStorage(redis),
      }),
    }),
    AuthModule,
    UrlModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class AppModule {}

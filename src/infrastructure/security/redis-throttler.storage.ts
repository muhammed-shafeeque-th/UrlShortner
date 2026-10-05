import { Logger } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import Redis from 'ioredis';
import { RedisService } from '../redis/redis.service';

interface ThrottlerRecord {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

/** Fixed-window rate-limit counters shared across instances. Fails open if Redis is down. */
export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly logger = new Logger(RedisThrottlerStorage.name);
  constructor(private readonly redis: RedisService) {}

  async increment(key: string, ttl: number, limit: number, _blockDuration: number, throttlerName: string): Promise<ThrottlerRecord> {
    const redisKey = `throttle:${throttlerName}:${key}`;
    try {
      const res = await this.redis.getClient().multi().incr(redisKey).pttl(redisKey).exec();
      const hits = Number(res?.[0]?.[1] ?? 1);
      let pttl = Number(res?.[1]?.[1] ?? -1);
      if (pttl < 0) {
        await this.redis.getClient().pexpire(redisKey, ttl);
        pttl = ttl;
      }
      const seconds = Math.ceil(pttl / 1000);
      const blocked = hits > limit;
      return { totalHits: hits, timeToExpire: seconds, isBlocked: blocked, timeToBlockExpire: blocked ? seconds : 0 };
    } catch (err) {
      this.logger.warn(`Rate-limit storage unavailable, failing open: ${(err as Error).message}`);
      return { totalHits: 0, timeToExpire: 0, isBlocked: false, timeToBlockExpire: 0 };
    }
  }
}

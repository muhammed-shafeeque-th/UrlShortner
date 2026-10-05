import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { UrlCache } from "../../application/services/url-cache";
import { RedisService } from "../../../../infrastructure/redis/redis.service";
import { AppConfigService } from "../../../../config/config.service";

@Injectable()
export class RedisUrlCache extends UrlCache {
  private readonly ttl: number;

  constructor(
    private readonly redis: RedisService,
    config: AppConfigService,
  ) {
    super();
    this.ttl = config.urlCacheTtlSeconds;
  }

  private key(code: string) {
    return `url:${code}`;
  }

  get(shortCode: string) {
    return this.redis.getClient().get(this.key(shortCode));
  }
  async set(shortCode: string, originalUrl: string) {
    await this.redis
      .getClient()
      .set(this.key(shortCode), originalUrl, "EX", this.ttl);
  }
  async delete(shortCode: string) {
    await this.redis.getClient().del(this.key(shortCode));
  }
}

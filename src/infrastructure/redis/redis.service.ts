import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import Redis from "ioredis";
import { AppConfigService } from "../../config/config.service";

@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
  private readonly client: Redis;
  private logger = new Logger("RedisService");

  constructor(config: AppConfigService) {
    const { redisCommandTimeoutMs, redisUrl } = config;
    this.client = new Redis(redisUrl, {
      db: 0,
      lazyConnect: true,
      commandTimeout: redisCommandTimeoutMs,
      connectTimeout: 2000,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: (times) => Math.min(times * 200, 5000),
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.client.on("error", (err) => {
      this.logger.error("Redis Client Error:", err);
    });

    this.client.on("connect", () => {
      this.logger.log(
        `Redis connected to ${this.client.options.host}:${this.client.options.port}`,
      );
    });

    this.client.on("ready", () => {
      this.logger.log("Redis is ready");
    });
  }

  getClient(): Redis {
    return this.client;
  }

  private async connect(): Promise<void> {
    if (this.client.status !== "ready") {
      await this.client.connect();
    }
  }

  private async disconnect(): Promise<void> {
    if (this.client.status !== "end") {
      await this.client.quit();
    }
  }

  async ping(): Promise<number> {
    const start = Date.now();
    await this.client.ping();
    return Date.now() - start;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);

    if (ttl !== undefined) {
      await this.client.setex(key, ttl, stringValue);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  onApplicationShutdown() {
    this.client.disconnect();
  }

  async onModuleInit() {
    await this.connect();
  }
}

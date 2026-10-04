import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: NestConfigService) {}

  // Service config
  get nodeEnv(): string {
    return this.configService.get<string>("NODE_ENV", "development");
  }

  get port(): number {
    return this.configService.get<number>("PORT", 3000);
  }
  get trustPolicy(): boolean {
    return this.configService.get<string>("TRUST_POLICY", "false") === "true";
  }
  get trustProxy(): boolean {
    return this.configService.get<string>("TRUST_PROXY", "true") === "true";
  }
  get baseUrl(): string {
    return this.configService.get<string>(
      "BASE_URL",
      `http://localhost:${this.port}`,
    );
  }
  get corsOrigins(): string[] {
    return this.configService
      .get<string>("CORS_ORIGINS", `http://localhost:5142,`)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // DB configs
  get databaseUrl(): string {
    return this.configService.getOrThrow<string>(
      "DATABASE_URL",
      `http://localhost:5432`,
    );
  }

  get databaseSsl(): boolean {
    return this.configService.get<string>("DATABASE_SSL", "false") === "true";
  }
  get databaseMigrationsRun(): boolean {
    return (
      this.configService.get<string>("DATABASE_MIGRATIONS_RUN", "true") ===
      "true"
    );
  }
  get databaseLogging(): boolean {
    return (
      this.configService.get<string>("DATABASE_LOGGING", "false") === "true"
    );
  }

  // Redis config
  get redisUrl(): string {
    return this.configService.get("REDIS_URL", "redis://localhost:6732");
  }
  get redisCommandTimeoutMs(): number {
    return this.configService.get("REDIS_COMMAND_TIMEOUT_MS", 250);
  }

  // Auth level configs
  get authAccessSecret(): string {
    return this.configService.get<string>(
      "JWT_ACCESS_SECRET",
      "your-access-secret",
    );
  }
  get authAccessTtlSeconds(): number {
    return this.configService.get<number>("ACCESS_TOKEN_TTL_SECONDS", 900);
  }
  get authRefreshTtlDays(): number {
    return this.configService.get<number>("REFRESH_TOKEN_TTL_DAYS", 30);
  }

  // Cookie configs
  get cookiesSecure(): boolean {
    return this.configService.get(
      "COOKIE_SECURE",
      this.nodeEnv === "production",
    );
  }
  get cookiesDomain(): string | undefined {
    return this.configService.get("COOKIE_DOMAIN", undefined);
  }
  get cookiesSameSite(): "lax" | "strict" | "none" {
    return this.configService.get("COOKIE_SAMESITE", "lax") as
      | "lax"
      | "strict"
      | "none";
  }

  // Url cache config
  get urlCacheTtlSeconds(): number {
    return this.configService.get("URL_CACHE_TTL_SECONDS", 86400);
  }
}

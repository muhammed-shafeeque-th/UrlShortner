import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { AppConfigService } from "../../config/config.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: "postgres" as const,
        url: config.databaseUrl,
        ssl: config.databaseSsl ? { rejectUnauthorized: false } : false,
        autoLoadEntities: true,
        synchronize: true,
        logging: config.databaseLogging,
        entities: [
          join(__dirname, "..", "..", "modules", "**", "*.orm-entity{.ts,.js}"),
        ],
        migrations: [
          join(__dirname, "..", "..", "database", "migrations", "*{.ts,.js}"),
        ],
        migrationsRun: config.databaseMigrationsRun,
      }),
    }),
  ],
})
export class DatabaseModule {}

import { Module } from "@nestjs/common";
import { AuthDatabaseEntityModule } from "../../../auth/infrastructure/persistence/auth-entity.module";
import { ShortUrlRepository } from "../../domain/repositories/short-url.repository";
import { TypeOrmShortUrlRepository } from "./typeorm-short-url.repository";
import { ShortUrlDatabaseEntityModule } from "../persistence/url-entity.module";

@Module({
  imports: [ShortUrlDatabaseEntityModule],
  providers: [
    { provide: ShortUrlRepository, useClass: TypeOrmShortUrlRepository },
  ],
  exports: [ShortUrlRepository],
})
export class ShortUrlDatabaseRepositoryModule {}

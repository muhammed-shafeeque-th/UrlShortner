import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShortUrlOrmEntity } from "./entities/short-url.orm-entity";

@Module({
  imports: [TypeOrmModule.forFeature([ShortUrlOrmEntity])],
  providers: [ShortUrlOrmEntity],
  exports: [TypeOrmModule, ShortUrlOrmEntity],
})
export class ShortUrlDatabaseEntityModule {}

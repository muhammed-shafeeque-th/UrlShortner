import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOrmEntity } from "./entities/user.orm-entity";
import { RefreshSessionOrmEntity } from "./entities/refresh-session.orm-entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, RefreshSessionOrmEntity])],
  providers: [UserOrmEntity, RefreshSessionOrmEntity],
  exports: [TypeOrmModule, UserOrmEntity, RefreshSessionOrmEntity],
})
export class AuthDatabaseEntityModule {}

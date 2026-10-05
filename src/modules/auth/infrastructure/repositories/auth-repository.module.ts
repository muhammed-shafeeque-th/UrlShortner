import { Module } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repository";
import { TypeOrmUserRepository } from "./typeorm-user.repository";
import { TypeOrmSessionRepository } from "./typeorm-session.repository";
import { SessionRepository } from "../../domain/repositories/session.repository";
import { AuthDatabaseEntityModule } from "../persistence/auth-entity.module";

@Module({
  imports: [AuthDatabaseEntityModule],
  providers: [
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    { provide: SessionRepository, useClass: TypeOrmSessionRepository },
  ],
  exports: [
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    { provide: SessionRepository, useClass: TypeOrmSessionRepository },
  ],
})
export class AuthDatabaseRepositoryModule {}

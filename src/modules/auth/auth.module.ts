import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { LoginUserHandler } from "./application/commands/login-user/login-user.handler";
import { LogoutUserHandler } from "./application/commands/logout-user/logout-user.handler";
import { RefreshTokenHandler } from "./application/commands/refresh-token/refresh-token.handler";
import { RegisterUserHandler } from "./application/commands/register-user/register-user.handler";
import { PasswordHasher } from "./application/services/password-hasher";
import { SessionIssuer } from "./application/services/session-issuer";
import { TokenService } from "./application/services/token-service";
import { JwtTokenService } from "./infrastructure/security/jwt-token.service";
import { ScryptPasswordHasher } from "./infrastructure/security/scrypt-password-hasher";
import { AuthCookiesService } from "./presentation/auth-cookies.service";
import { AuthController } from "./presentation/controllers/auth.controller";
import { JwtAuthGuard } from "./presentation/guards/jwt-auth.guard";
import { AuthDatabaseRepositoryModule } from "./infrastructure/repositories/auth-repository.module";

@Module({
  imports: [JwtModule.register({}), AuthDatabaseRepositoryModule],
  controllers: [AuthController],
  providers: [
    RegisterUserHandler,
    LoginUserHandler,
    RefreshTokenHandler,
    LogoutUserHandler,
    SessionIssuer,
    AuthCookiesService,
    JwtAuthGuard,

    { provide: PasswordHasher, useClass: ScryptPasswordHasher },
    { provide: TokenService, useClass: JwtTokenService },
  ],
  exports: [TokenService, JwtAuthGuard],
})
export class AuthModule {}

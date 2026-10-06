import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { REFRESH_COOKIE } from '../../../../shared/constants/cookies.constants';
import { CsrfGuard } from '../guards/csrf.guard';
import { LoginUserCommand } from '../../application/commands/login-user/login-user.command';
import { LogoutUserCommand } from '../../application/commands/logout-user/logout-user.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token/refresh-token.command';
import { RegisterUserCommand } from '../../application/commands/register-user/register-user.command';
import { AuthCookiesService } from '../auth-cookies.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { CurrentUser } from '../guards/current-user.decorator';
import { AuthenticatedUser, JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus, private readonly cookies: AuthCookiesService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  register(@Body() dto: RegisterDto) {
    return this.commandBus.execute(new RegisterUserCommand(dto.email, dto.password));
  }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.commandBus.execute(new LoginUserCommand(dto.email, dto.password));
    this.cookies.set(res, result);
    return { user: result.user };
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(CsrfGuard)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new UnauthorizedException();
    try {
      const result = await this.commandBus.execute(new RefreshTokenCommand(token));
      this.cookies.set(res, result);
      return { user: result.user };
    } catch (e) {
      this.cookies.clear(res);
      throw e;
    }
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(CsrfGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.commandBus.execute(new LogoutUserCommand(req.cookies?.[REFRESH_COOKIE]));
    this.cookies.clear(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser) {
    return { user };
  }
}

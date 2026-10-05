import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { TokenService } from "../../application/services/token-service";
import { ACCESS_COOKIE } from "../../../../shared/lib/cookies.constants";

export interface AuthenticatedUser {
  id: string;
  email: string;
}
export type AuthenticatedRequest = Request & { user: AuthenticatedUser };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  readonly logger = new Logger(JwtAuthGuard.name);
  constructor(private readonly tokens: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = req.headers.authorization;
    const bearer = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    const token = bearer ?? req.cookies?.[ACCESS_COOKIE];
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokens.verifyAccessToken(token);
    if (!payload) {
      throw new UnauthorizedException();
    }
    req.user = { id: payload.sub, email: payload.email };
    return true;
  }
}

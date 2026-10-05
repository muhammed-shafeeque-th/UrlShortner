import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest, AuthenticatedUser } from './jwt-auth.guard';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthenticatedUser => ctx.switchToHttp().getRequest<AuthenticatedRequest>().user,
);

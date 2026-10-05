import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { Request } from 'express';
import { ACCESS_COOKIE, CSRF_COOKIE, CSRF_HEADER, REFRESH_COOKIE } from '../../../../shared/constants/cookies.constants';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Double-submit-cookie CSRF protection. Applies only to state-changing requests that
 * are authenticated via cookies; Bearer-token requests carry no ambient credentials.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (SAFE_METHODS.has(req.method)) return true;
    const cookies = req.cookies ?? {};
    if (!cookies[ACCESS_COOKIE] && !cookies[REFRESH_COOKIE]) return true;

    const cookieToken = cookies[CSRF_COOKIE];
    const headerToken = req.headers[CSRF_HEADER];
    if (typeof cookieToken !== 'string' || typeof headerToken !== 'string') {
      throw new ForbiddenException('Missing CSRF token');
    }
    const a = Buffer.from(cookieToken);
    const b = Buffer.from(headerToken);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new ForbiddenException('Invalid CSRF token');
    }
    return true;
  }
}

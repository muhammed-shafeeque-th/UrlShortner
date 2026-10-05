import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CookieOptions, Response } from 'express';
import { AuthResult } from '../application/auth-result';
import { ACCESS_COOKIE, CSRF_COOKIE, REFRESH_COOKIE, REFRESH_COOKIE_PATH } from '../../../shared/constants/cookies.constants';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class AuthCookiesService {
  constructor(private readonly config: AppConfigService) {}

  private base(): CookieOptions {
    return {
      secure: this.config.cookiesSecure,
      sameSite: this.config.cookiesSameSite,
      domain: this.config.cookiesDomain
    };
  }

  set(res: Response, result: AuthResult): void {
    const accessMs = this.config.authAccessTtlSeconds * 1000;
    const refreshMs = Math.max(result.refreshExpiresAt.getTime() - Date.now(), 0);
    res.cookie(ACCESS_COOKIE, result.accessToken, { ...this.base(), httpOnly: true, path: '/', maxAge: accessMs });
    res.cookie(REFRESH_COOKIE, result.refreshToken, { ...this.base(), httpOnly: true, path: REFRESH_COOKIE_PATH, maxAge: refreshMs });
    res.cookie(CSRF_COOKIE, randomBytes(32).toString('hex'), { ...this.base(), httpOnly: false, path: '/', maxAge: refreshMs });
  }

  clear(res: Response): void {
    res.clearCookie(ACCESS_COOKIE, { ...this.base(), httpOnly: true, path: '/' });
    res.clearCookie(REFRESH_COOKIE, { ...this.base(), httpOnly: true, path: REFRESH_COOKIE_PATH });
    res.clearCookie(CSRF_COOKIE, { ...this.base(), httpOnly: false, path: '/' });
  }
}

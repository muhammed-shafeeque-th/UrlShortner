import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { AccessTokenPayload, IssuedRefreshToken, TokenService } from '../../application/services/token-service';
import { AppConfigService } from '../../../../config/config.service';

@Injectable()
export class JwtTokenService extends TokenService {
  private readonly secret: string;
  private readonly accessTtl: number;
  private readonly refreshTtlMs: number;

  constructor(private readonly jwt: JwtService, config: AppConfigService) {
    super();
    this.secret = config.authAccessSecret;
    this.accessTtl = config.authAccessTtlSeconds * 1000;
    this.refreshTtlMs = config.authRefreshTtlDays * 86_400_000;

  }
  
  signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwt.signAsync({ ...payload }, { secret: this.secret, expiresIn: this.accessTtl, algorithm: 'HS256' });
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      const p = await this.jwt.verifyAsync<AccessTokenPayload>(token, { secret: this.secret, algorithms: ['HS256'] });
      return { sub: p.sub, email: p.email };
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  issueRefreshToken(): IssuedRefreshToken {
    const token = randomBytes(32).toString('base64url');
    return { token, hash: this.hashRefreshToken(token), expiresAt: new Date(Date.now() + this.refreshTtlMs) };
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}

import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { PasswordHasher } from '../../application/services/password-hasher';

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;
const N = 2 ** 15, R = 8, P = 1, KEYLEN = 64;
const OPTS = { N, r: R, p: P, maxmem: 128 * N * R * 2 };

/** Format: scrypt$N$r$p$saltB64$hashB64 (parameters are stored so they can be raised later). */
@Injectable()
export class ScryptPasswordHasher extends PasswordHasher {
  async hash(plain: string): Promise<string> {
    const salt = randomBytes(16);
    const key = await scryptAsync(plain, salt, KEYLEN, OPTS);
    return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`;
  }

  async verify(plain: string, stored: string): Promise<boolean> {
    const [scheme, n, r, p, saltB64, hashB64] = stored.split('$');
    if (scheme !== 'scrypt' || !hashB64) return false;
    const expected = Buffer.from(hashB64, 'base64');
    const n_ = Number(n), r_ = Number(r), p_ = Number(p);
    const key = await scryptAsync(plain, Buffer.from(saltB64, 'base64'), expected.length, {
      N: n_, r: r_, p: p_, maxmem: 128 * n_ * r_ * 2,
    });
    return key.length === expected.length && timingSafeEqual(key, expected);
  }
}

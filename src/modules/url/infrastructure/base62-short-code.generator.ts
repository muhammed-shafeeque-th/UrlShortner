import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { ShortCodeGenerator } from '../application/services/short-code-generator';

export const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

@Injectable()
export class Base62ShortCodeGenerator extends ShortCodeGenerator {
  /** CSPRNG, unbiased (randomInt uses rejection sampling). */
  generate(length: number): string {
    let out = '';
    for (let i = 0; i < length; i++) out += BASE62[randomInt(BASE62.length)];
    return out;
  }
}

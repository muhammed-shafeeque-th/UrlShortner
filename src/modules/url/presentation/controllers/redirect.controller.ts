import { Controller, Get, Param, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { RedirectShortUrlQuery } from '../../application/queries/redirect-short-url/redirect-short-url.query';
import { SHORT_CODE_PATTERN } from '../../domain/entities/short-url';
import { ShortUrlNotFoundError } from '../../domain/errors';

@Controller()
export class RedirectController {
  constructor(private readonly queries: QueryBus) {}

  @Get(':shortCode')
  @Throttle({ default: { limit: 600, ttl: 60_000 } })
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    if (!SHORT_CODE_PATTERN.test(shortCode)) throw new ShortUrlNotFoundError();
    const target = await this.queries.execute(new RedirectShortUrlQuery(shortCode));
    // 308 keeps method semantics;
    //  a short private max-age bounds how long deleted links keep working in browsers.
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.redirect(308, target);
  }
}

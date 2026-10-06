import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Throttle } from '@nestjs/throttler';
import { CsrfGuard } from '../../../auth/presentation/guards/csrf.guard';
import { CurrentUser } from '../../../auth/presentation/guards/current-user.decorator';
import { AuthenticatedUser, JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { CreateShortUrlCommand } from '../../application/commands/create-short-url/create-short-url.command';
import { DeleteShortUrlCommand } from '../../application/commands/delete-short-url/delete-short-url.command';
import { GetShortUrlQuery } from '../../application/queries/get-short-url/get-short-url.query';
import { ListUserUrlsQuery } from '../../application/queries/list-user-urls/list-user-urls.query';
import { ShortUrl } from '../../domain/entities/short-url';
import { CreateShortUrlDto, ListUrlsQueryDto } from '../dto/url.dto';
import { AppConfigService } from '../../../../config/config.service';

@Controller('urls')
@UseGuards(CsrfGuard, JwtAuthGuard)
export class UrlController {
  private readonly baseUrl: string;

  constructor(private readonly commands: CommandBus, private readonly queries: QueryBus, config: AppConfigService) {
    this.baseUrl = config.baseUrl;
  }

  private toResponse(u: ShortUrl) {
    return {
      id: u.id,
      shortCode: u.shortCode,
      shortUrl: `${this.baseUrl}/${u.shortCode}`,
      originalUrl: u.originalUrl,
      createdAt: u.createdAt,
    };
  }

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateShortUrlDto) {
    return this.toResponse(await this.commands.execute(new CreateShortUrlCommand(user.id, dto.url)));
  }

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser, @Query() q: ListUrlsQueryDto) {
    const r = await this.queries.execute(new ListUserUrlsQuery(user.id, q.page, q.limit));
    return { items: r.items.map((u) => this.toResponse(u)), total: r.total, page: r.page, limit: r.limit };
  }

  @Get(':id')
  async get(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.toResponse(await this.queries.execute(new GetShortUrlQuery(id, user.id)));
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    await this.commands.execute(new DeleteShortUrlCommand(id, user.id));
  }
}

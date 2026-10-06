import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ShortUrl } from '../../domain/entities/short-url';
import { ShortCodeConflictError } from '../../domain/errors';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';
import { ShortUrlOrmEntity } from '../persistence/entities/short-url.orm-entity';

@Injectable()
export class TypeOrmShortUrlRepository extends ShortUrlRepository {
  constructor(@InjectRepository(ShortUrlOrmEntity) private readonly repo: Repository<ShortUrlOrmEntity>) { super(); }

  async create(s: ShortUrl): Promise<void> {
    try {
      await this.repo.insert({ ...s });
    } catch (e) {
      if (e instanceof QueryFailedError && (e.driverError as { code?: string })?.code === '23505') {
        throw new ShortCodeConflictError();
      }
      throw e;
    }
  }
  async findByCode(shortCode: string) {
    const r = await this.repo.findOneBy({ shortCode });
    return r ? this.toDomain(r) : null;
  }
  async findById(id: string) {
    const r = await this.repo.findOneBy({ id });
    return r ? this.toDomain(r) : null;
  }
  async findByUser(userId: string, { limit, offset }: { limit: number; offset: number }) {
    const [rows, total] = await this.repo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC', id: 'DESC' },
      take: limit,
      skip: offset,
    });
    return { items: rows.map((r) => this.toDomain(r)), total };
  }
  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
  private toDomain(r: ShortUrlOrmEntity) {
    return new ShortUrl(r.id, r.shortCode, r.originalUrl, r.userId, r.createdAt, r.updatedAt);
  }
}

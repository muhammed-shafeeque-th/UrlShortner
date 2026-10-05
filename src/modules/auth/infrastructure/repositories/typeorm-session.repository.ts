import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { RefreshSession } from '../../domain/entities/refresh-session';
import { SessionRepository } from '../../domain/repositories/session.repository';
import { RefreshSessionOrmEntity } from '../persistence/entities/refresh-session.orm-entity';

@Injectable()
export class TypeOrmSessionRepository extends SessionRepository {
  constructor(@InjectRepository(RefreshSessionOrmEntity) private readonly repo: Repository<RefreshSessionOrmEntity>) { super(); }

  async create(s: RefreshSession): Promise<void> {
    await this.repo.insert({ ...s });
  }
  async findByTokenHash(tokenHash: string) {
    const r = await this.repo.findOneBy({ tokenHash });
    return r ? new RefreshSession(r.id, r.userId, r.tokenHash, r.expiresAt, r.createdAt, r.revokedAt, r.rotatedFrom) : null;
  }
  async revokeIfActive(id: string): Promise<boolean> {
    const res = await this.repo.update({ id, revokedAt: IsNull() }, { revokedAt: new Date() });
    return (res.affected ?? 0) === 1;
  }
  async revokeAllForUser(userId: string): Promise<void> {
    await this.repo.update({ userId, revokedAt: IsNull() }, { revokedAt: new Date() });
  }
}

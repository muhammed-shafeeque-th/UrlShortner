import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../../domain/entities/user';
import { EmailAlreadyRegisteredError } from '../../domain/errors';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOrmEntity } from '../persistence/entities/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository extends UserRepository {
  constructor(@InjectRepository(UserOrmEntity) private readonly repo: Repository<UserOrmEntity>) { super(); }

  async create(user: User): Promise<void> {
    try {
      await this.repo.insert({ ...user });
    } catch (e) {
      if (e instanceof QueryFailedError && (e.driverError as { code?: string })?.code === '23505') {
        throw new EmailAlreadyRegisteredError();
      }
      throw e;
    }
  }
  async findByEmail(email: string) {
    const row = await this.repo.findOneBy({ email });
    return row ? this.toDomain(row) : null;
  }
  async findById(id: string) {
    const row = await this.repo.findOneBy({ id });
    return row ? this.toDomain(row) : null;
  }
  private toDomain(r: UserOrmEntity) {
    return new User(r.id, r.email, r.passwordHash, r.createdAt, r.updatedAt);
  }
}

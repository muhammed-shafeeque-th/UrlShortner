import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('short_urls')
@Index('idx_short_urls_user_created', ['userId', 'createdAt'])
export class ShortUrlOrmEntity {
  @PrimaryColumn('uuid') id!: string;
  @Column({ name: 'short_code', type: 'varchar', length: 16, unique: true }) shortCode!: string;
  @Column({ name: 'original_url', type: 'text' }) originalUrl!: string;
  @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @Column({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @Column({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}

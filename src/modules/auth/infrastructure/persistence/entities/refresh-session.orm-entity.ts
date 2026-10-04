import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('refresh_sessions')
export class RefreshSessionOrmEntity {
  @PrimaryColumn('uuid') id!: string;
  @Index() @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @Column({ name: 'token_hash', type: 'char', length: 64, unique: true }) tokenHash!: string;
  @Column({ name: 'expires_at', type: 'timestamptz' }) expiresAt!: Date;
  @Column({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true }) revokedAt!: Date | null;
  @Column({ name: 'rotated_from', type: 'uuid', nullable: true }) rotatedFrom!: string | null;
}

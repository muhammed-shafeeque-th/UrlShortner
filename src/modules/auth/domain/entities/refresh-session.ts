import { randomUUID } from 'crypto';

export class RefreshSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly tokenHash: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly revokedAt: Date | null,
    public readonly rotatedFrom: string | null,
  ) {}

  static create(props: { userId: string; tokenHash: string; expiresAt: Date; rotatedFrom?: string | null }): RefreshSession {
    return new RefreshSession(randomUUID(), props.userId, props.tokenHash, props.expiresAt, new Date(), null, props.rotatedFrom ?? null);
  }

  isExpired(now = new Date()): boolean {
    return this.expiresAt.getTime() <= now.getTime();
  }
}

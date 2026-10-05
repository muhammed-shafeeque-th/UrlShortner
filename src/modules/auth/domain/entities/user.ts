import { randomUUID } from 'crypto';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: { email: string; passwordHash: string }): User {
    const now = new Date();
    return new User(randomUUID(), props.email.trim().toLowerCase(), props.passwordHash, now, now);
  }
}

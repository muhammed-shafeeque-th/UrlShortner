import { randomUUID } from 'crypto';

export const SHORT_CODE_LENGTH = 7;
export const SHORT_CODE_PATTERN = /^[0-9A-Za-z]{7}$/;

export class ShortUrl {
  constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly originalUrl: string,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: { shortCode: string; originalUrl: string; userId: string }): ShortUrl {
    const now = new Date();
    return new ShortUrl(randomUUID(), props.shortCode, props.originalUrl, props.userId, now, now);
  }
}

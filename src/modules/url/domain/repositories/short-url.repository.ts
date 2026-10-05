import { ShortUrl } from '../entities/short-url';

export abstract class ShortUrlRepository {
  /** @throws `ShortCodeConflictError` when the code is already taken (DB-enforced). */
  abstract create(shortUrl: ShortUrl): Promise<void>;
  abstract findByCode(shortCode: string): Promise<ShortUrl | null>;
  abstract findById(id: string): Promise<ShortUrl | null>;
  abstract findByUser(userId: string, opts: { limit: number; offset: number }): Promise<{ items: ShortUrl[]; total: number }>;
  abstract delete(id: string): Promise<void>;
}

export abstract class UrlCache {
  abstract get(shortCode: string): Promise<string | null>;
  abstract set(shortCode: string, originalUrl: string): Promise<void>;
  abstract delete(shortCode: string): Promise<void>;
}

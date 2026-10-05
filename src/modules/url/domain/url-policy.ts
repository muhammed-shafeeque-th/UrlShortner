import { InvalidUrlError } from "./errors";

export const MAX_URL_LENGTH = 2048;
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export const UrlPolicy = {
  /** Url normalize utility, which
   * -  Validates
   * - Normalizes a destination URL.
   * - Rejects javascript:, data:, file:
   * - Rejects credentials (username, password), etc.
   */
  normalize(input: string): string {
    const raw = input.trim();
    if (!raw) throw new InvalidUrlError("URL is empty");
    if (raw.length > MAX_URL_LENGTH)
      throw new InvalidUrlError(`URL exceeds ${MAX_URL_LENGTH} characters`);
    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      throw new InvalidUrlError("URL cannot be parsed");
    }
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol))
      throw new InvalidUrlError("only http and https are allowed");
    if (!parsed.hostname) throw new InvalidUrlError("URL has no host");
    if (parsed.username || parsed.password)
      throw new InvalidUrlError("embedded credentials are not allowed");
    const href = parsed.href;
    if (href.length > MAX_URL_LENGTH)
      throw new InvalidUrlError(`URL exceeds ${MAX_URL_LENGTH} characters`);

    return href;
  },
};

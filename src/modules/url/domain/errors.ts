import { ConflictError, NotFoundError, ValidationError } from '../../../shared/errors/errors';

export class InvalidUrlError extends ValidationError {
  constructor(reason: string) { super(`Invalid URL: ${reason}`, 'INVALID_URL'); }
}
export class ShortUrlNotFoundError extends NotFoundError {
  constructor() { super('Short URL not found', 'SHORT_URL_NOT_FOUND'); }
}
/** Raised by the repository when UNIQUE(short_code) is violated. */
export class ShortCodeConflictError extends ConflictError {
  constructor() { super('Short code already exists', 'SHORT_CODE_CONFLICT'); }
}

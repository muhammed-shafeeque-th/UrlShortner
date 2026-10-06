import { ConflictError, UnauthorizedError } from '../../../shared/errors/errors';

export class EmailAlreadyRegisteredError extends ConflictError {
  constructor() { super('Email is already registered', 'EMAIL_ALREADY_REGISTERED'); }
}
export class InvalidCredentialsError extends UnauthorizedError {
  constructor() { super('Invalid email or password', 'INVALID_CREDENTIALS'); }
}
export class InvalidRefreshTokenError extends UnauthorizedError {
  constructor() { super('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN'); }
}

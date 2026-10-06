export abstract class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = new.target.name;

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
export class ValidationError extends DomainError {
  constructor(message: string, code = 'VALIDATION_ERROR') { super(message, code); }
}
export class NotFoundError extends DomainError {
  constructor(message: string, code = 'NOT_FOUND') { super(message, code); }
}
export class ConflictError extends DomainError {
  constructor(message: string, code = 'CONFLICT') { super(message, code); }
}
export class UnauthorizedError extends DomainError {
  constructor(message: string, code = 'UNAUTHORIZED') { super(message, code); }
}

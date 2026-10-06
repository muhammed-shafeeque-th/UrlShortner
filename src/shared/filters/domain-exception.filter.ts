import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ConflictError, DomainError, NotFoundError, UnauthorizedError, ValidationError } from '../errors/errors';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (error instanceof ValidationError) status = HttpStatus.BAD_REQUEST;
    else if (error instanceof UnauthorizedError) status = HttpStatus.UNAUTHORIZED;
    else if (error instanceof NotFoundError) status = HttpStatus.NOT_FOUND;
    else if (error instanceof ConflictError) status = HttpStatus.CONFLICT;
    res.status(status).json({ statusCode: status, error: error.code, message: error.message });
  }
}

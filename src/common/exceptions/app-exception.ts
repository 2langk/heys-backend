import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  public isOperational: boolean;

  constructor(message: string, statusCode: HttpStatus) {
    super({ statusCode, message }, statusCode);
    this.isOperational = true;
  }
}

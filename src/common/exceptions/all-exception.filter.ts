import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import * as _ from 'lodash';
import { isTypeOf } from 'src/@utils';
import { LoggerService } from 'src/globals';
import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ErrorOutput } from '../index';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const { method, originalUrl, protocol, ip, user, query, body } = ctx.getRequest<Request>();

    this.loggerService.logger.error(`[${method}] ${originalUrl} - All Exception Filter`);
    this.loggerService.logger.error(`protocol: ${protocol}, ip: ${ip}`);
    if (!_.isEmpty(user)) this.loggerService.logger.error(`user: ${JSON.stringify(user)}`);
    if (!_.isEmpty(body)) this.loggerService.logger.error(`body: ${JSON.stringify(body)}`);
    if (!_.isEmpty(query)) this.loggerService.logger.error(`query: ${JSON.stringify(query)}`);
    this.loggerService.logger.error(exception.stack);

    // TODO: TypeORM 에러 처리 어디까지?
    try {
      let message = exception.message || 'Internal Server Error';

      let statusCode = 500;
      if (exception instanceof HttpException) {
        const exceptionRes = exception.getResponse() as any;
        message = exceptionRes.message || message;
        statusCode = exceptionRes.statusCode;
      } else if (
        exception instanceof TokenExpiredError ||
        exception instanceof JsonWebTokenError ||
        exception instanceof NotBeforeError
      ) {
        statusCode = HttpStatus.UNAUTHORIZED;
      } else if (
        exception instanceof QueryFailedError ||
        exception instanceof EntityNotFoundError ||
        exception instanceof CannotCreateEntityIdMapError
      ) {
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      }
      this.loggerService.logger.error(`message: ${JSON.stringify(message)}`);

      res.status(statusCode).json(
        isTypeOf<ErrorOutput>({
          isSuccess: false,
          status: statusCode >= 500 ? 'error' : 'fail',
          statusCode,
          error: HttpStatus[statusCode],
          message,
        }),
      );
    } catch (err) {
      const statusCode = 500;
      const message = exception.message || 'Internal Server Error';
      this.loggerService.logger.error('This is occured inside catch block');
      this.loggerService.logger.error(err.stack);

      res.status(statusCode).json(
        isTypeOf<ErrorOutput>({
          isSuccess: false,
          status: 'error',
          statusCode,
          error: HttpStatus[statusCode],
          message,
        }),
      );
    }
  }
}

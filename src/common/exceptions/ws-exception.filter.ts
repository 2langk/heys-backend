import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { LoggerService } from 'src/globals';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    this.loggerService.logger.error(exception.stack);
    this.loggerService.logger.error(`id: ${client.id}`);

    super.catch(exception, host);
  }
}

/**
 * AllExceptionFilter에 Ws 에러가 걸리긴 하지만
 * WsException은 AppException이랑 다르게 핸들링해야 하므로
 * 웹소켓 전용 Filter를 추가함
 */

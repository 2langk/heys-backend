import { Inject, Injectable } from '@nestjs/common';
import { LogManager } from './logger.module';

@Injectable()
export class LoggerService {
  public logger: ReturnType<LogManager['winston']['createLogger']>;

  constructor(@Inject('LOG_MANAGER') private logMannager: LogManager) {
    if (process.env.NODE_ENV === 'production') {
      this.logger = this.initProductionLogger();
    } else {
      this.logger = this.initDevelopmentLogger();
    }
  }

  private initProductionLogger() {
    const { winston, winstonDaily } = this.logMannager;
    const { combine, timestamp, printf } = winston.format;
    const logFormat = printf(
      ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`,
    );

    return winston.createLogger({
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
      ),
      defaultMeta: { service: 'test' },
      transports: [
        new winstonDaily({
          level: 'error',
          filename: `%DATE%.error.log`,
          dirname: './logs/error',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new winstonDaily({
          level: 'info',
          filename: '%DATE%.info.log',
          dirname: './logs/info',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
      exceptionHandlers: [
        new winstonDaily({
          level: 'exception',
          filename: `%DATE%.exception.log`,
          dirname: './logs/exception',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  private initDevelopmentLogger() {
    const { winston } = this.logMannager;
    const { combine, timestamp, printf, colorize } = winston.format;
    const colorLogFormat = printf(({ timestamp, level, message }) =>
      colorize().colorize(level, `${timestamp} [${level.toUpperCase()}]: ${message}`),
    );

    return winston.createLogger({
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        colorLogFormat,
      ),
      defaultMeta: { service: 'test' },
      transports: [new winston.transports.Console()],
      exceptionHandlers: [new winston.transports.Console()],
    });
  }
}

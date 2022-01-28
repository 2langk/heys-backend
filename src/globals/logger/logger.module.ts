import { DynamicModule, Global, Module } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { LoggerService } from './logger.service';

export type LogManager = {
  winston: typeof winston;
  winstonDaily: typeof winstonDaily;
};

// TODO: winston aws cloud-watch
@Global()
@Module({})
export class LoggerModule {
  static register(): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOG_MANAGER',
          useValue: { winston, winstonDaily },
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}

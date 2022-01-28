import { DynamicModule, Global, Module } from '@nestjs/common';
import * as Jwt from 'jsonwebtoken';
import { JwtService } from './jwt.service';

@Global()
@Module({})
export class JwtModule {
  static register(config: JwtConfig): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        JwtService,
        {
          provide: 'JWT_MANAGER',
          useValue: { ...Jwt, config },
        },
      ],
      exports: [JwtService],
    };
  }
}

type JwtConfig = {
  secret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
};

export type JwtManager = typeof Jwt & {
  config: JwtConfig;
};

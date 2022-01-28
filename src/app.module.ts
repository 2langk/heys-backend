import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfig, RedisConfig, TypeOrmConfig, ValidationPipeConfig } from './app.config';
import { AllExceptionFilter, LoginGuard, ResponseInterceptor } from './common';
import * as GatewayModules from './gateways';
import * as GlobalModules from './globals';
import * as RouteModules from './routes';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    RouteModules.AuthModule,
    RouteModules.UserModule,
    GlobalModules.JwtModule.register(JwtConfig),
    GlobalModules.RedisModule.register(RedisConfig),
    GlobalModules.TrxModule.register(),
    GlobalModules.LoggerModule.register(),
    GlobalModules.KafkaModule.register(),
    GatewayModules.WsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(ValidationPipeConfig),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
  ],
})
export class AppModule {}

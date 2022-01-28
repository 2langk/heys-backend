import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import { CorsOption, HppOption, Port, RateLimitOption, SwaggerConfig } from './app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('/api');
  app.enable('trust proxy');
  app.enableCors(CorsOption);
  app.use(helmet());
  app.use(rateLimit(RateLimitOption));
  app.use(hpp(HppOption));
  app.use(compression());

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, SwaggerConfig));

  await app.listen(Port, () => console.log(`Server is running on ${Port}`));
}

bootstrap();

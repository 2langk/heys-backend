import { CacheModuleOptions, ValidationPipeOptions } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder } from '@nestjs/swagger';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import * as dotenv from 'dotenv';

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'development'
    ? '.env.development'
    : '.env.test';

dotenv.config({ path: envFilePath });

export const Port = +process.env.PORT || 4000;

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNC === 'true',
  logging: false,
  keepConnectionAlive: true,
};

export const JwtConfig = {
  secret: process.env.JWT_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
};

export const RedisConfig: CacheModuleOptions & { host: string; port: number } = {
  ttl: 10,
  store: process.env.NODE_ENV === 'production' ? redisStore : 'memory',
  host: process.env.REDIS_HOST,
  port: +process.env.REIDS_PORT,
};

export const ValidationPipeConfig: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { groups: ['body'] },
};

export const CorsOption: CorsOptions = {
  origin: ['http://localhost:5500', 'http://localhost:3000'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  credentials: true,
};

export const RateLimitOption = {
  max: 10000,
  windowMs: 60 * 1000,
  message: 'Too many requests from this IP',
};

export const HppOption = { whitelist: ['one', 'two', 'three'] };

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('API Documents')
  .setDescription('The API description')
  .addTag('API Version 1.0')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

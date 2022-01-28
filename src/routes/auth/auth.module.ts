import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserCategory, UserOauth } from 'src/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoStrategy } from './oauth-strategies/kakao.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserCategory, UserOauth])],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy],
  exports: [AuthService],
})
export class AuthModule {}

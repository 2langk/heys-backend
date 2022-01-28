import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/entities';
import { JwtService, RedisService } from 'src/globals';
import { getRepository } from 'typeorm';
import { IS_PUBLIC_KEY } from '../decorators/api-definition/public.decorator';
import { AppException } from '../exceptions/app-exception';

@Injectable()
export class LoginGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const accessTokenPayload = await this.decodeAccessToken(req);
    if (!accessTokenPayload) return false;

    const user = await this.findCurrUserById(accessTokenPayload.id);
    if (!user || user.secretKey !== accessTokenPayload.secretKey) {
      throw new AppException('invalid user secretKey. please login again', HttpStatus.UNAUTHORIZED);
    }

    req.user = user;
    return true;
  }

  private async decodeAccessToken(req: Request) {
    if (!req.headers.authorization) return false;

    const accessToken = req.headers.authorization.split('Bearer ')[1];
    if (!accessToken) return false;

    const accessTokenPayload = await this.jwtService.decodeAccessToken(accessToken);
    return accessTokenPayload;
  }

  private async findCurrUserById(userId: number) {
    let user: User;
    const userCache = await this.redisService.getOneByKey<User>(`user:${userId}`);
    if (userCache) {
      user = getRepository(User).create(userCache); // 직렬화 때문에 (/user/me API는 캐싱을 interceptor에서 안 하는 특이 케이스, 나중에 바뀔수도..?)
    } else {
      user = await getRepository(User).findOneOrFail(userId);
      await this.redisService.setOneByKey(`user:${user.id}`, user);
    }

    return user;
  }
}
/**
 * # req.headers.authorization의 accessToken을 검사하는 로직
 *
 * 컨트롤러 레벨까지는 모두 다 DI 안해도 괜찮을듯?
 * ex) getRepository
 *
 * accessToken is expired: refresh token으로 access token을 재발급 받는다
 * invalid user secretKey:
 * - 이전 버전의 access token을 의미함.
 * - 해당 버전의 refreshToken도 사용 불가하므로 아예 로그인을 새로 해야함.
 */

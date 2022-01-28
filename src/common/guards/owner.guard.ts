import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRoleEnum } from 'src/entities';
import { RedisService } from 'src/globals';
import { getRepository } from 'typeorm';
import { OWNER_KEY } from '../decorators/api-definition/owner.decorator';
import { AppException } from '../exceptions/app-exception';

/**
 * @deprecated Don't use this guard directly, it depends on @ApiDefinition()
 */
@Injectable()
export class OwnerGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const currentUser = req.user;
    const targetId = req.params.id;
    if (!currentUser)
      throw new AppException('Cannot find current user in Owner Guard', HttpStatus.UNAUTHORIZED);

    const entityName = this.reflector.getAllAndOverride<string>(OWNER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const entityRepository = getRepository(entityName);
    const redisKey = `${entityName}:${targetId}`;
    const cache = await this.redisService.getOneByKey(redisKey);

    let target: unknown;
    if (cache) {
      target = cache;
    } else {
      target = await entityRepository.findOneOrFail(targetId);
      await this.redisService.setOneByKey(redisKey, target);
    }

    if (!target) throw new AppException('Cannot find record in Owner Guard', HttpStatus.NOT_FOUND);

    if (currentUser.role === UserRoleEnum.Admin) return true;

    if (entityName === 'user') {
      return currentUser.id === target['id'];
    } else {
      return currentUser.id === target['userId'];
    }
  }
}

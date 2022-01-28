import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRoleEnum } from 'src/entities';
import { RolesGuard } from '../../guards/roles.guard';

export const ROLES_KEY = 'roles';

/**
 * @deprecated Don't use this decorator directly, it depends on @ApiDefinition()
 */
export const Roles = (roles?: UserRoleEnum[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));

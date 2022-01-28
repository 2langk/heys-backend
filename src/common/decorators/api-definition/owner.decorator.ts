import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnerGuard } from '../../guards/owner.guard';

export const OWNER_KEY = 'permission';

/**
 * @deprecated Don't use this decorator directly, it depends on @ApiDefinition()
 */
export const Owner = (entityName: string) =>
  applyDecorators(SetMetadata(OWNER_KEY, entityName), UseGuards(OwnerGuard));

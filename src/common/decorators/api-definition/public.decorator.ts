import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @deprecated Don't use this decorator directly, it depends on @ApiDefinition()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

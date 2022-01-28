import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/entities';
import { Owner } from './owner.decorator';
import { Public } from './public.decorator';
import { Roles } from './roles.decorator';
import { BaseOutput } from '../../bases/base.output';

type Params = {
  summary: string;
  response?: any;
  isPublic?: boolean;
  role?: UserRoleEnum | UserRoleEnum[];
  owner?: string;
};

/* eslint-disable @typescript-eslint/no-empty-function */
export const ApiDefinition = (params: Params) => {
  const { summary, response, isPublic, role, owner } = params;

  let roles: UserRoleEnum[];
  if (Array.isArray(role)) {
    roles = role;
  } else {
    roles = [role];
  }

  return applyDecorators(
    ApiResponse({ type: response || BaseOutput }),
    ApiOperation({ summary }),
    isPublic ? Public() : ApiBearerAuth(),
    role ? Roles(roles) : () => {},
    owner ? Owner(owner) : () => {},
  );
};

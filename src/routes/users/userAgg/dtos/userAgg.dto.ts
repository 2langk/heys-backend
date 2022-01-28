import { PartialType, PickType } from '@nestjs/swagger';
import { User } from 'src/entities';

export class UpdateUserAggDto extends PartialType(PickType(User, ['image'])) {}

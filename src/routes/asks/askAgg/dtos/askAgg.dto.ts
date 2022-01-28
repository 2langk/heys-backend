import { PartialType, PickType } from '@nestjs/swagger';
import { Ask } from 'src/entities';

export class CreateAskAggDto extends PickType(Ask, ['title', 'content', 'creator', 'image']) {}

export class UpdateAskAggDto extends PartialType(CreateAskAggDto) {}

import { PartialType, PickType } from '@nestjs/swagger';
import { AskLike } from 'src/entities';

export class CreateAskLikeDto extends PickType(AskLike, ['isLiked']) {}

export class UpdateAskLikeDto extends PartialType(CreateAskLikeDto) {}

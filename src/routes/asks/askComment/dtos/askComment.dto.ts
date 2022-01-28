import { PickType } from '@nestjs/swagger';
import { AskComment } from 'src/entities';

export class CreateAskCommentDto extends PickType(AskComment, ['content', 'parentId']) {}

export class UpdateAskCommentDto extends PickType(AskComment, ['content']) {}

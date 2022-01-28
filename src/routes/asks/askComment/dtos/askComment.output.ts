import { ApiProperty } from '@nestjs/swagger';
import { BaseOutput } from 'src/common';
import { AskComment } from 'src/entities';

export class AskCommentOutput extends BaseOutput {
  @ApiProperty({ type: () => AskComment })
  postComment: AskComment;
}

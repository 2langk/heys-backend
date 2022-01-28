import { ApiProperty } from '@nestjs/swagger';
import { BaseOutput } from 'src/common';
import { AskLike } from 'src/entities';

export class AskLikeOutput extends BaseOutput {
  @ApiProperty({ type: () => AskLike })
  askLike: AskLike;
}

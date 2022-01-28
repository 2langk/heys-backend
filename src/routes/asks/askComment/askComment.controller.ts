import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDefinition, CurrUser, EvictCache } from 'src/common';
import { AskCommentService } from './askComment.service';
import { CreateAskCommentDto, UpdateAskCommentDto } from './dtos/askComment.dto';
import { AskCommentOutput } from './dtos/askComment.output';

@ApiTags('AskComment')
@Controller('/asks')
@EvictCache('/comments')
export class AskCommentController {
  public constructor(private readonly askCommentService: AskCommentService) {}

  @Post('/:askId/comments')
  @ApiDefinition({ summary: '청원 게시글에 댓글 작성하기', response: AskCommentOutput })
  async createPostComment(
    @CurrUser('id') userId: number,
    @Param('askId') askId: number,
    @Body() data: CreateAskCommentDto,
  ): Promise<AskCommentOutput> {
    const postComment = await this.askCommentService.createAskComment(userId, askId, data);
    return { postComment };
  }

  @Put('/:askId/comments/:id')
  @ApiDefinition({ summary: '청원 게시글의 댓글 수정하기', owner: 'ask_comment' })
  async updatePostComment(@Param('id') postCommentId: number, @Body() data: UpdateAskCommentDto) {
    await this.askCommentService.updateAskComment(postCommentId, data);
  }

  @Delete('/:askId/comments/:id')
  @ApiDefinition({ summary: '청원 게시글의 댓글 삭제하기', owner: 'ask_comment' })
  async softDeletePostComment(@Param('id') postCommentId: number) {
    await this.askCommentService.softDeleteAskComment(postCommentId);
  }
}

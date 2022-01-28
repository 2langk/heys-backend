import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDefinition, CurrUser, EvictCache } from 'src/common';
import { AskLikeService } from './askLike.service';
import { CreateAskLikeDto, UpdateAskLikeDto } from './dtos/askLike.dto';
import { AskLikeOutput } from './dtos/askLike.output';

@ApiTags('AskLike')
@Controller('/asks')
@EvictCache('/likes')
export class AskLikeController {
  constructor(private readonly askLikeService: AskLikeService) {}

  @Post('/:askId/likes')
  @ApiDefinition({ summary: '청원 게시글에 좋아요/싫어요하기', response: AskLikeOutput })
  async createPostLike(
    @CurrUser('id') userId: number,
    @Param('askId') askId: number,
    @Body() data: CreateAskLikeDto,
  ): Promise<AskLikeOutput> {
    const askLike = await this.askLikeService.createPostLike(userId, askId, data);
    return { askLike };
  }

  @Put('/:askId/likes/:id')
  @ApiDefinition({ summary: '청원 게시글에 좋아요/싫어요 수정하기', owner: 'ask_like' })
  async updatePostLike(@Param('id') askLikeId: number, @Body() data: UpdateAskLikeDto) {
    await this.askLikeService.updatePostLike(askLikeId, data);
  }

  @Delete('/:askId/likes/:id')
  @ApiDefinition({ summary: '청원 게시글에 좋아요/싫어요 삭제하기', owner: 'ask_like' })
  async deletePostLike(@Param('id') askLikeId: number) {
    await this.askLikeService.deletePostLike(askLikeId);
  }
}

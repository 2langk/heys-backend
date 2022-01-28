import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDefinition, CurrUser } from 'src/common';
import { FindAllQueryDto } from 'src/entities/@queries';
import { AskAggService } from './askAgg.service';
import { CreateAskAggDto, UpdateAskAggDto } from './dtos/askAgg.dto';
import { AskOutput, AsksOutput } from './dtos/askAgg.output';

@ApiTags('AskAggregate')
@Controller('/asks')
export class AskAggController {
  constructor(private readonly askAggService: AskAggService) {}

  /** Commands */
  @Post('/')
  @ApiDefinition({ summary: '청원 게시글 생성하기', response: AskOutput })
  async createPostAgg(
    @CurrUser('id') userId: number,
    @Body() data: CreateAskAggDto,
  ): Promise<AskOutput> {
    const ask = await this.askAggService.createAskAgg(userId, data);
    return { ask };
  }

  @Put('/:id')
  @ApiDefinition({ summary: '청원 게시글 수정하기', owner: 'ask' })
  async updatePostAgg(@Param('id') askId: number, @Body() data: UpdateAskAggDto) {
    await this.askAggService.updateAskAgg(askId, data);
  }

  @Delete('/:id')
  @ApiDefinition({ summary: '청원 게시글 삭제하기', owner: 'ask' })
  async softDeletePostAggregate(@Param('id') askId: number) {
    await this.askAggService.softDeleteAskAgg(askId);
  }

  /** Queries */
  @Get('/:id')
  @ApiDefinition({
    summary: '청원 게시글 하나 가져오기',
    response: AskOutput,
    isPublic: true,
  })
  async findOnePostById(@Param('id') askId: number): Promise<AskOutput> {
    const ask = await this.askAggService.findOneAskById(askId);
    return { ask };
  }

  @Get('/')
  @ApiDefinition({
    summary: '청원 게시글 목록 가져오기',
    response: AsksOutput,
    isPublic: true,
  })
  async findAllPostsByQuery(@Query() query: FindAllQueryDto): Promise<AsksOutput> {
    const asks = await this.askAggService.findAllAsksByQuery(query);
    return { asks };
  }
}

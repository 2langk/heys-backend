import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ask } from 'src/entities';
import { AskQueryManager, FindAllQueryDto } from 'src/entities/@queries';
import { Repository } from 'typeorm';

@Injectable()
export class AskAggQuery {
  private readonly askQuery: AskQueryManager;

  public constructor(
    @InjectRepository(Ask)
    private readonly askRepository: Repository<Ask>,
  ) {
    this.askQuery = AskQueryManager(this.askRepository);
  }

  async findOneAskById(askId: number) {
    const ask = await this.askQuery
      .build()
      .id(askId)
      .leftJoinAndSelect('ask.user', 'user')
      .leftJoinAndSelect('ask.askLikes', 'askLike')
      .leftJoinAndSelect('ask.askComments', 'askComment', 'askComment.parentId is null')
      .leftJoinAndSelect('askComment.children', 'askSubComment')
      .addSelect(['ask.createdAt', 'ask.updatedAt'])
      .getOneOrFail();

    return ask;
  }

  async findOneByTitle(title: string) {
    const ask = await this.askQuery
      .build()
      .title(title)
      .leftJoinAndSelect('ask.askLikes', 'askLike')
      .getOneOrFail();

    return ask;
  }

  async findAllAsksByQuery(query: FindAllQueryDto) {
    if (!query.joins) {
      query.joins = JSON.stringify([{ property: 'ask.user', alias: 'user' }]);
    }
    const asks = await this.askQuery.manager.findAllByQuery(query);
    return asks;
  }
}

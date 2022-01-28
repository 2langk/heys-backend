import { Injectable } from '@nestjs/common';
import { FindAllQueryDto } from 'src/entities/@queries';
import { AskAggCommand } from './askAgg.command';
import { AskAggQuery } from './askAgg.query';
import { CreateAskAggDto, UpdateAskAggDto } from './dtos/askAgg.dto';

@Injectable()
export class AskAggService {
  public constructor(
    private readonly askAggCommand: AskAggCommand,
    private readonly askAggQuery: AskAggQuery,
  ) {}

  /** Commands */
  async createAskAgg(userId: number, data: CreateAskAggDto) {
    return await this.askAggCommand.withTransaction(async () => {
      const { title, content, creator, image } = data;

      const ask = await this.askAggCommand.createRootAsk(userId, {
        title,
        content,
        creator,
        image,
      });

      return ask;
    });
  }

  async updateAskAgg(askId: number, data: UpdateAskAggDto) {
    await this.askAggCommand.withTransaction(async () => {
      const { title, content, creator, image } = data;

      await this.askAggCommand.updateRootAsk(askId, { title, content, creator, image });
    });
  }

  async softDeleteAskAgg(askId: number) {
    await this.askAggCommand.withTransaction(async () => {
      await this.askAggCommand.softDeleteRootAsk(askId);
    });
  }

  /** Queries */
  async findOneAskById(askId: number) {
    const ask = await this.askAggQuery.findOneAskById(askId);
    return ask;
  }

  async findAllAsksByQuery(query: FindAllQueryDto) {
    const asks = await this.askAggQuery.findAllAsksByQuery(query);
    return asks;
  }
}

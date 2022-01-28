import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ask } from 'src/entities';
import { CommandHelper, CommandManager } from 'src/entities/@commands';
import { TrxService } from 'src/globals';
import { QueryRunner, Repository } from 'typeorm';
import { CreateAskAggDto, UpdateAskAggDto } from './dtos/askAgg.dto';

@Injectable()
export class AskAggCommand extends CommandHelper {
  private askCommand: CommandManager<Ask>;

  public constructor(
    @InjectRepository(Ask)
    private readonly askRepository: Repository<Ask>,
    protected readonly trxService: TrxService,
  ) {
    super();
  }

  protected registerCommandManagers(queryRunner?: QueryRunner) {
    commandInit.call(this, queryRunner);
  }

  async createRootAsk(userId: number, data: CreateAskAggDto) {
    return await this.askCommand.createOne({ ...data, userId });
  }

  async updateRootAsk(askId: number, data: UpdateAskAggDto) {
    return await this.askCommand.updateOne(askId, data);
  }

  async softDeleteRootAsk(askId: number) {
    return await this.askCommand.softDeleteOne(askId);
  }
}

async function commandInit(queryRunner?: QueryRunner) {
  if (queryRunner) {
    this.askCommand = CommandManager(queryRunner.manager.getRepository(Ask));
  } else {
    this.askCommand = CommandManager(this.askRepository);
  }
}

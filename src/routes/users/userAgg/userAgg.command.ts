import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { CommandHelper, CommandManager } from 'src/entities/@commands';
import { TrxService } from 'src/globals';
import { QueryRunner, Repository } from 'typeorm';
import { UpdateUserAggDto } from './dtos/userAgg.dto';

@Injectable()
export class UserAggCommand extends CommandHelper {
  private userCommand: CommandManager<User>;

  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    protected readonly trxService: TrxService,
  ) {
    super();
  }

  protected registerCommandManagers(queryRunner?: QueryRunner) {
    if (queryRunner) {
      this.userCommand = CommandManager(queryRunner.manager.getRepository(User));
    } else {
      this.userCommand = CommandManager(this.userRepository);
    }
  }

  async updateRootUser(userId: number, data: UpdateUserAggDto) {
    return await this.userCommand.updateOne(userId, data);
  }

  async softDeleteRootUser(userId: number) {
    return await this.userCommand.softDeleteOne(userId);
  }
}

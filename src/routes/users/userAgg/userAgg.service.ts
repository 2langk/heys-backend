import { Injectable } from '@nestjs/common';
import { FindAllQueryDto } from 'src/entities/@queries';
import { UpdateUserAggDto } from './dtos/userAgg.dto';
import { UserAggCommand } from './userAgg.command';
import { UserAggQuery } from './userAgg.query';

export { UserAggCommand, UserAggQuery };

@Injectable()
export class UserAggService {
  public constructor(
    private readonly userAggCommand: UserAggCommand,
    private readonly userAggQuery: UserAggQuery,
  ) {}

  /** Commands */
  async updateUserAgg(userId: number, data: UpdateUserAggDto) {
    await this.userAggCommand.withTransaction(async () => {
      await this.userAggCommand.updateRootUser(userId, data);
    });
  }

  async softDeleteUserAgg(userId: number) {
    await this.userAggCommand.withTransaction(async () => {
      await this.userAggCommand.softDeleteRootUser(userId);
    });
  }

  /** Queries */
  async findOneUserById(userId: number) {
    const user = await this.userAggQuery.findOneByUserId(userId);
    return user;
  }

  async findAllUserByQuery(query: FindAllQueryDto) {
    const users = await this.userAggQuery.findAllUsersByQuery(query);
    return users;
  }
}

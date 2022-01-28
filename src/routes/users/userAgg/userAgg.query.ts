import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { FindAllQueryDto, UserQueryManager } from 'src/entities/@queries';
import { Repository } from 'typeorm';

@Injectable()
export class UserAggQuery {
  private readonly userQuery: UserQueryManager;

  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.userQuery = UserQueryManager(this.userRepository);
  }

  async findOneByUserId(userId: number) {
    const user = await this.userQuery.build().id(userId).getOneOrFail();

    return user;
  }

  async findAllUsersByQuery(query: FindAllQueryDto) {
    // if (!query.joins) {
    //   query.joins = JSON.stringify([{ property: 'user.posts', alias: 'post' }]);
    // }
    const users = await this.userQuery.manager.findAllByQuery(query);
    return users;
  }
}

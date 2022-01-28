import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDefinition, CurrUser } from 'src/common';
import { User, UserRoleEnum } from 'src/entities';
import { FindAllQueryDto } from 'src/entities/@queries';
import { UpdateUserAggDto } from './dtos/userAgg.dto';
import { UserOutput, UsersOutput } from './dtos/userAgg.output';
import { UserAggService } from './userAgg.service';

@ApiTags('UserAggregate')
@Controller('/users')
export class UserAggController {
  constructor(private readonly userAggService: UserAggService) {}

  /** Commands */
  @Put('/:id')
  @ApiDefinition({ summary: '유저 정보 수정하기', owner: 'user' })
  async updateUserAgg(@Param('id') userId: number, @Body() data: UpdateUserAggDto) {
    await this.userAggService.updateUserAgg(userId, data);
  }

  @Delete('/:id')
  @ApiDefinition({ summary: '유저 삭제하기', owner: 'user' })
  async softDeleteUserAgg(@Param('id') userId: number) {
    await this.userAggService.softDeleteUserAgg(userId);
  }

  /** Queries */
  @Get('/me')
  @ApiDefinition({ summary: '내 정보 가져오기', response: UserOutput })
  getCurrUser(@CurrUser() user: User): UserOutput {
    return { user };
  }

  // @Get('/')
  // @ApiDefinition({
  //   summary: '(관리자) 유저 목록 가져오기',
  //   response: UsersOutput,
  //   role: UserRoleEnum.Admin,
  // })
  // async findAllUsersByQuery(@Query() query: FindAllQueryDto): Promise<UsersOutput> {
  //   const users = await this.userAggService.findAllUserByQuery(query);
  //   return { users };
  // }

  // @Get('/:id')
  // @ApiDefinition({
  //   summary: '(관리자) 유저 하나 가져오기',
  //   response: UserOutput,
  //   role: UserRoleEnum.Admin,
  // })
  // async findOneUserById(@Param('id') userId: number): Promise<UserOutput> {
  //   const user = await this.userAggService.findOneUserById(userId);
  //   return { user };
  // }
}

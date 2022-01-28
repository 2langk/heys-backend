import { ApiProperty } from '@nestjs/swagger';
import { BaseOutput } from 'src/common';
import { User } from 'src/entities';

export class UserOutput extends BaseOutput {
  @ApiProperty({ type: () => User })
  user: User;
}

export class UsersOutput extends BaseOutput {
  @ApiProperty({ type: () => [User] })
  users: User[];
}

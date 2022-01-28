import { ApiProperty } from '@nestjs/swagger';

export class BaseOutput {
  @ApiProperty({ example: true })
  isSuccess?: boolean;

  @ApiProperty({ example: false })
  fromCache?: boolean;
}

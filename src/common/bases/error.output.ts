import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorOutput {
  @ApiProperty({ example: false })
  isSuccess: boolean;

  @ApiProperty({ example: 'fail' })
  status: 'fail' | 'error';

  @ApiProperty({ example: 404 })
  statusCode: HttpStatus;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  error: string;

  @ApiProperty({ example: 'Cannot find this post' })
  message: string;
}

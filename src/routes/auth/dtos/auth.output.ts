import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseOutput } from 'src/common';

export class AuthTokensOutput extends BaseOutput {
  @ApiProperty({ example: 'access token' })
  accessToken: string;

  @ApiPropertyOptional({ example: 'refresh token' })
  refreshToken?: string;
}

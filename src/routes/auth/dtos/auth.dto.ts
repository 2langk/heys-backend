import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsJWT, ValidateNested } from 'class-validator';
import { User, UserCategory } from 'src/entities';

export class SignUpDto extends PickType(User, [
  'name',
  'phone',
  'age',
  'gender',
  'password',
  'role',
]) {
  @ApiProperty({ type: () => [PickType(UserCategory, ['categoryId', 'preference'])] })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => PickType(UserCategory, ['categoryId', 'preference']))
  @ValidateNested({ each: true })
  userCategories: Pick<UserCategory, 'categoryId' | 'preference'>[];
}

export class SignInDto extends PickType(User, ['phone', 'password']) {}

export class RefreshAccessTokenDto {
  @ApiProperty({ example: 'access token(expired)' })
  @IsJWT()
  accessToken: string;

  @ApiProperty({ example: 'refresh token' })
  @IsJWT()
  refreshToken: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import BaseEntity from '../base.entity';
import { User } from '../index';

export enum UserOauthProviderEnum {
  Kakao = 'kakao',
  Google = 'google',
}

@Entity()
export class UserOauth extends BaseEntity {
  /** Table Columns */
  @ApiProperty({ example: 'kakao' })
  @Column({ type: 'enum', enum: UserOauthProviderEnum })
  @IsEnum(UserOauthProviderEnum)
  oauthProvider: UserOauthProviderEnum;

  @ApiProperty({ example: 'kakaoId' })
  @Column({ type: 'varchar' })
  @IsString()
  oauthId: string;

  @ApiProperty({ example: 'access token' })
  @Column({ type: 'varchar' })
  @IsString()
  accessToken: string;

  @ApiProperty({ example: 'refresh token' })
  @Column({ type: 'varchar' })
  @IsString()
  refreshToken: string;

  /** Foreign keys */
  @ApiProperty({ example: '123' })
  @Column({ type: 'number' })
  @IsNumber()
  userId: number;

  /** Relations */
  @ApiPropertyOptional({ example: 'User Information', type: () => User }) // *lazy-loading
  @OneToOne(() => User, (user) => user.userOauth)
  @JoinColumn()
  user: User;
}

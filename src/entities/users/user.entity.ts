import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { UserCategory } from './userCategory.entity';
import BaseEntity from '../base.entity';
import { Ask, AskComment, AskLike, UserOauth } from '../index';

export enum UserRoleEnum {
  Admin = 'admin',
  User = 'user',
}

export enum UserGenderEnum {
  Mail = '남자',
  Femail = '여자',
}

@Entity()
export class User extends BaseEntity {
  /** Table Columns */
  @ApiProperty({ example: '이름' })
  @Column({ type: 'varchar' })
  @IsString()
  name: string;

  @ApiProperty({ example: '01012341234' })
  @Column({ type: 'varchar', unique: true })
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({ example: '20' })
  @Column({ type: 'varchar' })
  @IsString()
  age: string;

  @ApiProperty({ enum: UserGenderEnum })
  @Column({ type: 'enum', enum: UserGenderEnum })
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;

  @ApiProperty({ example: 'user' })
  @Column({ type: 'enum', enum: UserRoleEnum })
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @Exclude({ toPlainOnly: true })
  @ApiProperty({ example: '12341234' })
  @Column({ type: 'varchar', nullable: true })
  @IsString()
  password?: string;

  @ApiProperty({ example: 'profile image' })
  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  image?: string;

  @Exclude({ toPlainOnly: true })
  @ApiProperty({ example: 'secretKey for auth token' })
  @Column({ type: 'varchar' })
  @IsString()
  secretKey: string;

  /** Relations */
  @ApiPropertyOptional({ example: 'Oauth Information', type: () => UserOauth }) // *lazy-loading
  @OneToOne(() => UserOauth, (userOauth) => userOauth.user)
  userOauth?: UserOauth;

  @ApiPropertyOptional({ example: ['Category1', 'Category2'], type: () => [UserCategory] }) // *lazy-loading
  @OneToOne(() => UserCategory, (userCategory) => userCategory.user)
  userCategories?: UserCategory[];

  // @ApiPropertyOptional({ example: ['Ask1', 'Ask2'], type: () => [Ask] }) // *lazy-loading
  @OneToMany(() => Ask, (ask) => ask.user)
  asks?: Ask[];

  // @ApiPropertyOptional({ example: ['AskComment1', 'AskComment2'], type: () => [AskComment] }) // *lazy-loading
  @OneToMany(() => AskComment, (askComment) => askComment.user)
  askComments?: AskComment[];

  // @ApiPropertyOptional({ example: ['AskLike1', 'AskLike2'], type: () => [AskLike] }) // *lazy-loading
  @OneToMany(() => AskLike, (askLike) => askLike.user)
  askLikes?: AskLike[];

  /** Instance Methods */
  async comparePassword(passwordInput: string) {
    return await bcrypt.compare(passwordInput, this.password);
  }
}

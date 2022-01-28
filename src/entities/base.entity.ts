import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class BaseEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @ApiProperty({ example: '2021-01-01...' })
  @CreateDateColumn({ select: false })
  @IsString()
  createdAt: Date;

  @ApiProperty({ example: '2021-01-01...' })
  @UpdateDateColumn({ select: false })
  @IsString()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ select: false })
  @IsString()
  deletedAt: Date;
}

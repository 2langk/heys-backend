import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from '../base.entity';
import { AskComment, AskLike, User } from '../index';

@Entity()
export class Ask extends BaseEntity {
  /** Table Columns */
  @ApiProperty({ example: 'ask title' })
  @Column({ type: 'varchar' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'ask content' })
  @Column({ type: 'varchar' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'ask creator' }) // TODO: 정규화 필요
  @Column({ type: 'varchar' })
  @IsString()
  creator: string;

  @ApiProperty({ example: 'ask image' })
  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  image?: string;

  /** Foreign keys */
  @ApiProperty({ example: 100 })
  @Column({ type: 'int', nullable: true })
  @IsNumber()
  userId: number;

  /** Relations */
  @ApiPropertyOptional({ example: 'Author information', type: () => User }) // *lazy-loading
  @ManyToOne(() => User, (user) => user.asks)
  @JoinColumn()
  user?: User;

  @ApiPropertyOptional({ example: ['AskComment1', 'AskComment2'], type: () => [AskComment] }) // *lazy-loading
  @OneToMany(() => AskComment, (askComment) => askComment.ask)
  askComments?: AskComment[];

  @ApiPropertyOptional({ example: ['AskLike1', 'AskLike2'], type: () => [AskLike] }) // *lazy-loading
  @OneToMany(() => AskLike, (askLike) => askLike.ask)
  askLikes?: AskLike[];
}

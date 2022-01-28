import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from '../base.entity';
import { Ask, User } from '../index';

@Entity()
export class AskComment extends BaseEntity {
  /** Table Columns */
  @ApiProperty({ example: 'contents' })
  @Column({ type: 'varchar' })
  @IsString()
  content: string;

  /** Foreign keys */
  @ApiProperty({ example: 100 })
  @Column({ type: 'int' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 100 })
  @Column({ type: 'int' })
  @IsNumber()
  askId: number;

  @ApiPropertyOptional({ example: 100 })
  @Column({ type: 'int', nullable: true })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  /** Relations */
  @ApiPropertyOptional({ example: 'A user who writes this comment', type: () => User }) // *lazy-loading
  @ManyToOne(() => User, (user) => user.askComments)
  @JoinColumn()
  user?: User;

  @ApiPropertyOptional({ example: 'Target Ask', type: () => Ask }) // *lazy-loading
  @ManyToOne(() => Ask, (ask) => ask.askComments)
  @JoinColumn()
  ask?: Ask;

  @ApiPropertyOptional({ example: 'Parent Comment', type: () => AskComment }) // *lazy-loading
  @ManyToOne(() => AskComment, (askComment) => askComment.children)
  parent?: AskComment;

  @ApiPropertyOptional({ example: 'Children Comment', type: () => [AskComment] }) // *lazy-loading
  @OneToMany(() => AskComment, (askComment) => askComment.parent)
  children?: AskComment[];
}

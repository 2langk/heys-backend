import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../base.entity';
import { Ask, User } from '../index';

@Entity()
@Index(['userId', 'askId'], { unique: true })
export class AskLike extends BaseEntity {
  /** Table Columns */
  @ApiProperty({ example: true })
  @Column({ type: 'boolean' })
  @IsBoolean()
  isLiked: boolean;

  /** Foreign keys */
  @ApiProperty({ example: 100 })
  @Column({ type: 'int' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 100 })
  @Column({ type: 'int' })
  @IsNumber()
  askId: number;

  /** Relations */
  @ApiPropertyOptional({ example: 'A user who like/dislike target post', type: () => User }) // *lazy-loading
  @ManyToOne(() => User, (user) => user.askLikes)
  @JoinColumn()
  user?: User;

  @ApiPropertyOptional({ example: 'Target post', type: () => Ask }) // *lazy-loading
  @ManyToOne(() => Ask, (ask) => ask.askLikes)
  @JoinColumn()
  ask?: Ask;
}

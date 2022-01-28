import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../base.entity';
import { Category, User } from '../index';

@Entity()
@Index(['userId', 'categoryId'], { unique: true })
export class UserCategory extends BaseEntity {
  /** Table Columns */
  @ApiProperty({ example: 1 })
  @Column({ type: 'smallint' })
  @IsNumber()
  preference: number;

  /** Foreign keys */
  @ApiProperty({ example: 100 })
  @Column({ type: 'int' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 2 })
  @Column({ type: 'int' })
  @IsNumber()
  categoryId: number;

  /** Relations */
  @ApiPropertyOptional({ example: 'A user who prefer this category', type: () => User }) // *lazy-loading
  @ManyToOne(() => User, (user) => user.userCategories)
  @JoinColumn()
  user?: User;

  @ApiPropertyOptional({ example: 'Target category', type: () => Category }) // *lazy-loading
  @ManyToOne(() => Category, (category) => category.userCategories)
  @JoinColumn()
  category?: Category;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import BaseEntity from '../base.entity';
import { UserCategory } from '../index';

export enum CategoryNameEnum {
  Idea = '기획/아이디어',
  Design = '디자인',
  IT = 'IT',
  Marketing = '광고/마케팅',
  Language = '언어',
  Content = '미디어/콘텐츠',
  Finance = '금융/경제',
  Exam = '시험',
  Etc = '기타',
}

@Entity()
@Tree('materialized-path')
export class Category extends BaseEntity {
  /** Table Columns */
  @ApiProperty({ example: 'category name' })
  @Column({ type: 'enum', enum: CategoryNameEnum, unique: true })
  @IsString()
  name: CategoryNameEnum;

  @ApiProperty({ example: 'category description' })
  @Column({ type: 'varchar' })
  @IsString()
  description: string;

  /** Relations */
  @ApiPropertyOptional({ example: 'Parent Category', type: () => Category }) // *lazy-loading
  @TreeParent()
  parent?: Category;

  @ApiPropertyOptional({ example: ['ChildCategory1', 'ChildCategory2'], type: () => [Category] }) // *lazy-loading
  @TreeChildren()
  children?: Category[];

  @ApiPropertyOptional({ example: ['UserCategory1', 'UserCategory2'], type: () => [UserCategory] }) // *lazy-loading
  @OneToMany(() => UserCategory, (userCategory) => userCategory.category)
  userCategories?: UserCategory[];
}

/**
 * Should insert seed data
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Repository } from 'typeorm';
import BaseEntity from '../base.entity';

class Entity extends BaseEntity {
  [prop: string]: any;
}

export class FindAllQueryDto {
  @ApiPropertyOptional({ example: '[{ "property": "ask.askLike", "alias": "askLike" }]' })
  @IsString()
  @IsOptional()
  joins?: string;

  @ApiPropertyOptional({ example: '[{ "column": "title", "operator": "=", "value": "post" }]' })
  @IsString()
  @IsOptional()
  wheres?: string;

  @ApiPropertyOptional({ example: '{ "column": "id", "sort": "ASC" }' })
  @IsString()
  @IsOptional()
  order?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsString()
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsString()
  @IsOptional()
  page?: string;
}

type JoinOption = {
  property: string;
  alias: string;
};

type WhereOption = {
  column: string;
  operator: 'ilike' | '=' | 'in';
  value: string | number;
};

type OrderOption = {
  column: string;
  sort: 'ASC' | 'DESC';
};

export type QueryManager<T extends Entity> = {
  findAllByQuery: (query?: FindAllQueryDto) => Promise<T[]>;
};

export function QueryManager<T extends Entity>(entityRepository: Repository<T>): QueryManager<T> {
  const entityName = entityRepository.metadata.name.toLocaleLowerCase();

  async function findAllByQuery(query: FindAllQueryDto) {
    const qb = entityRepository.createQueryBuilder(entityName);
    const { joins, wheres, order, limit, page } = query;

    if (joins) {
      const joinOptions = JSON.parse(joins) as JoinOption[];

      for (const joinOption of joinOptions) {
        const { property, alias } = joinOption;
        qb.leftJoinAndSelect(property, alias);
      }
    }

    if (wheres) {
      const whereOptions = JSON.parse(wheres) as WhereOption[];

      for (const whereOption of whereOptions) {
        const { column, operator, value } = whereOption;
        qb.andWhere(`${entityName}.${column} ${operator} :value`, { value });
      }
    }

    if (order) {
      const { column, sort } = JSON.parse(order) as OrderOption;
      qb.orderBy(`${entityName}.${column}`, sort);
    }

    const take = limit ? +limit : 100;
    const skip = page ? (+page - 1) * take : 0;

    qb.skip(skip).take(take);

    return await qb.getMany();
  }

  return {
    findAllByQuery,
  };
}

/**
 * Manager:
 * Repository를 Argument로 넣으면,
 * Repository를 조회하는 함수 리턴
 * queryBuilder에 dependency를 걸어서 사용할 예정
 */

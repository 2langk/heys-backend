import { Repository, SelectQueryBuilder } from 'typeorm';
import { QueryManager } from './@query.manager';
import { Ask } from '../index';

export type AskQueryManager = ReturnType<typeof AskQueryManager>;
export const AskQueryManager = (repository: Repository<Ask>) => {
  const build = function () {
    const entityName = 'ask';
    const qb = repository.createQueryBuilder(entityName) as SelectQueryBuilder<Ask> & typeof Wheres;

    /** Columns */
    const id = (value: number) => {
      return qb.andWhere(`${entityName}.id = :value`, { value });
    };

    const title = (value: string) => {
      return qb.andWhere(`${entityName}.title = :value`, { value });
    };

    const creator = (value: string) => {
      return qb.andWhere(`${entityName}.creator = :value`, { value });
    };

    const Wheres = { id, title, creator };
    for (const key in Wheres) {
      qb[key] = Wheres[key];
    }

    return qb;
  };

  const manager = QueryManager(repository);

  return { build, manager };
};

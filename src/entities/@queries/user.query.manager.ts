import { Repository, SelectQueryBuilder } from 'typeorm';
import { QueryManager } from './@query.manager';
import { User } from '../index';

export type UserQueryManager = ReturnType<typeof UserQueryManager>;
export const UserQueryManager = (repository: Repository<User>) => {
  const build = function () {
    const entityName = 'user';
    const qb = repository.createQueryBuilder(entityName) as SelectQueryBuilder<User> &
      typeof Wheres;

    /** Columns */
    const id = (value: number) => {
      return qb.andWhere(`${entityName}.id = :value`, { value });
    };

    const phone = (value: string) => {
      return qb.andWhere(`${entityName}.phone = :value`, { value });
    };

    const name = (value: string) => {
      return qb.andWhere(`${entityName}.name = :value`, { value });
    };

    const Wheres = { id, phone, name };
    for (const key in Wheres) {
      qb[key] = Wheres[key];
    }

    return qb;
  };

  const manager = QueryManager(repository);

  return { build, manager };
};

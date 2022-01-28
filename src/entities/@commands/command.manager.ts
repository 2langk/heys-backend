import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/common';
import { User, UserRoleEnum } from 'src/entities';
import { FindConditions, getRepository, Repository, TreeRepository } from 'typeorm';
import BaseEntity from '../base.entity';

class Entity extends BaseEntity {
  [prop: string]: any;
}

export type CommandManager<T extends Entity> = {
  createOne: (record: Partial<T>) => Promise<T>;
  createMany: (records: Partial<T>[]) => Promise<T[]>;
  updateOne: (recordId: number, record: Partial<T>) => Promise<void>;
  softDeleteOne: (recordId: number) => Promise<void>;
  hardDeleteOne: (recordId: number) => Promise<void>;
  hardDeleteMany: (where: FindConditions<T>) => Promise<void>;
  checkPermission: (userId: number, recordId: number) => Promise<void>;
};

export function CommandManager<T extends Entity>(
  entityRepository: Repository<T> | TreeRepository<T>,
): CommandManager<T> {
  async function createOne(record: Partial<T>) {
    const newRecord = await entityRepository.save(entityRepository.create(record));
    if (!newRecord)
      throw new AppException(
        `Cannot create new ${entityRepository.metadata.name} record`,
        HttpStatus.BAD_REQUEST,
      );

    return newRecord;
  }

  // TODO: 이거 트랜잭션 보장되나
  async function createMany(records: Partial<T>[]) {
    const newRecords = await entityRepository.save(entityRepository.create(records));
    if (!newRecords)
      throw new AppException(
        `Cannot create new ${entityRepository.metadata.name} record`,
        HttpStatus.BAD_REQUEST,
      );
    return newRecords;
  }

  async function updateOne(recordId: number, record: Partial<T>) {
    await entityRepository.save({
      id: recordId,
      ...record,
    });
  }

  async function softDeleteOne(recordId: number) {
    await entityRepository.softDelete(recordId);
  }

  async function hardDeleteOne(recordId: number) {
    await entityRepository.delete(recordId);
  }

  async function hardDeleteMany(where: FindConditions<T>) {
    await entityRepository.delete(where);
  }

  async function checkPermission(userId: number, recordId: number) {
    const record = await entityRepository.findOne(recordId);
    if (userId === record?.userId) {
      return;
    }

    const user = await getRepository(User).findOne(userId);
    if (user.role === UserRoleEnum.Admin) {
      return;
    }

    throw new AppException('Cannot found record', HttpStatus.NOT_FOUND);
  }

  return {
    createOne,
    createMany,
    updateOne,
    softDeleteOne,
    hardDeleteOne,
    hardDeleteMany,
    checkPermission,
  };
}

/**
 * Manager:
 * Repository를 Argument로 넣으면,
 * Repository를 조작하는 함수 리턴
 */

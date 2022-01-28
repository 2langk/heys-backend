import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class TrxService {
  constructor(
    private readonly connection: Connection,
    private readonly loggerService: LoggerService,
  ) {}

  async getQueryRunner() {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    return queryRunner;
  }

  async runTransaction<T>(queryRunner: QueryRunner, fn: () => Promise<T>) {
    await queryRunner.startTransaction();

    let result: T;
    let error: Error;
    try {
      result = await fn();
      await queryRunner.commitTransaction();
    } catch (err) {
      this.loggerService.logger.error('트랜잭션 실패! 롤백 중...');
      error = err;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (error) throw error;
    return result;
  }
}

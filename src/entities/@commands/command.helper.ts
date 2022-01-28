import { TrxService } from 'src/globals';
import { QueryRunner } from 'typeorm';

export abstract class CommandHelper {
  protected abstract readonly trxService: TrxService;
  protected abstract registerCommandManagers(queryRunner?: QueryRunner): void;

  public constructor() {
    this.registerCommandManagers();
  }

  async withTransaction<T>(fn: () => Promise<T>) {
    const queryRunner = await this.trxService.getQueryRunner();
    this.registerCommandManagers(queryRunner);
    return await this.trxService.runTransaction<T>(queryRunner, fn);
  }
}

/**
 * Service 밑에 있는 Command Class의 Helper Class
 * - Transaction을 편하게 걸기 위해서
 */

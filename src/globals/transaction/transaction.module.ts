import { DynamicModule, Global, Module } from '@nestjs/common';
import { TrxService } from './transaction.service';

@Global()
@Module({})
export class TrxModule {
  static register(): DynamicModule {
    return {
      module: TrxModule,
      providers: [TrxService],
      exports: [TrxService],
    };
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}

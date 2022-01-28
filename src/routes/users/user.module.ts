import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { UserAggCommand, UserAggController, UserAggQuery, UserAggService } from './userAgg';

const UserAggregateProviders = [UserAggService, UserAggCommand, UserAggQuery];

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserAggController],
  providers: [...UserAggregateProviders],
})
export class UserModule {}

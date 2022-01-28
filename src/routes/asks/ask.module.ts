import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ask, AskComment, AskLike } from 'src/entities';
import { AskAggCommand, AskAggController, AskAggQuery, AskAggService } from './askAgg';
import { AskCommentController, AskCommentService } from './askComment';
import { AskLikeController, AskLikeService } from './askLike';

const AskAggProviders = [AskAggService, AskAggCommand, AskAggQuery];

@Module({
  imports: [TypeOrmModule.forFeature([Ask, AskLike, AskComment])],
  controllers: [AskAggController, AskLikeController, AskCommentController],
  providers: [...AskAggProviders, AskLikeService, AskCommentService],
})
export class AskModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AskLike } from 'src/entities';
import { CommandManager } from 'src/entities/@commands';
import { Repository } from 'typeorm';
import { CreateAskLikeDto, UpdateAskLikeDto } from './dtos/askLike.dto';

@Injectable()
export class AskLikeService {
  private askLikeCommand: CommandManager<AskLike>;

  public constructor(
    @InjectRepository(AskLike)
    private readonly askLikeRepository: Repository<AskLike>,
  ) {
    this.askLikeCommand = CommandManager(this.askLikeRepository);
  }

  async createPostLike(userId: number, askId: number, data: CreateAskLikeDto) {
    const askLike = await this.askLikeCommand.createOne({ userId, askId, ...data });
    return askLike;
  }

  async updatePostLike(askLikeId: number, data: UpdateAskLikeDto) {
    await this.askLikeCommand.updateOne(askLikeId, data);
  }

  async deletePostLike(askLikeId: number) {
    await this.askLikeCommand.hardDeleteOne(askLikeId);
  }
}

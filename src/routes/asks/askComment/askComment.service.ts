import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AskComment } from 'src/entities';
import { CommandManager } from 'src/entities/@commands';
import { Repository } from 'typeorm';
import { CreateAskCommentDto, UpdateAskCommentDto } from './dtos/askComment.dto';

@Injectable()
export class AskCommentService {
  private readonly askCommentCommand: CommandManager<AskComment>;

  public constructor(
    @InjectRepository(AskComment)
    private readonly askCommentRepository: Repository<AskComment>,
  ) {
    this.askCommentCommand = CommandManager(this.askCommentRepository);
  }

  async createAskComment(userId: number, askId: number, data: CreateAskCommentDto) {
    const postComment = await this.askCommentCommand.createOne({ userId, askId, ...data });
    return postComment;
  }

  async updateAskComment(askCommentId: number, data: UpdateAskCommentDto) {
    await this.askCommentCommand.updateOne(askCommentId, data);
  }

  async softDeleteAskComment(askCommentId: number) {
    await this.askCommentCommand.softDeleteOne(askCommentId);
  }
}

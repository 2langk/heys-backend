import { Injectable } from '@nestjs/common';

@Injectable()
export class WsService {
  findAll() {
    return `This action returns all ws`;
  }

  findOne(id: number) {
    return `This action returns a #${id} w`;
  }
}

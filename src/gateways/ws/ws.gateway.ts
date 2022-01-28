import { UseFilters } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CorsOption } from 'src/app.config';
import { WsExceptionFilter } from 'src/common/exceptions/ws-exception.filter';
import { WsService } from './ws.service';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

// namespace: /\/ws-.+/,
@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  allowEIO3: true,
  cors: CorsOption,
})
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  constructor(private readonly wsService: WsService) {}

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    console.log(data);
    this.server.emit('server-message', { data: this.wsService.findAll() });
    socket.emit('server-message', { data: this.wsService.findOne(1) });
  }

  afterInit() {
    // this.server.use((socket, next) => { // middleware
    //   const accessToken = socket.handshake.query.accessToken;
    //   if (!this.authService.authTokenIsValid(accessToken)) {
    //     return next(new Error(constants.admin.socketEvents.unauthorized));
    //   }
    //   return next();
    // });
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected:', socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected:', socket.id);
  }
}

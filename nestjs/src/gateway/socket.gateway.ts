import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class socketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('connection', socket.id);
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log('handleMessage', payload);
    this.server.emit('onMessage', payload);
  }
}

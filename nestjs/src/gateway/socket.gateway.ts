import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Import the 'Socket' type
import { AuthService } from 'src/modules/auth/auth.service';

interface CustomSocket extends Socket {
  username: string;
  sessionID: string;
  userID: string;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class socketGateway implements OnModuleInit {
  constructor(private authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.use(async (socket: CustomSocket, next) => {
      const sessionID = socket.handshake.auth.sessionID;
      if (sessionID) {
        socket.sessionID = sessionID;
        return next();
      }
      return next(new Error('invalid sessionID'));
    });

    this.server.on('connection', async (socket: CustomSocket) => {
      socket.join(socket.sessionID);
      const socketUser = await this.authService.findUserBySessionID(
        socket.sessionID,
      );
      this.authService.handleStatusChange(socketUser, 'online');

      socket.on('disconnect', async () => {
        this.authService.handleStatusChange(socketUser, 'offline');
        this.server.emit('user disconnected', socket.sessionID);
      });
    });
  }

  @SubscribeMessage('join room')
  onJoinRoom(client: CustomSocket, payload: any) {
    payload.clients.forEach(async (client) => {
      this.server.in(client).socketsJoin(payload.room);
    });
  }

  @SubscribeMessage('private message')
  onPrivateMessage(client: CustomSocket, payload: any) {
    console.log(payload);
    this.server.to(payload.to).emit('private message', {
      content: payload.content,
      from: payload.from,
      to: payload.to,
    });
  }

  @SubscribeMessage('notification')
  onNotification(client: CustomSocket, payload: any) {
    this.server.to(payload.to).emit('notification', {
      content: payload.content,
      type: payload.type,
      createdAt: payload.createdAt,
      owner: payload.owner,
    });
  }
}

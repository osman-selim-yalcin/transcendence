import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Import the 'Socket' type
import { UsersService } from 'src/modules/users/user.service';

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
@Injectable()
export class socketGateway implements OnModuleInit {
  constructor(private userService: UsersService) {}

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
      console.log('connection', socket.sessionID);

      socket.join(socket.sessionID);
      const socketUser = await this.userService.findUserBySessionID(
        socket.sessionID,
      );
      console.log('user', socketUser.username, 'connected');
      this.userService.handleStatusChange(socketUser, 'online');

      socket.on('disconnect', async () => {
        this.userService.handleStatusChange(socketUser, 'offline');
        this.server.emit('user disconnected', socket.sessionID);
        console.log('user', socketUser.username, 'disconnected');
      });
    });
  }

  async sendNotification(sessionID: string, content: any) {
    console.log('sendNotification');
    console.log(sessionID);
    this.server.in(sessionID).emit('notification', {
      content: content.content,
      type: content.type,
      createdAt: content.createdAt,
      owner: content.owner,
    });
  }

  async sendPrivateMessage(roomID: string, msg: any) {
    this.server.to(roomID).emit('private message', {
      ...msg,
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

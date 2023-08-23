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
      console.log('connected', socket.sessionID);
      socket.join(socket.sessionID);

      socket.on('disconnect', () => {});
    });
  }

  @SubscribeMessage('join room')
  onJoinRoom(client: CustomSocket, payload: any) {
    payload.clients.forEach(async (client) => {
      // console.log('join room2', client);
      // console.log('join room2', await this.server.in(client));
      // this.server.in(client).fetchSockets();
      this.server.in(client).socketsJoin(payload.room);
    });
  }

  @SubscribeMessage('private message')
  onPrivateMessage(client: CustomSocket, payload: any) {
    this.server.to(payload.to).emit('private message', {
      content: payload.content,
      from: payload.from,
    });
  }
}

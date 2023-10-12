import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Import the 'Socket' type
import { UsersService } from 'src/modules/users/user.service';
import { userStatus } from 'src/types/user.dto';

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
      const socketUser = await this.userService.findUserBySessionID(
        socket.sessionID,
      );
      if (!socketUser) return;
      for (const room of socketUser.rooms) socket.join(room.id.toString());
      socket.join(socket.sessionID);

      console.log('user', socketUser.username, 'connected');
      this.userService.handleStatusChange(socketUser, userStatus.ONLINE);
      socket.on('disconnect', async () => {
        this.userService.handleStatusChange(socketUser, userStatus.OFFLINE);
        this.server.emit('user disconnected', socket.sessionID);
        console.log('user', socketUser.username, 'disconnected');
      });
    });
  }

  async joinRoom(sessionID: string, roomID: string) {
    this.server.in(sessionID).socketsJoin(roomID);
  }

  async onPrivateMessage(payload: any) {
    this.server.to(payload.to).emit('private message', {
      ...payload.msg,
    });
  }
}

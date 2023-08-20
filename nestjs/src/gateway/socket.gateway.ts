import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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
      console.log('sessionID', sessionID);
      if (sessionID) {
        const session = await this.authService.findSession(sessionID);
        console.log('session', session);
        if (session) {
          socket.sessionID = sessionID;
          socket.userID = session.userID;
          socket.username = session.username;
          return next();
        }
      }

      const username = socket.handshake.auth.username;

      if (!username) {
        return next(new Error('invalid username'));
      }
      socket.sessionID = Math.floor(Math.random() * 1000).toString(16);
      socket.userID = Math.floor(Math.random() * 1000).toString(16);
      socket.username = username;
      next();
    });

    this.server.on('connection', (socket: CustomSocket) => {
      this.authService.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: true,
      });

      socket.emit('session', {
        sessionID: socket.sessionID,
        userID: socket.userID,
      });

      const users = [];
      for (const [id, connectedSocket] of this.server.of('/').sockets) {
        users.push({
          userID: id,
          username: (connectedSocket as CustomSocket).username,
        });
      }

      socket.broadcast.emit('user connected', {
        userID: socket.id,
        username: socket.username,
      });

      socket.emit('users', users);

      socket.on('private message', ({ content, to }) => {
        console.log('private message', { content, to });
        socket.to(to).emit('private message', {
          content,
          from: socket.id,
        });
      });

      socket.on('disconnect', () => {
        this.authService.changeSessionStatus(socket.sessionID, false);
        socket.broadcast.emit('user disconnected', socket.id);
      });
    });
  }
}

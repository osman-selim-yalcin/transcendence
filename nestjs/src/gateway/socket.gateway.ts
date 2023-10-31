import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Import the 'Socket' type
import { UsersService } from 'src/modules/users/user.service';
import { userStatus } from 'src/types/user.dto';
import { Circle, Paddle, typeKeys, socketGame } from './game/classes';
import { gameUpdate } from './game';
import { GameService } from 'src/modules/game/game.service';
import { User } from 'src/typeorm/User';

interface CustomSocket extends Socket {
  sessionID: string;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class socketGateway implements OnModuleInit {
  constructor(
    private userService: UsersService,
    private gameService: GameService,
  ) {
    setInterval(() => {
      console.log(this.queueList.length);
      if (this.queueList.length > 1) {
        this.preGame([this.queueList[0], this.queueList[1]]);
      }
    }, 10000);
  }

  queueList: string[] = [];
  gameList: socketGame[] = [];

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
      let socketUser = await this.userService.findUserBySessionID(
        socket.sessionID,
        ['rooms'],
      );
      if (!socketUser) return;
      for (const room of socketUser.rooms) socket.join(room.id.toString());
      socket.join(socket.sessionID);

      console.log('user', socketUser.username, 'connected');
      this.userService.handleStatusChange(socketUser, userStatus.ONLINE);
      socket.on('disconnect', async () => {
        socketUser = await this.userService.findUserBySessionID(
          socket.sessionID,
          ['rooms'],
        );
        this.leaveQueue([socket.sessionID]);
        if (socketUser.status === userStatus.INGAME)
          this.handleGameDisconnect(socketUser);
        this.server.emit('user disconnected', socket.sessionID);
        this.userService.handleUserDisconnect(socketUser);
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

  //GAME LOGIC

  @SubscribeMessage('invite')
  async invite(client: CustomSocket, to: string) {
    const user = await this.userService.findUserBySessionID(client.sessionID, [
      'notifications',
    ]);
    const friendUser = await this.userService.findUserBySessionID(to);
  }

  @SubscribeMessage('join queue')
  joinQueue(client: CustomSocket) {
    if (!this.queueList.includes(client.sessionID))
      this.queueList.push(client.sessionID);
  }

  leaveQueue(sessionIDS: string[]) {
    this.queueList = this.queueList.filter(
      (sessionID) => !sessionIDS.includes(sessionID),
    );
  }

  @SubscribeMessage('ready')
  async ready(client: CustomSocket, color: string) {
    try {
      if (!color) return;
      const game = this.findGame(client.sessionID, this.gameList);
      const user = this.findUser(game, client.sessionID);
      game.users[game.users.indexOf(user)].color = color;
      this.gameList[this.gameList.indexOf(game)] = game;
      if (game.users.find((u) => u.color === '')) return;
      setTimeout(() => {
        this.gameList[this.gameList.indexOf(game)] = this.startGame(game);
      }, 3000);
      const right = await this.userService.findUserBySessionID(
        game.users[0].sessionID,
      );
      const left = await this.userService.findUserBySessionID(
        game.users[1].sessionID,
      );
      this.server.in(game.gameID).emit('game start', [
        { user: left, color: game.users[1].color },
        { user: right, color: game.users[0].color },
      ]);
    } catch (e) {
      this.server.in(client.sessionID).emit('error', e);
    }
  }

  @SubscribeMessage('keys')
  async onGame(client: CustomSocket, keys: typeKeys) {
    try {
      const game = this.findGame(client.sessionID, this.gameList);
      const user = this.findUser(game, client.sessionID);
      user.keys = keys;
      this.gameList[this.gameList.indexOf(game)] = game;
    } catch (e) {
      this.server.in(client.sessionID).emit('error', e);
    }
  }

  findUsers(sessionIDS: string[]) {
    return sessionIDS.map((sessionID) =>
      this.userService.findUserBySessionID(sessionID),
    );
  }

  async preGame(sessionIDS: string[]) {
    this.leaveQueue(sessionIDS);
    const gameID = 'game' + sessionIDS[0] + sessionIDS[1];
    sessionIDS.map((sessionID) =>
      this.server.in(sessionID).socketsJoin(gameID),
    );
    const game = {
      gameID: gameID,
      users: sessionIDS.map((sessionID: string, i: number) => {
        return {
          keys: { w: { pressed: false }, s: { pressed: false } },
          color: '',
          score: 0,
          sessionID: sessionID,
          paddle: new Paddle(i && true),
        };
      }),
      ball: new Circle(),
      isOver: false,
      intervalID: null,
    };
    this.gameList.push(game);
    const right = await this.userService.findUserBySessionID(sessionIDS[0]);
    const left = await this.userService.findUserBySessionID(sessionIDS[1]);
    await this.userService.handleStatusChange(right, userStatus.INGAME);
    await this.userService.handleStatusChange(left, userStatus.INGAME);
    this.server.in(gameID).emit('pre-game', [
      { user: left, color: '' },
      { user: right, color: '' },
    ]);
  }

  startGame(game: socketGame) {
    const intervalID = setInterval(() => {
      game = gameUpdate(game);
      this.server.in(game.gameID).emit('game update', {
        paddles: [game.users[0].paddle, game.users[1].paddle],
        ball: game.ball,
      });
      if (game.isOver) {
        this.endGame(game);
      }
    }, 15);
    game.intervalID = intervalID;
    return game;
  }

  async handleGameDisconnect(socketUser: User) {
    const game = this.findGame(socketUser.sessionID, this.gameList);
    if (game.intervalID) clearInterval(game.intervalID);
    const otherUser = await this.userService.findUserBySessionID(
      game.users.find((u) => u.sessionID !== socketUser.sessionID).sessionID,
    );
    this.server.in(game.gameID).emit('game over', game.users);
    this.server.in(game.gameID).socketsLeave(game.gameID);
    this.gameList.splice(this.gameList.indexOf(game), 1);
    this.userService.handleStatusChange(otherUser, userStatus.ONLINE);
    this.gameService.createGame({
      score: [5, 0],
      elo: 10,
      winner: otherUser,
      loser: socketUser,
    });
  }

  async endGame(game: socketGame) {
    clearInterval(game.intervalID);
    this.server.in(game.gameID).emit('game over', game.users);
    this.server.in(game.gameID).socketsLeave(game.gameID);
    this.gameList.splice(this.gameList.indexOf(game), 1);
    const winner = await this.userService.findUserBySessionID(
      game.users.find((u) => u.score === 5).sessionID,
    );
    const loser = await this.userService.findUserBySessionID(
      game.users.find((u) => u.score !== 5).sessionID,
    );
    const gameLoser = game.users.find((u) => u.score !== 5);

    await this.userService.handleStatusChange(winner, userStatus.ONLINE);
    await this.userService.handleStatusChange(loser, userStatus.ONLINE);
    this.gameService.createGame({
      score: [5, gameLoser.score],
      elo: 10,
      winner,
      loser,
    });
  }

  findGame(sessionID: string, gameList: socketGame[]): socketGame {
    const game = gameList.find((game) => {
      return game.users.find((user) => user.sessionID === sessionID);
    });
    if (!game) throw new Error('game not found');
    return game;
  }

  findUser(game: socketGame, sessionID: string) {
    return game.users.find((user) => user.sessionID === sessionID);
  }
}

import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Import the 'Socket' type
import { userStatus } from 'src/types/user.dto';
import { Circle, Paddle, typeKeys, socketGame } from './game/classes';
import { gameUpdate } from './game';
import { User } from 'src/typeorm/User';
import { maxScore } from './game';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/typeorm/Game';
import { Repository } from 'typeorm';
import { typeGame } from 'src/types/game.dto';
import * as dotenv from 'dotenv';
dotenv.config();

interface CustomSocket extends Socket {
  sessionID: string;
}

@WebSocketGateway({
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
  },
})
export class socketGateway implements OnModuleInit {
  constructor(
    @InjectRepository(Game) private gameRep: Repository<Game>,
    @InjectRepository(User) private userRep: Repository<User>,
  ) {
    setInterval(() => {
      // console.log(this.queueList.length);
      // console.log(this.gameList);
      if (this.queueList.length > 1) {
        this.preGame([this.queueList[0], this.queueList[1]]);
      }
    }, 3000);
  }

  promise: Promise<User>;
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
      let socketUser = await this.findUserBySessionID(socket.sessionID, [
        'rooms',
      ]);
      if (!socketUser) return;
      for (const room of socketUser.rooms) socket.join(room.id.toString());
      socket.join(socket.sessionID);

      if (this.promise)
        this.promise?.then(async (u) => {
          await this.handleStatusChange(u, userStatus.ONLINE);
        });
      else await this.handleStatusChange(socketUser, userStatus.ONLINE);
      socket.on('disconnect', async () => {
        socketUser = await this.findUserBySessionID(socket.sessionID, [
          'rooms',
        ]);
        if (
          (await this.server.in(socket.sessionID).fetchSockets()).length === 0
        ) {
          this.leaveQueue([socket.sessionID]);
          if (socketUser.status === userStatus.INGAME)
            await this.handleGameDisconnect(socketUser);
          this.promise = this.handleUserDisconnect(socketUser);
          // console.log('user', socketUser.username, 'disconnected');
        }
      });
    });
  }

  async joinRoom(sessionID: string, roomID: string) {
    this.server.in(sessionID).socketsJoin(roomID);
  }

  leaveRoom(sessionID: string, roomID: string) {
    this.server.in(sessionID).socketsLeave(roomID);
  }

  async onPrivateMessage(payload: any) {
    this.server.to(payload.to).emit('private message', {
      ...payload.msg,
    });
  }

  async reloadFriend(user: User) {
    this.server.in(user.sessionID).emit('reload', 'friends');
  }

  async reloadNotification(user: User) {
    this.server.in(user.sessionID).emit('reload', 'notification');
  }

  async reloadRoom(user: User) {
    this.server.in(user.sessionID).emit('reload', 'userRooms');
  }

  gameInviteAccepted(user: User, otherUser: User) {
    this.server.in(user.sessionID).emit('game invite accepted');
    this.server.in(otherUser.sessionID).emit('game invite accepted');
  }

  //GAME LOGIC
  @SubscribeMessage('join queue')
  async joinQueue(client: CustomSocket) {
    // (await this.findUserBySessionID(client.sessionID)).status !==
    // userStatus.INGAME
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
      const right = await this.findUserBySessionID(game.users[1].sessionID);
      const left = await this.findUserBySessionID(game.users[0].sessionID);
      this.server.in(game.gameID).emit('game start', [
        { user: left, color: game.users[0].color },
        { user: right, color: game.users[1].color },
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
    return sessionIDS.map((sessionID) => this.findUserBySessionID(sessionID));
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
          paddle: new Paddle(!(i && true)),
        };
      }),
      ball: new Circle(),
      isOver: false,
      intervalID: null,
    };
    this.gameList.push(game);
    const left = await this.findUserBySessionID(sessionIDS[0]);
    const right = await this.findUserBySessionID(sessionIDS[1]);
    await this.handleStatusChange(right, userStatus.INGAME);
    await this.handleStatusChange(left, userStatus.INGAME);
    this.server.in(gameID).emit('pre-game', [
      { user: left, color: '' },
      { user: right, color: '' },
    ]);
  }

  startGame(game: socketGame) {
    const intervalID = setInterval(() => {
      game = gameUpdate(game, this.server);
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

  @SubscribeMessage('leave game')
  async tabSwitch(client: CustomSocket) {
    this.handleGameDisconnect(await this.findUserBySessionID(client.sessionID));
  }

  async handleGameDisconnect(socketUser: User) {
    try {
      const game = this.findGame(socketUser.sessionID, this.gameList);
      if (game.intervalID) clearInterval(game.intervalID);
      const otherUser = await this.findUserBySessionID(
        game.users.find((u) => u.sessionID !== socketUser.sessionID).sessionID,
      );
      this.server.in(game.gameID).emit('game over', game.users);
      this.server.in(game.gameID).socketsLeave(game.gameID);
      this.gameList.splice(this.gameList.indexOf(game), 1);
      await this.handleStatusChange(otherUser, userStatus.ONLINE);
      await this.handleStatusChange(socketUser, userStatus.ONLINE);
      this.createGame({
        score: [maxScore, 0],
        elo: 10,
        winner: otherUser,
        loser: socketUser,
      });
    } catch (e) {
      // console.log('game not found');
    }
  }

  async endGame(game: socketGame) {
    clearInterval(game.intervalID);
    this.server.in(game.gameID).emit('game over');
    this.server.in(game.gameID).socketsLeave(game.gameID);
    this.gameList.splice(this.gameList.indexOf(game), 1);
    const winner = await this.findUserBySessionID(
      game.users.find((u) => u.score === maxScore).sessionID,
    );
    const loser = await this.findUserBySessionID(
      game.users.find((u) => u.score !== maxScore).sessionID,
    );
    const gameLoser = game.users.find((u) => u.score !== maxScore);

    await this.handleStatusChange(winner, userStatus.ONLINE);
    await this.handleStatusChange(loser, userStatus.ONLINE);
    this.createGame({
      score: [maxScore, gameLoser.score],
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

  createGame(gameDetails: typeGame) {
    const newGame = this.gameRep.create(gameDetails);
    newGame.winner.elo += newGame.elo;
    newGame.loser.elo -= newGame.elo;
    this.gameRep.save(newGame);
    this.userRep.save(newGame.winner);
    this.userRep.save(newGame.loser);
  }

  async findUserBySessionID(sessionID: string, relations?: string[]) {
    return this.userRep.findOne({
      where: { sessionID: sessionID },
      relations,
    });
  }

  async handleStatusChange(user: User, status: number) {
    this.server.emit(user.username, status);
    user.status = status;
    return this.userRep.save(user);
  }

  async handleUserDisconnect(user: User) {
    user.status = userStatus.OFFLINE;
    this.server.emit(user.username, userStatus.OFFLINE);
    user.lastSeen = new Date().toISOString();
    return this.userRep.save(user);
  }
}

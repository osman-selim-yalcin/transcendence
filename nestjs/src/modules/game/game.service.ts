import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isBlock } from 'src/functions/user';
import { socketGateway } from 'src/gateway/socket.gateway';
import { Game } from 'src/typeorm/Game';
import { Notification } from 'src/typeorm/Notification';
import { User } from 'src/typeorm/User';
import { gameDto, typeGame } from 'src/types/game.dto';
import {
  notificationStatus,
  notificationTypes,
} from 'src/types/notification.dto';
import { userStatus } from 'src/types/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRep: Repository<Game>,
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Notification)
    private notificationRep: Repository<Notification>,
    @Inject(forwardRef(() => socketGateway)) private server: socketGateway,
  ) {}

  createGame(gameDetails: typeGame) {
    const newGame = this.gameRep.create(gameDetails);
    newGame.winner.elo += newGame.elo;
    newGame.loser.elo -= newGame.elo;
    this.gameRep.save(newGame);
    this.userRep.save(newGame.winner);
    this.userRep.save(newGame.loser);
  }

  modifyGame(games: Game[], result: boolean) {
    return games.map((g) => {
      const opponent = result ? g.loser : g.winner;
      return {
        id: g.id,
        score: g.score,
        elo: g.elo,
        createdAt: g.createdAt,
        result,
        opponent,
      };
    });
  }

  async allGames(query: gameDto) {
    const user = await this.idToUser(Number(query.id), [
      'won',
      'won.loser',
      'lost',
      'lost.winner',
    ]);
    const wons = this.modifyGame(user.won, true);
    const losts = this.modifyGame(user.lost, false);
    const allGames = [...wons, ...losts];
    const history = allGames.sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    });
    return history;
  }

  leaderboard() {
    return this.userRep.find({ order: { elo: 'DESC' } });
  }

  async invite(user: User, otherUser: User) {
    if (isBlock(user, otherUser)) throw new HttpException('blocked', 400);
    if (
      user.status === userStatus.INGAME ||
      otherUser.status === userStatus.INGAME
    )
      throw new HttpException('already in game', 400);
    if (user.status === userStatus.OFFLINE)
      throw new HttpException('user is offline', 400);
    const notification = await this.gameNotificationHandler(user, otherUser);
    this.server.preGame([user.sessionID, otherUser.sessionID]);
    this.server.gameInviteAccepted(user, otherUser);
    await this.notificationRep.save({
      type: notification.type,
      content: `${user.username} accepted your game request`,
      status: notificationStatus.ACCEPTED,
      user: notification.creator,
      creator: notification.user,
    });
    this.server.reloadNotification(notification.creator);
    this.server.reloadNotification(notification.user);
    await this.notificationRep.remove(notification);
  }

  async gameNotificationHandler(user: User, otherUser: User) {
    const notification = await this.isGameNotificationExist(
      user,
      otherUser,
      notificationStatus.QUESTION,
    );
    if (notification) {
      return notification;
    }
    const newNotification = await this.isGameNotificationExist(
      user,
      otherUser,
      notificationStatus.PENDING,
    );
    if (newNotification) throw new HttpException('already sent', 400);
    await this.createGameNotifcations(user, otherUser);
  }

  async createGameNotifcations(user: User, otherUser: User) {
    const notification = await this.notificationRep.save({
      content: `${user.username} has invited you to play a game`,
      user: otherUser,
      type: notificationTypes.GAME,
      creator: user,
      status: notificationStatus.QUESTION,
    });
    const siblingNotificaiton = await this.notificationRep.save({
      content: `You have invited ${otherUser.username} to play a game`,
      user: user,
      type: notificationTypes.GAME,
      creator: otherUser,
      status: notificationStatus.PENDING,
      sibling: notification,
    });
    notification.sibling = siblingNotificaiton;
    await this.notificationRep.save(notification);
    this.server.reloadNotification(notification.creator);
    this.server.reloadNotification(notification.user);
    throw new HttpException('game notification created succesfully', 200);
  }

  async isGameNotificationExist(
    loginUser: User,
    friendUser: User,
    status: notificationStatus,
  ) {
    const notification = loginUser.notifications?.find(
      (n) =>
        n.type === notificationTypes.GAME &&
        n.creator.id === friendUser.id &&
        n.status === status,
    );
    return notification;
  }

  async idToUser(id: number, relations?: string[]) {
    if (!id) throw new HttpException('id required', 404);
    if (typeof id !== 'number')
      throw new HttpException('id must be a number', 404);
    const user = await this.userRep.findOne({
      where: { id: id },
      relations: relations || [],
    });
    if (!user) throw new HttpException('user not found', 404);
    return user;
  }
}

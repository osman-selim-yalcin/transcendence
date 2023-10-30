import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isBlock } from 'src/functions/user';
import { socketGateway } from 'src/gateway/socket.gateway';
import { Game } from 'src/typeorm/Game';
import { Notification } from 'src/typeorm/Notification';
import { User } from 'src/typeorm/User';
import { typeGame } from 'src/types/game.dto';
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

  allGames() {
    return this.gameRep.find({ relations: ['winner', 'loser'] });
  }

  history(user: User) {
    return { wons: user.won, losts: user.lost };
  }

  async invite(user: User, otherUser: User) {
    if (isBlock(user, otherUser)) throw new HttpException('blocked', 400);
    if (
      user.status === userStatus.INGAME ||
      otherUser.status === userStatus.INGAME
    )
      throw new HttpException('already in game', 400);
    const notification = await this.gameNotificationHandler(user, otherUser);
    this.server.preGame([user.sessionID, otherUser.sessionID]);
    await this.notificationRep.save({
      type: notification.type,
      content: `${user.username} accepted your game request`,
      status: notificationStatus.ACCEPTED,
      user: notification.creator,
      creator: notification.user,
    });
    await this.notificationRep.remove(notification);
  }

  async gameNotificationHandler(user: User, otherUser: User) {
    // if (isFriend(user, otherUser)) // is in game?
    //   throw new HttpException('already friend', 400);

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
}

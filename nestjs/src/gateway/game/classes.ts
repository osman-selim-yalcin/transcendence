export class Sprite {
  position = { x: 0, y: 50 };
  velocity = { x: 0, y: 0 };
}

export class Paddle extends Sprite {
  left: boolean;
  height = 20;
  width = 2;
  speed = 1;
  constructor(left: boolean) {
    super();
    this.left = left;
    if (left) this.position.x = 4;
    else this.position.x = 100 - 4;
  }
  reset() {
    if (this.left) this.position.x = 4;
    else this.position.x = 100 - 4;
    this.position.y = 50;
  }
  update(keys: typeKeys, user: socketGameUser) {
    if (keys.s.pressed) {
      if (user.paddle.position.y + user.paddle.height / 2 + this.speed <= 100)
        user.paddle.position.y += this.speed;
    } else if (keys.w.pressed) {
      if (user.paddle.position.y - user.paddle.height / 2 - this.speed >= 0)
        user.paddle.position.y -= user.paddle.speed;
    }
  }
}

export class Circle extends Sprite {
  radius = 1.125;
  speed = 5;
  lastHit = false;
  constructor() {
    super();
    this.position.x = 50;
    this.position.y = 50;
    this.velocity = { x: 1, y: 0.1 };
  }
  reset() {
    this.position.x = 50;
    this.position.y = 50;
    this.velocity = { x: 1, y: 0.1 };
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

export type socketGameUser = {
  color: string;
  score: number;
  sessionID: string;
  keys: typeKeys;
  paddle: Paddle;
};

export type socketGame = {
  isOver: boolean;
  gameID: string;
  users: socketGameUser[];
  ball: Circle;
  intervalID: NodeJS.Timeout;
};

export type typeKeys = {
  w: { pressed: boolean };
  s: { pressed: boolean };
};

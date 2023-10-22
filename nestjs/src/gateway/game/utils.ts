import { Circle, Paddle } from './classes';

export function isBallCollidingWithLeft(ball: Circle, paddle: Paddle) {
  if (
    ball.lastHit &&
    ball.position.x - ball.radius <= paddle.position.x + paddle.width / 2 &&
    paddle.position.y - paddle.height / 2 <= ball.position.y + ball.radius &&
    ball.position.y - ball.radius <= paddle.position.y + paddle.height / 2
  ) {
    return true;
  }
  return false;
}

export function isBallCollidingWithRight(ball: Circle, paddle: Paddle) {
  if (
    !ball.lastHit &&
    ball.position.x + ball.radius >= paddle.position.x - paddle.width / 2 &&
    paddle.position.y - paddle.height / 2 <= ball.position.y + ball.radius &&
    ball.position.y - ball.radius <= paddle.position.y + paddle.height / 2
  ) {
    return true;
  }
  return false;
}

export function isBallCollidingWithWall(ball: Circle) {
  if (
    ball.position.y + ball.radius > 100 ||
    ball.position.y - ball.radius < 0
  ) {
    return true;
  }
  return false;
}

export function collisions(
  circle: Circle,
  leftPlayer: Paddle,
  rightPlayer: Paddle,
) {
  if (
    isBallCollidingWithLeft(circle, leftPlayer) ||
    isBallCollidingWithRight(circle, rightPlayer)
  ) {
    circle.lastHit = !circle.lastHit;
    circle.velocity.x = -circle.velocity.x;
  }

  if (isBallCollidingWithWall(circle)) {
    circle.velocity.y = -circle.velocity.y;
  }
}

export function isRoundOver(ball: Circle) {
  if (
    ball.position.x - ball.radius < 0 ||
    ball.position.x + ball.radius > 100
  ) {
    return true;
  }
  return false;
}

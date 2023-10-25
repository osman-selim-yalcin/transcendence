import { socketGame } from './classes';
import { collisions, isRoundOver } from './utils';

export function round_restart(game: socketGame) {
  game.ball.reset();
  game.users[0].paddle.reset();
  game.users[1].paddle.reset();

  if (game.ball.lastHit) game.users[0].score++;
  else game.users[1].score++;

  game.ball.lastHit = false;

  if (game.users[0].score === 5 || game.users[1].score === 5)
    game.isOver = true;
  return game;
}

export function gameUpdate(game: socketGame) {
  if (game.isOver) return game;
  const left = game.users.find((u) => u.paddle.left);
  const right = game.users.find((u) => !u.paddle.left);
  collisions(game.ball, left.paddle, right.paddle);
  left.paddle.update(left.keys, left);
  right.paddle.update(right.keys, right);
  game.ball.update();
  if (isRoundOver(game.ball)) game = round_restart(game);
  game.users = [left, right];
  return game;
}

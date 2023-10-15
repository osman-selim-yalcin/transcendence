class Sprite {
  velocity = { x: 0, y: 0 };
  position = { x: 0, y: 0 };
  constructor(position) {
    this.position = position;
  }
}

class Paddle extends Sprite {
  height = 150;
  width = 50;
  score = 0;
}

class Circle extends Sprite {
  radius = 30;
  maxSpeed = 10;
  minSpeed = 5;
  lastHit = true;
}

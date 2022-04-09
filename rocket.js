import { config } from './config.js';
import {
  Vector2D,
  randomVector2D,
  angle,
  distance,
  mapRange,
} from './vector.js';

const rocketImage = new Image();
rocketImage.src = 'rocket.svg';

const crashedRocketImage = new Image();
crashedRocketImage.src = 'rocket-crashed.svg';

const initX = (config.canvasWidth - config.rocketWidth) / 2;
const initY = config.canvasHeight - config.rocketHeight;

export default class Rocket {
  constructor(dna, target, blocks, onReach) {
    this.dna = dna;
    this.velocity = randomVector2D();
    this.tick = 0;
    this.position = new Vector2D(initX, initY);

    this.target = target;
    this.blocks = blocks;
    this.initialVector = new Vector2D(0, 1);

    this.crashed = false;
    this.reachedTarget = false;
    this.onReach = onReach;
  }

  calculateFitness() {
    const dist = distance(this.position, this.target.position);
    const maxDistance = Math.sqrt(
      (config.canvasWidth - this.target.position.x) ** 2 +
        (config.canvasHeight - this.target.position.y) ** 2
    );

    this.fitness = mapRange(dist, 0, maxDistance, maxDistance, 0);

    if (this.crashed) {
      this.fitness /= 5;
    }

    if (this.reachedTarget) {
      this.fitness *= 10;
    }
  }

  update() {
    if (
      this.position.x < 0 ||
      this.position.x > config.canvasWidth ||
      this.position.y < 0 ||
      this.position.y > config.canvasHeight
    ) {
      this.crashed = true;
    }

    for (const block of this.blocks) {
      if (block.collision(this.position)) this.crashed = true;
    }

    if (this.reachedTarget || this.crashed) {
      this.calculateFitness();
      return;
    }

    this.velocity.add(this.dna[this.tick]);
    this.position.add(this.velocity);

    const dist = distance(this.position, this.target.position);

    if (dist < this.target.size) {
      this.reachedTarget = true;
      this.onReach();
      this.position = new Vector2D(
        this.target.position.x,
        this.target.position.y
      );
    }

    this.calculateFitness();
    this.tick++;
  }

  draw(ctx) {
    const { x, y } = this.position;

    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(
      angle(
        new Vector2D(this.velocity.x, this.velocity.y),
        this.initialVector
      ) +
        Math.PI / 2
    );

    ctx.drawImage(
      this.crashed ? crashedRocketImage : rocketImage,
      -config.rocketWidth / 2,
      -config.rocketHeight / 2,
      config.rocketWidth,
      config.rocketHeight
    );

    ctx.restore();
  }
}

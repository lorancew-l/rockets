import { Vector2D } from './vector.js';

export default class Target {
  constructor(x, y, size) {
    this.position = new Vector2D(x, y);
    this.size = size;
  }
}

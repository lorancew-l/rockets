export class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  multiply(number) {
    this.x *= number;
    this.y *= number;
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}

export function randomVector2D() {
  return new Vector2D(randomInRange(-1, 1), randomInRange(-1, 1));
}

export function angle(v1, v2) {
  return Math.atan2(dotProduct(v1, v2), v1.x * v2.y - v1.y * v2.x);
}

function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

function randomInRange(a, b) {
  return Math.random() * (b - a) + a;
}

export function distance(v1, v2) {
  return Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function mapRange(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

export default class Block {
  constructor(x, y, width, height) {
    this.x = x - width / 2;
    this.y = y - height / 2;
    this.width = width;
    this.height = height;
  }

  collision(vector) {
    const collideX = vector.x > this.x && vector.x < this.x + this.width;
    const collideY = vector.y > this.y && vector.y < this.y + this.height;

    return collideX && collideY;
  }

  draw(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class Bullet {
  x: number;
  y: number;
  speed = 10;
  width = 10;
  height = 4;
  direction: number;

  constructor(x: number, y: number, direction: number) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  move() {
    this.x += this.speed * this.direction;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
  }

  collidesWith(monster: any): boolean {
    return (
      this.x < monster.x + monster.width &&
      this.x + this.width > monster.x &&
      this.y < monster.y + monster.height &&
      this.y + this.height > monster.y
    );
  }
}

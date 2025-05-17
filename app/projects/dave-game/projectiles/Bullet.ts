export class Bullet {
  x: number;
  y: number;
  speed = 4;
  width = 40;
  height = 40;
  direction: number;
  image: HTMLImageElement;

  constructor(x: number, y: number, direction: number) {
    this.x = x;
    this.y = y;
    this.direction = direction;

    this.image = new Image();
    this.image.src = "/assets/images/bullets/1.png";
  }

  move() {
    this.x += this.speed * this.direction;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    const screenX = this.x - cameraX;

    if (this.direction === -1) {
      // flip horizontally for left
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.image,
        -screenX - this.width,
        this.y,
        this.width,
        this.height
      );
      ctx.restore();
    } else {
      ctx.drawImage(this.image, screenX, this.y, this.width, this.height);
    }
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

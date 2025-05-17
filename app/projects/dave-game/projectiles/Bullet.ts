export class Bullet {
  x: number;
  y: number;
  speed = 4;
  width = 40;
  height = 40;
  direction: number;
  image: HTMLImageElement;
  maxDistance: number = 1000;
  isActive: boolean = true;
  startX: number; 

  constructor(x: number, y: number, direction: number) {
    this.x = x;
    this.y = y;
    this.startX = x; // Save initial x for distance check
    this.direction = direction;

    this.image = new Image();
    this.image.src = "/assets/images/bullets/1.png";
  }

  update() {
    if (!this.isActive) return;

    this.move();

    // Check if bullet has traveled beyond maxDistance
    if (Math.abs(this.x - this.startX) > this.maxDistance) {
      this.isActive = false;
    }
  }

  move() {
    this.x += this.speed * this.direction;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    if (!this.isActive) return;

    const screenX = this.x - cameraX;

    if (this.direction === -1) {
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
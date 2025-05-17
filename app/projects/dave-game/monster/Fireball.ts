import { Player } from "../engine/player";
export class Fireball {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: number;
  static frames: HTMLImageElement[] = [];
  currentFrame = 0;
  frameCounter = 0;

  constructor(
    x: number,
    y: number,
    direction: number,
    width = 32,
    height = 32
  ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = 4;
    this.width = width;
    this.height = height;

    if (Fireball.frames.length === 0) {
      for (let i = 1; i <= 4; i++) {
        const img = new Image();
        img.src = `/assets/images/monsters/fireball/${i}.png`;
        Fireball.frames.push(img);
      }
    }
  }

  move() {
    this.x += this.speed * this.direction;
    this.frameCounter++;
    if (this.frameCounter % 6 === 0) {
      this.currentFrame = (this.currentFrame + 1) % Fireball.frames.length;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    const frame = Fireball.frames[this.currentFrame];
    const drawX = this.x - cameraX;
    const drawY = this.y;

    ctx.save();
    if (this.direction === +1) {
      ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
      ctx.scale(-1, 1);
      ctx.drawImage(
        frame,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(frame, drawX, drawY, this.width, this.height);
    }
    ctx.restore();
  }

  isOffScreen(): boolean {
    return this.x < -200 || this.x > 10000;
  }

 collidesWith(player: Player): boolean {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }
}

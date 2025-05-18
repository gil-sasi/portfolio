import { Health } from "../data/Health";
import { Player } from "../engine/player";
import { FloatingText } from "../effects/FloatingText";
export abstract class MonsterBase {
  x: number;
  y: number;
  width: number;
  height: number;
  frames: HTMLImageElement[];
  currentFrame = 0;
  frameCounter = 0;
  facingLeft: boolean = false;
  health: Health;
  constructor(
    x: number,
    y: number,
    frames: HTMLImageElement[],
    width: number,
    height: number
  ) {
    this.health = new Health(100);
    this.x = x;
    this.y = y;
    this.frames = frames;
    this.width = width;
    this.height = height;
  }


takeDamage(amount: number) {
  this.health.takeDamage(amount);
  if (this.health.isDead) {
    this.die();
  }
}

die() {
  // Optional: add explosion, sound, score here
}


updateAnimation() {
  this.frameCounter++;
  if (this.frameCounter % 6 === 0 && this.frames.length > 0) {
    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
  }
}

moveWithPlayer(player: Player, effects: FloatingText[]) {
  // Default: do nothing. Ghost overrides this.
}

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    const frame = this.frames[this.currentFrame];
    const drawX = this.x - cameraX;

    ctx.save();
    if (this.facingLeft) {
      ctx.translate(drawX + this.width / 2, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(frame, -this.width / 2, this.y, this.width, this.height);
    } else {
      ctx.drawImage(frame, drawX, this.y, this.width, this.height);
    }
    ctx.restore();
  }

  abstract move(playerX: number): void;
}

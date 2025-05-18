import { Player } from "../engine/player";
import { FloatingText } from "../effects/FloatingText";

export abstract class PotionBase {
  x: number;
  y: number;
  width = 60;
  height = 75;
  collected = false;
  image: HTMLImageElement[];
  frameCounter = 0;
  currentFrame = 0;
  type?: string;
  constructor(x: number, y: number, image: HTMLImageElement[], type?: string) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.type = type;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    if (!this.collected) {
      const frame = this.image[this.currentFrame % this.image.length];
      const screenX = this.x - cameraX;
      const screenY = this.y - cameraY;

      ctx.save();

      // ✨ Glow effect based on type
      if (this.type === "red") {
        ctx.shadowColor = "rgba(255, 0, 0, 0.7)";
      } else if (this.type === "yellow") {
        ctx.shadowColor = "rgba(255, 255, 0, 0.7)";
      } else {
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
      }

      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.drawImage(frame, screenX, screenY, this.width, this.height);
      ctx.restore();

      this.frameCounter++;
      if (this.frameCounter % 6 === 0) {
        this.currentFrame = (this.currentFrame + 1) % this.image.length;
      }
    }
  }

  checkCollision(player: Player): boolean {
    return (
      !this.collected &&
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }

  abstract applyEffect(player: Player, effects: FloatingText[]): void;
}

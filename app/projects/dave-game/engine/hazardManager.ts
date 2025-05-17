import { Player } from "./player";

export type HazardType = "lava" | "water";

export interface Hazard {
  x: number;
  y: number;
  width: number;
  height: number;
  type: HazardType;
}

export class HazardManager {
  private hazards: Hazard[] = [];
  private lavaFrames: HTMLImageElement[] = [];
  private waterFrames: HTMLImageElement[] = [];
  private frameIndex = 0;
  private frameCounter = 0;

  constructor() {
    for (let i = 1; i <= 4; i++) {
      const lava = new Image();
      lava.src = `/assets/images/lava/${i}.png`;
      this.lavaFrames.push(lava);

      const water = new Image();
      water.src = `/assets/images/water/${i}.png`;
      this.waterFrames.push(water);
    }
  }

  setHazards(hazards: Hazard[]) {
    this.hazards = hazards;
  }

  update() {
    this.frameCounter++;
    if (this.frameCounter % 10 === 0) {
      this.frameIndex = (this.frameIndex + 1) % this.lavaFrames.length;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    const lavaFrame = this.lavaFrames[this.frameIndex];
    const waterFrame = this.waterFrames[this.frameIndex];

    this.hazards.forEach((h) => {
      const frame = h.type === "lava" ? lavaFrame : waterFrame;
      ctx.drawImage(frame, h.x - cameraX, h.y - cameraY, h.width, h.height);
    });
  }

  checkCollision(x: number, y: number, width: number, height: number): boolean {
    return this.hazards.some(
      (h) =>
        x < h.x + h.width &&
        x + width > h.x &&
        y < h.y + h.height &&
        y + height > h.y
    );
  }

  handlePlayerCollision(player: Player, onHit: () => void) {
    const collided = this.checkCollision(
      player.x,
      player.y,
      player.width,
      player.height
    );
    if (collided) {
      onHit();
    }
  }
}

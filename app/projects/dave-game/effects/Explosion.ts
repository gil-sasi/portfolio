export class Explosion {
  x: number;
  y: number;
  frameIndex = 0;
  frameCounter = 0;
  static frames: HTMLImageElement[] = [];
  done = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    // Load frames only once
    if (Explosion.frames.length === 0) {
      for (let i = 1; i <= 6; i++) {
        const img = new Image();
        img.src = `/assets/images/effects/explosion/${i}.png`;
        Explosion.frames.push(img);
      }
    }
  }

  update() {
    this.frameCounter++;
    if (this.frameCounter % 5 === 0) {
      this.frameIndex++;
      if (this.frameIndex >= Explosion.frames.length) {
        this.done = true;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    if (this.done) return;
    const img = Explosion.frames[this.frameIndex];
    if (img) {
      ctx.drawImage(img, this.x - cameraX, this.y, 64, 64); // adjust size as needed
    }
  }
}

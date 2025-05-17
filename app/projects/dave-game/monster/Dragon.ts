import { Fireball } from "./Fireball";
import { MonsterBase } from "./MonsterBase";
import { Player } from "../engine/player"; 

export class Dragon extends MonsterBase {
  centerX: number;
  centerY: number;
  angle = 0;
  radiusX: number;
  radiusY: number;
  angleSpeed: number;
  fireballs: Fireball[] = [];
  fireCooldown = 0;
  fireballSize: { width: number; height: number };

  constructor(
    centerX: number,
    centerY: number,
    frames: HTMLImageElement[],
    width: number,
    height: number,
    radiusX: number = 50,
    radiusY: number = 50,
    angleSpeed: number = 0.05,
    fireballSize: { width: number; height: number } = { width: 32, height: 32 }
  ) {
    super(centerX, centerY, frames, width, height);
    this.centerX = centerX;
    this.centerY = centerY;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.angleSpeed = angleSpeed;
    this.fireballSize = fireballSize;
    this.fireCooldown = 0;
  }

  move(playerX: number) {
    this.angle += this.angleSpeed;
    this.x = this.centerX + Math.cos(this.angle) * this.radiusX;
    this.y = this.centerY + Math.sin(this.angle) * this.radiusY;

    this.facingLeft = playerX > this.x;

    if (this.fireCooldown > 0) this.fireCooldown--;

    this.updateAnimation();
  }

  shootIfPlayerVisible(
    playerX: number,
    playerY: number,
    cameraX: number,
    screenWidth: number
  ) {
    const dragonRight = this.x + this.width;
    const isOnScreen =
      dragonRight >= cameraX && this.x <= cameraX + screenWidth;
    console.log(
      isOnScreen,
      "dragonX:",
      this.x,
      "cameraX:",
      cameraX,
      "playerY:",
      playerY
    );

    if (isOnScreen && this.fireCooldown === 0) {
      const dir = playerX > this.x ? 1 : -1;
      this.fireballs.push(
        new Fireball(
          this.x,
          this.y + this.height / 2,
          dir,
          this.fireballSize.width,
          this.fireballSize.height
        )
      );
      this.fireCooldown = 120;
    }
  }

  updateFireballs() {
    this.fireballs.forEach((fb) => fb.move());
    this.fireballs = this.fireballs.filter((fb) => !fb.isOffScreen());
  }

  drawFireballs(ctx: CanvasRenderingContext2D, cameraX: number) {
    this.fireballs.forEach((fb) => fb.draw(ctx, cameraX));
  }

checkFireballHit(player: Player): boolean {
    return this.fireballs.some((fb) => fb.collidesWith(player));
  }
}

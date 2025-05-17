import { Bullet } from "../projectiles/Bullet";

export class Player {
  x: number;
  y: number;
  width: number = 120;
  height: number = 120;
  velocityY: number = 0;
  gravity: number = 0.8;
  isJumping: boolean = false;
  facingLeft: boolean = false;
  currentFrame: number = 0;
  frameCounter: number = 0;
  spriteFrames: HTMLImageElement[] = [];
  hasGun: boolean = false;
  currentWeapon: "none" | "pistol" | "m16" = "none";
  bullets: Bullet[] = [];
  bulletCooldown: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    for (let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `/assets/dave-clean/${i}.png`;
      this.spriteFrames.push(img);
    }
  }

  reset() {
    this.x = 0;
    this.y = 600;
    this.velocityY = 0;
    this.isJumping = false;
  }

  move(keys: Record<string, boolean>) {
    if (keys.ArrowLeft) this.x -= 5;
    if (keys.ArrowRight) this.x += 5;
    if (keys.ArrowLeft) this.facingLeft = true;
    if (keys.ArrowRight) this.facingLeft = false;

    if (keys.ArrowLeft || keys.ArrowRight) {
      this.frameCounter++;
      if (this.frameCounter % 6 === 0) {
        this.currentFrame = (this.currentFrame + 1) % this.spriteFrames.length;
      }
    } else {
      this.currentFrame = 0;
    }
  }

  applyGravity() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;
  }

  jump() {
    this.velocityY = -20;
    this.isJumping = true;
  }

  checkCollision(rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): boolean {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.y + this.height > rect.y
    );
  }

  flyMove(keys: Record<string, boolean>) {
    const speed = 20;
    if (keys["ArrowLeft"]) this.x -= speed;
    if (keys["ArrowRight"]) this.x += speed;
    if (keys["ArrowUp"]) this.y -= speed;
    if (keys["ArrowDown"]) this.y += speed;

    this.velocityY = 0;
    this.isJumping = false;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    const sprite = this.spriteFrames[this.currentFrame];
    if (this.facingLeft) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        sprite,
        -(this.x - cameraX) - this.width,
        this.y - cameraY,
        this.width,
        this.height
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        sprite,
        this.x - cameraX,
        this.y - cameraY,
        this.width,
        this.height
      );
    }
  }
}

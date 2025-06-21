import { Bullet } from "../projectiles/Bullet";
import { Health } from "../data/Health";

export class Player {
  x = 0;
  y = 0;
  width = 120;
  height = 120;
  velocityY = 0;
  health: Health;
  gravity = 0.8;
  isJumping = false;
  facingLeft = false;
  currentFrame = 0;
  frameCounter = 0;
  hasGun = false;
  currentWeapon: "none" | "pistol" | "m16" = "none";
  pistolIcon?: HTMLImageElement;
  m16Icon?: HTMLImageElement;
  bullets: Bullet[] = [];
  bulletCooldown = 0;
  isShooting = false;
  isMoving = false;
  canDoubleJump: boolean = false;
  hasDoubleJumped: boolean = false;
  spriteFrames: HTMLImageElement[] = [];
  pistolWalkFrames: HTMLImageElement[] = [];
  m16WalkFrames: HTMLImageElement[] = [];
  levelWidth: number = 10;
  pistolStandingStill: HTMLImageElement = new Image();
  m16StandingStill: HTMLImageElement = new Image();
  pistolJump: HTMLImageElement = new Image();
  m16Jump: HTMLImageElement = new Image();

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.health = new Health(100);
    for (let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `/assets/dave-clean/${i}.png`;
      this.spriteFrames.push(img);
    }

    this.pistolIcon = new Image();
    this.pistolIcon.src = `/assets/images/guns/pistol.png`;

    this.m16Icon = new Image();
    this.m16Icon.src = `/assets/images/guns/m16.png`;

    for (let i = 1; i <= 5; i++) {
      const m16 = new Image();
      m16.src = `/assets/dave-clean/m16/${i}.png`;
      this.m16WalkFrames.push(m16);
    }

    for (let i = 1; i <= 3; i++) {
      const pistol = new Image();
      pistol.src = `/assets/dave-clean/pistol/${i}.png`;
      this.pistolWalkFrames.push(pistol);
    }

    this.pistolStandingStill.src = `/assets/dave-clean/pistol/standing.png`;
    this.pistolJump.src = `/assets/dave-clean/pistol/1.png`;

    this.m16StandingStill.src = `/assets/dave-clean/m16/standing.png`;
    this.m16Jump.src = `/assets/dave-clean/m16/1.png`;
  }

  reset() {
    this.x = 0;
    this.y = 600;
    this.velocityY = 0;
    this.isJumping = false;
    this.health.reset(); // sets hp back to max
  }

  move(keys: Record<string, boolean>) {
    this.isMoving = keys.ArrowLeft || keys.ArrowRight;

    if (keys.ArrowLeft) {
      this.x -= 5;
      this.facingLeft = true;
    }
    if (keys.ArrowRight) {
      this.x += 5;
      this.facingLeft = false;
    }

    // Clamp x between 0 and level boundaries
    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.width));

    if (this.isMoving) {
      this.frameCounter++;

      const frameCount =
        this.currentWeapon === "m16"
          ? this.m16WalkFrames.length
          : this.currentWeapon === "pistol"
          ? this.pistolWalkFrames.length
          : this.spriteFrames.length;

      if (this.frameCounter % 6 === 0) {
        this.currentFrame = (this.currentFrame + 1) % frameCount;
      }
    } else {
      this.currentFrame = 0;
    }

    if ((keys["ArrowUp"] || keys[" "]) && !this.isJumping) {
      this.jump();
    }
  }

  applyGravity() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = -20;
      this.isJumping = true;
    } else if (this.canDoubleJump && !this.hasDoubleJumped) {
      this.velocityY = -20;
      this.hasDoubleJumped = true;
    }
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
    let sprite: HTMLImageElement | undefined;

    if (this.hasGun) {
      if (this.currentWeapon === "pistol") {
        if (this.isJumping) {
          sprite = this.pistolJump;
        } else if (this.isMoving) {
          sprite = this.pistolWalkFrames[this.currentFrame];
        } else {
          sprite = this.pistolStandingStill;
        }
      } else if (this.currentWeapon === "m16") {
        if (this.isJumping) {
          sprite = this.m16Jump;
        } else if (this.isMoving) {
          sprite = this.m16WalkFrames[this.currentFrame];
        } else {
          sprite = this.m16StandingStill;
        }
      }
    } else {
      sprite = this.spriteFrames[this.currentFrame];
    }

    if (!sprite || !sprite.complete) return;

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

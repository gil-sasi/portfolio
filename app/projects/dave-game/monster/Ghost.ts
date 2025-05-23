import { MonsterBase } from "./MonsterBase";
import { Player } from "../engine/player";
import { FloatingText } from "../effects/FloatingText";
import { Health } from "../data/Health";
import { levelManager } from "../engine/levelmanager";
import type { Platform } from "../engine/platform";
export class Ghost extends MonsterBase {
  public idleFrames: HTMLImageElement[];
  public runFrames: HTMLImageElement[];
  public attackFrames: HTMLImageElement[];
  private state: "idle" | "run" | "attack" = "idle";
  private attackCooldown: number = 0;
  private failedAttackFrames: number = 0;
  private velocityY: number = 0;
  private gravity: number = 1.5;
  private isOnGround: boolean = false;

  constructor(
    x: number,
    y: number,
    idleFrames: HTMLImageElement[],
    runFrames: HTMLImageElement[],
    attackFrames: HTMLImageElement[],
    width: number,
    height: number
  ) {
    super(x, y, idleFrames, width, height);
    this.idleFrames = idleFrames;
    this.runFrames = runFrames;
    this.attackFrames = attackFrames;
    this.health = new Health(100);
  }

  override move(playerX: number): void {
    console.log(playerX);
  }

  moveWithPlayer(player: Player, effects: FloatingText[]) {
    const platforms: Platform[] = levelManager.cloneLevelPlatforms();
    const distanceX = Math.abs(this.x - player.x);
    const verticalDiff = Math.abs(this.y - player.y);
    const visionRange = 700;

    // Gravity
    this.velocityY += this.gravity;
    this.velocityY = Math.min(this.velocityY, 20);
    this.y += this.velocityY;

    // Platform collision
    this.isOnGround = false;
    for (const plat of platforms) {
      const colliding =
        this.x + this.width > plat.x &&
        this.x < plat.x + plat.width &&
        this.y + this.height >= plat.y &&
        this.y + this.height <= plat.y + 20 &&
        this.velocityY >= 0;

      if (colliding) {
        this.y = plat.y - this.height;
        this.velocityY = 0;
        this.isOnGround = true;
        console.log(this.isOnGround);
        break;
      }
    }

    // Always face player
    this.facingLeft = player.x < this.x;

    // Abort if out of vision range
    if (distanceX > visionRange) {
      this.state = "idle";
      this.updateAnimationWithFrames(this.idleFrames);
      this.health.heal(1);
      return;
    }

    // Edge checks
    const stepX = this.x + (this.facingLeft ? -10 : this.width + 10);
    const feetY = this.y + this.height + 1;

    const nextTile = platforms.find(
      (plat) =>
        stepX >= plat.x &&
        stepX <= plat.x + plat.width &&
        feetY >= plat.y &&
        feetY <= plat.y + 20
    );

    const safeLandingBelow = platforms.find(
      (plat) =>
        stepX >= plat.x &&
        stepX <= plat.x + plat.width &&
        plat.y > this.y &&
        plat.y - this.y <= 300
    );

    // 🧱 HAZARD AWARENESS
    const hazardTypes = ["lava", "water"];

    const isHazardUnderFoot = platforms.some(
      (plat) =>
        hazardTypes.includes(plat.type ?? "") &&
        this.x + this.width / 2 >= plat.x &&
        this.x + this.width / 2 <= plat.x + plat.width &&
        this.y + this.height >= plat.y &&
        this.y + this.height <= plat.y + 10
    );

    const isHazardAhead = platforms.some(
      (plat) =>
        hazardTypes.includes(plat.type ?? "") &&
        stepX >= plat.x &&
        stepX <= plat.x + plat.width &&
        feetY >= plat.y &&
        feetY <= plat.y + 10
    );

    const isTooFarX = distanceX > 300;
    const isTooFarY = verticalDiff > 300;
    const isBelowPlayer = this.y > player.y + player.height;
    const nothingToFallTo = !nextTile && !safeLandingBelow;

    if (
      (isTooFarX && isTooFarY) ||
      (isBelowPlayer && nothingToFallTo && distanceX > 150)
    ) {
      this.state = "idle";
      this.updateAnimationWithFrames(this.idleFrames);
      this.health.heal(1);
      return;
    }

    if ((isHazardAhead || isHazardUnderFoot) && distanceX > 100) {
      this.state = "idle";
      this.updateAnimationWithFrames(this.idleFrames);
      this.health.heal(1);
      return;
    }

    // Chase or attack
    if (distanceX > 100) {
      const playerIsBelow = this.y < player.y;

      if (!isHazardAhead && (nextTile || safeLandingBelow || playerIsBelow)) {
        this.state = "run";
        const runSpeed = 6;
        this.x += this.facingLeft ? -runSpeed : runSpeed;
        this.updateAnimationWithFrames(this.runFrames);
      } else {
        this.state = "idle";
        this.updateAnimationWithFrames(this.idleFrames);
        this.health.heal(1);
      }
    } else {
      this.state = "attack";
      this.updateAnimationWithFrames(this.attackFrames);

      if (this.attackCooldown === 0) {
        if (verticalDiff < 100) {
          player.health.takeDamage(10);
          effects.push(new FloatingText(player.x, player.y - 20, "-10", "red"));
          this.attackCooldown = 60;
          this.failedAttackFrames = 0;
        } else {
          this.failedAttackFrames++;
          if (this.failedAttackFrames > 3) {
            this.state = "idle";
            this.updateAnimationWithFrames(this.idleFrames);
            this.health.heal(1);
            return;
          }
        }
      }
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
  }

  public updateAnimationWithFrames(frames: HTMLImageElement[]) {
    if (this.frames !== frames) {
      this.frames = frames;
      this.currentFrame = 0;
    }
    this.frameCounter++;
    if (this.frameCounter % 6 === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }
  }
}

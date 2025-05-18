import { MonsterBase } from "./MonsterBase";
import { Player } from "../engine/player";
import { FloatingText } from "../effects/FloatingText";
import { Health } from "../data/Health";

export class Ghost extends MonsterBase {
  private idleFrames: HTMLImageElement[];
  private runFrames: HTMLImageElement[];
  private attackFrames: HTMLImageElement[];
  private state: "idle" | "run" | "attack" = "idle";
  private attackCooldown: number = 0;

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

  // Satisfy MonsterBase abstract requirement
  override move(playerX: number): void {
    // Not used — handled via moveWithPlayer
  }

  moveWithPlayer(player: Player, effects: FloatingText[]) {
    const distanceX = Math.abs(this.x - player.x);
    const verticalDiff = Math.abs(this.y - player.y);
    const unreachableY = verticalDiff > 30 && !player.isJumping;

    // Always face player
    this.facingLeft = player.x < this.x;

    if (unreachableY) {
      this.state = "idle";
      this.health.heal(1); // heal slowly when unreachable
      this.updateAnimationWithFrames(this.idleFrames);
      return;
    }

   if (distanceX > 100) {
  this.state = "run";
  const runSpeed = 4;
  this.x += this.facingLeft ? -runSpeed : runSpeed;
  this.updateAnimationWithFrames(this.runFrames);
} else {
      this.state = "attack";
      this.updateAnimationWithFrames(this.attackFrames);

      if (this.attackCooldown === 0) {
        player.health.takeDamage(10);
        effects.push(new FloatingText(player.x, player.y - 20, "-10", "red"));
        this.attackCooldown = 60;
      }
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
  }

  private updateAnimationWithFrames(frames: HTMLImageElement[]) {
    if (this.frames !== frames) {
      this.frames = frames;
      this.currentFrame = 0; // reset frame to avoid out-of-bounds
    }

    this.frameCounter++;
    if (this.frameCounter % 6 === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }
  }
}

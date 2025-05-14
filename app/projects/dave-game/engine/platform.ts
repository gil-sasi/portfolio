import { Player } from "./player";

export class PlatformManager {
  private platforms: { x: number; y: number; width: number; height: number }[] = [];

  constructor(initialPlatforms: { x: number; y: number; width: number; height: number }[]) {
    this.platforms = initialPlatforms;
  }

  setPlatforms(newPlatforms: { x: number; y: number; width: number; height: number }[]) {
    this.platforms = newPlatforms;
  }

  handleCollisions(player: Player) {
    let onPlatform = false;
    for (const plat of this.platforms) {
      const isColliding =
        player.x < plat.x + plat.width &&
        player.x + player.width > plat.x &&
        player.y < plat.y + plat.height &&
        player.y + player.height > plat.y;

      if (isColliding) {
        // From top
        if (player.y + player.height - player.velocityY <= plat.y) {
          player.y = plat.y - player.height;
          player.velocityY = 0;
          player.isJumping = false;
          onPlatform = true;
        } else if (player.y - player.velocityY >= plat.y + plat.height) {
          player.y = plat.y + plat.height;
          player.velocityY = 0;
        } else if (player.x + player.width - 5 <= plat.x) {
          player.x = plat.x - player.width;
        } else if (player.x + 5 >= plat.x + plat.width) {
          player.x = plat.x + plat.width;
        }
      }
    }
    if (!onPlatform && player.velocityY > 0) {
      player.isJumping = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    ctx.fillStyle = "#888";
    for (const plat of this.platforms) {
      ctx.fillRect(plat.x - cameraX, plat.y, plat.width, plat.height);
    }
  }
}

import { Player } from "./player";

export class PlatformManager {
  private platforms: { x: number; y: number; width: number; height: number }[] =
    [];
  private image: HTMLImageElement;

  constructor(
    initialPlatforms: { x: number; y: number; width: number; height: number }[]
  ) {
    this.platforms = initialPlatforms;

    // Load your custom platform image
    this.image = new Image();
    this.image.src = "/assets/images/platform.png";
  }

  setPlatforms(
    newPlatforms: { x: number; y: number; width: number; height: number }[]
  ) {
    this.platforms = newPlatforms;
  }

  getPlatforms() {
  return this.platforms;
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
      console.log("🧱 COLLISION DETECTED");
      console.log("Player X:", player.x, "Y:", player.y, "VelocityY:", player.velocityY);
      console.log("Platform:", plat);

      if (player.y + player.height - player.velocityY <= plat.y) {
        console.log("✔️ Landed on top of platform");
        player.y = plat.y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
        onPlatform = true;
      } else if (player.y - player.velocityY >= plat.y + plat.height) {
        console.log("⬆️ Hit from below");
        player.y = plat.y + plat.height;
        player.velocityY = 0;
      } else if (player.x + player.width - 5 <= plat.x) {
        console.warn("➡️ Hit platform from the left. Snapping X.");
        console.trace("LEFT collision adjustment stack trace:");
        player.x = plat.x - player.width;
      } else if (player.x + 5 >= plat.x + plat.width) {
        console.warn("⬅️ Hit platform from the right. Snapping X.");
        console.trace("RIGHT collision adjustment stack trace:");
        player.x = plat.x + plat.width;
      }
    }
  }

  if (!onPlatform && player.velocityY > 0) {
    player.isJumping = true;
  }
}

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    const tileWidth = this.image.width;
    const tileHeight = this.image.height;

    for (const plat of this.platforms) {
      const scaleY = plat.height / tileHeight;
      const scaledTileWidth = tileWidth * scaleY;

      // Calculate how many full tiles fit in the platform
      const tilesNeeded = Math.ceil(plat.width / scaledTileWidth);

      for (let i = 0; i < tilesNeeded; i++) {
        let drawWidth = scaledTileWidth;

        // Adjust final tile width to not overflow platform edge
        const remaining = plat.width - i * scaledTileWidth;
        if (remaining < scaledTileWidth) {
          drawWidth = remaining;
        }

        ctx.drawImage(
          this.image,
          0,
          0,
          tileWidth * (drawWidth / scaledTileWidth),
          tileHeight, // Crop source if needed
          plat.x - cameraX + i * scaledTileWidth,
          plat.y - cameraY,
          drawWidth,
          plat.height
        );
      }
    }
  }
}

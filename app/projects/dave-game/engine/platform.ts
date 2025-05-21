import { Player } from "./player";

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
   type?: string;
}

export class PlatformManager {
  private platforms: Platform[] = [];
  private images: Record<string, HTMLImageElement> = {};

  constructor(initialPlatforms: Platform[]) {
    this.platforms = initialPlatforms;

    // Load images per type
    const types: Platform["type"][] = [
      "normal",
      "pillar",
      "small",
      "small2",
      "metalbox",
      "bridge",
      "woodenbox",
      "metalpillar",
      "goldenpillar",
      "goldenbox",
      "goldenplatform",
      "emptybox",
      "treasurebox",
    ];
    types.forEach((type) => {
      const img = new Image();
      img.src = `/assets/images/platforms/${type}.png`;
      if (type) {
        this.images[type] = img;
      }
    });
  }

  setPlatforms(newPlatforms: Platform[]) {
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
        if (player.y + player.height - player.velocityY <= plat.y) {
          player.y = plat.y - player.height;
          player.velocityY = 0;
          player.isJumping = false;
          player.hasDoubleJumped = false;
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

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    for (const plat of this.platforms) {
      const type = plat.type || "normal";
      const image = this.images[type];

      if (!image?.complete) continue;

      const tileWidth = image.width;
      const tileHeight = image.height;
      const scaleY = plat.height / tileHeight;
      const scaledTileWidth = tileWidth * scaleY;

      const tilesNeeded = Math.ceil(plat.width / scaledTileWidth);

      for (let i = 0; i < tilesNeeded; i++) {
        let drawWidth = scaledTileWidth;
        const remaining = plat.width - i * scaledTileWidth;
        if (remaining < scaledTileWidth) drawWidth = remaining;

        ctx.drawImage(
          image,
          0,
          0,
          tileWidth * (drawWidth / scaledTileWidth),
          tileHeight,
          plat.x - cameraX + i * scaledTileWidth,
          plat.y - cameraY,
          drawWidth,
          plat.height
        );
      }
    }
  }
}

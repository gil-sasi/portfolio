import { Player } from "../engine/player";

export function drawTrophy(
  ctx: CanvasRenderingContext2D,
  trophy: { x: number; y: number; width: number; height: number },
  cameraX: number,
  cameraY: number,
  trophyFrames: HTMLImageElement[],
  trophyFrame: number,
  hasTrophy: boolean,
  trophyMessageShown: boolean,
  trophyFrameCounter: number
): { trophyFrame: number; trophyFrameCounter: number } {
  if (!hasTrophy) {
    trophyFrameCounter++;
    if (trophyFrameCounter % 10 === 0) {
      trophyFrame = (trophyFrame + 1) % trophyFrames.length;
    }
    const frame = trophyFrames[trophyFrame];
    ctx.drawImage(
      frame,
      trophy.x - cameraX,
      trophy.y - cameraY,
      trophy.width,
      trophy.height
    );
  }
  return { trophyFrame, trophyFrameCounter };
}

export function drawDoor(
  ctx: CanvasRenderingContext2D,
  door: { x: number; y: number; width: number; height: number },
  cameraX: number,
  cameraY: number,
  doorImage: HTMLImageElement
) {
  ctx.drawImage(
    doorImage,
    door.x - cameraX,
    door.y - cameraY,
    door.width,
    door.height
  );
}

export function drawDiamonds(
  ctx: CanvasRenderingContext2D,
  diamonds: {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
  }[],
  diamondImages: Record<string, HTMLImageElement>,
  cameraX: number,
  cameraY: number
) {
  diamonds.forEach((diamond) => {
    const img = diamondImages[diamond.type];
    if (img) {
      ctx.drawImage(
        img,
        diamond.x - cameraX,
        diamond.y - cameraY,
        diamond.width,
        diamond.height
      );
    }
  });
}

export function drawHUD(
  ctx: CanvasRenderingContext2D,
  player: Player,
  hasTrophy: boolean,
  trophyMessageShown: boolean,
  trophyFrames: HTMLImageElement[],
  score: number,
  cameraX: number,
  cameraY: number,
  showDebug: boolean,
  levelWidth: number,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";

  // 🏆 Trophy messages (top left of screen)
  if (!hasTrophy && trophyMessageShown) {
    ctx.fillText("Go get the trophy!", 20, 40);
  } else if (hasTrophy) {
    ctx.fillText("Now go to the door!", 20, 40);
    ctx.drawImage(trophyFrames[0], 230, 18, 20, 20);
  }

  // 💎 Score (top center)
  ctx.fillText(`Score: ${score}`, canvasWidth / 2 - 40, 40);

  // 🔫 Weapon display (top right)
  if (player.hasGun) {
    const icon =
      player.currentWeapon === "m16" ? player.m16Icon : player.pistolIcon;
    if (icon) {
      ctx.drawImage(icon, canvasWidth - 60, 10, 50, 50);
    }
    ctx.font = "14px Arial";
    ctx.fillText("Weapon", canvasWidth - 70, 75);
  }

  // 🐞 Debug info (bottom left of screen)
  if (showDebug) {
    const debugX = 20;
    const debugYStart = canvasHeight - 100;
    ctx.font = "16px Courier New";

    ctx.fillText(
      `Player: ${Math.round(player.width)}w x ${Math.round(player.height)}h`,
      debugX,
      debugYStart
    );
    ctx.fillText(
      `Pos: (${Math.round(player.x)}, ${Math.round(player.y)})`,
      debugX,
      debugYStart + 25
    );
    ctx.fillText(`VelocityY: ${Math.round(player.velocityY)}`, debugX, debugYStart + 50);
    ctx.fillText(`Level Width: ${levelWidth}px`, debugX, debugYStart + 75);
  }
}

export function drawDebugGrid(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number,
  levelWidth: number
) {
  ctx.font = "12px Arial";

  // X axis grid
  for (let x = 0; x < levelWidth; x += 50) {
    const screenX = x - cameraX;
    if (screenX >= 0 && screenX <= canvasWidth) {
      ctx.beginPath();
      ctx.strokeStyle = x % 100 === 0 ? "#888" : "#333";
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, canvasHeight);
      ctx.stroke();

      if (x % 100 === 0) {
        ctx.fillStyle = "#aaa";
        ctx.fillText(`X: ${x}`, screenX + 2, 12);
      }
    }
  }

  // Y axis grid
  const gridSpacing = 50;
  const worldYStart = Math.floor(cameraY / gridSpacing) * gridSpacing;
  const worldYEnd = cameraY + canvasHeight;

  for (let worldY = worldYStart; worldY <= worldYEnd; worldY += gridSpacing) {
    const screenY = worldY - cameraY;

    ctx.beginPath();
    ctx.strokeStyle = worldY % 100 === 0 ? "#888" : "#333";
    ctx.moveTo(0, screenY);
    ctx.lineTo(canvasWidth, screenY);
    ctx.stroke();

    if (worldY % 100 === 0) {
      ctx.fillStyle = "#aaa";
      ctx.fillText(`Y: ${worldY}`, 5, screenY + 12);
    }
  }
}

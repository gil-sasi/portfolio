import { GRID_SIZE, PLATFORM_VARIANTS } from "./types";

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.fillStyle = "white";
  ctx.font = "12px monospace";
  ctx.textBaseline = "top";

  for (let x = 0; x <= width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
    ctx.fillText(`X: ${x}`, x + 4, 4);
  }

  for (let y = 0; y <= height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
    ctx.fillText(`Y: ${y}`, 4, y + 4);
  }
}

export function getImagePath(type: string, variant?: string): string {
  switch (type) {
    case "platform":
      return `/assets/images/platforms/${variant || "normal"}.png`;
    case "redPotion":
      return "/assets/images/potions/red_potion/1.png";
    case "yellowPotion":
      return "/assets/images/potions/yellow_potion/1.png";
    case "diamond":
      return "/assets/images/diamonds/green.png";
    case "lava":
      return "/assets/images/lava/1.png";
    case "water":
      return "/assets/images/water/1.png";
    case "door":
      return "/assets/images/door/door.png";
    case "trophy":
      return "/assets/images/trophy-frames/1.png";
    case "ghost":
      return "/assets/images/monsters/ghost/idle/idle1.png";
    case "dragon":
      return "/assets/images/monsters/dragon/1.png";
    default:
      return "";
  }
}

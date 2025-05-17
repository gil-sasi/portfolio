import { Player } from "../engine/player";

export function drawGunPickups(
  ctx: CanvasRenderingContext2D,
  player: Player,
  pistolPickup: { x: number; y: number; width: number; height: number },
  m16Pickup: { x: number; y: number; width: number; height: number },
  pistolIcon: HTMLImageElement,
  m16Icon: HTMLImageElement,
  cameraX: number,
  cameraY: number
) {
  if (!player.hasGun) {
    if (pistolPickup) {
      ctx.drawImage(
        pistolIcon,
        pistolPickup.x - cameraX,
        pistolPickup.y - cameraY,
        pistolPickup.width,
        pistolPickup.height
      );
    }
    if (m16Pickup) {
      ctx.drawImage(
        m16Icon,
        m16Pickup.x - cameraX,
        m16Pickup.y - cameraY,
        m16Pickup.width,
        m16Pickup.height
      );
    }
  }
}

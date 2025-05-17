import { MonsterBase } from "../monster/MonsterBase";
import { Player } from "./player";
import { Dragon } from "../monster/Dragon";
import { Explosion } from "../effects/Explosion";

export function handleMonsters(
  ctx: CanvasRenderingContext2D,
  monsters: MonsterBase[],
  player: Player,
  cameraX: number,
  flyMode: boolean,
  canvasWidth: number,
  onPlayerHit: () => void,
  onExplosion: (explosion: Explosion) => void
): MonsterBase[] {
  return monsters.filter((m) => {
    m.move(player.x);
    m.draw(ctx, cameraX);

    if (m instanceof Dragon) {
      m.shootIfPlayerVisible(player.x, player.y, cameraX, canvasWidth);
      m.updateFireballs();
      m.drawFireballs(ctx, cameraX);

      if (!flyMode && m.checkFireballHit(player)) {
        onPlayerHit(); // 💥 Reset player if hit
      }
    }

    const bulletHit = player.bullets.some((b) => b.collidesWith(m));
    if (bulletHit) {
      onExplosion(new Explosion(m.x, m.y)); // 💥 Push new explosion
      return false; // Remove monster
    }

    return true;
  });
}

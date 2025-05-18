import { MonsterBase } from "../monster/MonsterBase";
import { Player } from "./player";
import { Dragon } from "../monster/Dragon";
import { Explosion } from "../effects/Explosion";
import { FloatingText } from "../effects/FloatingText";
import { Ghost } from "../monster/Ghost";

export function handleMonsters(
  ctx: CanvasRenderingContext2D,
  monsters: MonsterBase[],
  player: Player,
  cameraX: number,
  flyMode: boolean,
  canvasWidth: number,
  onPlayerHit: () => void,
  onExplosion: (explosion: Explosion) => void,
  effects: FloatingText[]
): MonsterBase[] {
  return monsters.filter((m) => {
   if (m instanceof Ghost) {
  if (!flyMode) {
    m.moveWithPlayer(player, effects);
  } else {
    m.updateAnimationWithFrames(m.idleFrames); // Optional: idle while flying
  }
} else {
  m.move(player.x);
}

    m.draw(ctx, cameraX);

    // Dragon fireball logic
    if (m instanceof Dragon) {
      m.shootIfPlayerVisible(player.x, player.y, cameraX, canvasWidth);
      m.updateFireballs();
      m.drawFireballs(ctx, cameraX);

      if (!flyMode) {
        m.fireballs = m.fireballs.filter((fireball) => {
          if (!fireball.isActive) return false;

          if (fireball.collidesWith(player)) {
            fireball.isActive = false;

            if (!player.health.isDead) {
              player.health.takeDamage(25);
              effects.push(new FloatingText(player.x, player.y - 20, "-25", "red"));
            }

            if (player.health.isDead) {
              onPlayerHit();
            }

            return false;
          }

          return !fireball.isOffScreen();
        });
      }
    }

    // Bullet hit
    const hitBullet = player.bullets.find((b) => b.isActive && b.collidesWith(m));
    if (hitBullet && !m.health.isDead) {
      m.health.takeDamage(10);
      effects.push(new FloatingText(m.x, m.y - 20, "-10", "red"));
      hitBullet.isActive = false;

      if (m.health.isDead) {
        onExplosion(new Explosion(m.x, m.y));
        return false;
      }
    }

    // Health bar
    const healthRatio = m.health.hp / m.health.maxHp;
    const barX = m.x - cameraX;
    const barY = m.y - 10;
    const barWidth = m.width;
    const barHeight = 6;

    ctx.fillStyle = "red";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = "lime";
    ctx.fillRect(barX, barY, barWidth * healthRatio, barHeight);

    return true;
  });
}
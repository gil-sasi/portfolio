import { Player } from "./player";
import { Bullet } from "../projectiles/Bullet";

export function handleShooting(
  player: Player,
  keys: Record<string, boolean>,
  levelWidth: number
) {
  if (keys["Control"] && player.hasGun) {
    const canShoot = player.bulletCooldown === 0;
    if (canShoot) {
      const dir = player.facingLeft ? -1 : 1;
      const bullet = new Bullet(
        player.x + player.width / 2,
        player.y - 30 + player.height / 3,
        dir
      );
      player.bullets.push(bullet);

      player.bulletCooldown =
        player.currentWeapon === "m16"
          ? 25
          : player.currentWeapon === "pistol"
          ? 100
          : 0;
    }
  }

 player.bullets.forEach((b) => b.update());
player.bullets = player.bullets.filter(
  (b) => b.isActive && b.x >= 0 && b.x <= levelWidth
);
}
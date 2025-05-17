import { Player } from "./player";
import { LevelManager } from "./levelmanager";

export function createPlayerAtSpawn(levelManager: LevelManager): Player {
  const level = levelManager.getCurrentLevel();
  const spawnX = 0;
  const playerHeight = 120;
  const platforms = level.platforms;

  const spawnPlatform = platforms.find(
    (p) => spawnX >= p.x && spawnX <= p.x + p.width
  );
  const spawnY = spawnPlatform ? spawnPlatform.y - playerHeight : 100;

  const player = new Player(spawnX, spawnY);

  level.diamonds = levelManager.cloneLevelDiamonds
    ? levelManager.cloneLevelDiamonds()
    : [...level.diamonds];

  return player;
}

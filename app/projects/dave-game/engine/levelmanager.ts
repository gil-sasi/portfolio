import { levels } from "../data/levels";

export class LevelManager {
  private currentLevelIndex = 0;

  getCurrentLevel() {
    return levels[this.currentLevelIndex];
  }

  nextLevel() {
    this.currentLevelIndex++;
    if (this.currentLevelIndex >= levels.length) {
      this.currentLevelIndex = 0; // restart game
    }
  }

  cloneLevelDiamonds() {
    const level = this.getCurrentLevel();
    return level.diamonds.map((d) => ({ ...d }));
  }
}

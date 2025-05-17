import { Dragon } from "../monster/Dragon";
import { MonsterBase } from "../monster/MonsterBase";

type MonsterConfig = {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  radiusX?: number;
  radiusY?: number;
  angleSpeed?: number;
  fireball?: {
    width: number;
    height: number;
  };
};


export function createMonsters(level: { monsters?: MonsterConfig[] }): MonsterBase[] {
  const monsters: MonsterBase[] = [];
  const dragonFrames: HTMLImageElement[] = [];

  for (let i = 1; i <= 10; i++) {
    const img = new Image();
    img.src = `/assets/images/monsters/dragon/${i}.png`;
    dragonFrames.push(img);
  }

  (level.monsters || []).forEach((m) => {
    if (m.type === "dragon") {
      monsters.push(
        new Dragon(
          m.x,
          m.y,
          dragonFrames,
          m.width,
          m.height,
          m.radiusX ?? 50,
          m.radiusY ?? 50,
          m.angleSpeed ?? 0.05,
          m.fireball ?? { width: 32, height: 32 }
        )
      );
    }
  });

  return monsters;
}
import { Dragon } from "../monster/Dragon";
import { MonsterBase } from "../monster/MonsterBase";
import { Ghost } from "../monster/Ghost";

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

    if (m.type === "ghost") {
      const idleFrames: HTMLImageElement[] = [];
      const runFrames: HTMLImageElement[] = [];
      const attack1Frames: HTMLImageElement[] = [];
      const attack2Frames: HTMLImageElement[] = [];
      
      for (let i = 1; i <= 5; i++) {
        const idle = new Image();
        idle.src = `/assets/images/monsters/ghost/idle/idle${i}.png`;
        idleFrames.push(idle);
      }

      for (let i = 1; i <= 7; i++) {
        const run = new Image();
        run.src = `/assets/images/monsters/ghost/run/run${i}.png`;
        runFrames.push(run);
      }

      for (let i = 1; i <= 4; i++) {
        const atk1 = new Image();
        atk1.src = `/assets/images/monsters/ghost/attack/attack_1/${i}.png`;
        attack1Frames.push(atk1);
      }

      for (let i = 1; i <= 7; i++) {
        const atk2 = new Image();
        atk2.src = `/assets/images/monsters/ghost/attack/attack_2/${i}.png`;
        attack2Frames.push(atk2);
      }

      monsters.push(
        new Ghost(
          m.x,
          m.y,
          idleFrames,
          runFrames,
          [...attack1Frames, ...attack2Frames],
          m.width,
          m.height,
        )
      );
    }
  });

  return monsters;
}

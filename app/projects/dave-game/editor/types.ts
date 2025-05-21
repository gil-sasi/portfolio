export const GRID_SIZE = 100;

export const OBJECTS = [
  "platform",
  "redPotion",
  "yellowPotion",
  "diamond",
  "lava",
  "water",
  "ghost",
  "dragon",
  "trophy",
  "door",
] as const;

export const PLATFORM_VARIANTS = [
     "normal",
      "pillar",
      "small",
      "small2",
      "metalbox",
      "bridge",
      "woodenbox",
      "metalpillar",
      "goldenpillar",
      "goldenbox",
      "goldenplatform",
      "emptybox",
      "treasurebox",
] as const;

export type LevelObject = {
  type: (typeof OBJECTS)[number];
  variant?: (typeof PLATFORM_VARIANTS)[number];
  x: number;
  y: number;
  width: number;
  height: number;
};

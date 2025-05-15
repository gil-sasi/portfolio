export interface DiamondDefinition {
  type: string;
  points: number;
  imagePath: string;
  animationFrames?: string[];
  glow?: boolean;
  sound: string;
  sparkle?: boolean;
}

export const diamondTypes: Record<string, DiamondDefinition> = {
  green: {
    type: "green",
    points: 100,
    imagePath: "/assets/diamonds/green.png",
    sound: "/assets/sounds/collect1.wav",
    glow: false,
    sparkle: false,
  },
  purple: {
    type: "purple",
    points: 200,
    imagePath: "/assets/diamonds/purple.png",
    sound: "/assets/sounds/collect2.wav",
    glow: false,
    sparkle: false,
  },
  blue: {
    type: "blue",
    points: 500,
    imagePath: "/assets/diamonds/blue.png",
    sound: "/assets/sounds/collect3.wav",
    glow: true,
    sparkle: true,
  },
  red: {
    type: "red",
    points: 1000,
    imagePath: "/assets/diamonds/red.png",
    sound: "/assets/sounds/collect4.wav",
    glow: true,
    sparkle: true,
  },
  golden: {
    type: "golden",
    points: 5000,
    imagePath: "/assets/diamonds/golden.png",
    sound: "/assets/sounds/collect5.wav",
    glow: true,
    sparkle: true,
    animationFrames: [
      "/assets/diamonds/golden/1.png",
      "/assets/diamonds/golden/2.png",
      "/assets/diamonds/golden/3.png",
    ],
  },
};

export const diamondPoints: Record<string, number> = Object.fromEntries(
  Object.entries(diamondTypes).map(([key, def]) => [key, def.points])
);

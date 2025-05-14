export const levels = [
  {
    platforms: [
      // Long starting ground
      { x: 0, y: 860, width: 600, height: 20 },
      { x: 620, y: 860, width: 300, height: 20 },

      // First small jump
      { x: 960, y: 780, width: 100, height: 20 },
      { x: 1100, y: 720, width: 100, height: 20 },

      // Mid-section stairs
      { x: 1300, y: 660, width: 100, height: 20 },
      { x: 1450, y: 600, width: 100, height: 20 },

      // High platform with a drop
      { x: 1650, y: 520, width: 200, height: 20 },

      // Pit trap
      { x: 1900, y: 860, width: 200, height: 20 },

      // Final stairs up to goal
      { x: 2150, y: 780, width: 100, height: 20 },
      { x: 2300, y: 720, width: 100, height: 20 },
      { x: 2450, y: 660, width: 100, height: 20 },
      { x: 2600, y: 600, width: 100, height: 20 },
      { x: 2750, y: 540, width: 120, height: 20 },
    ],
    trophy: { x: 1700, y: 460, width: 100, height: 100 },
    door: { x: 2780, y: 480, width: 40, height: 60 },
  },
  {
    platforms: [
      { x: 0, y: 860, width: 600, height: 20 },
      { x: 700, y: 760, width: 100, height: 20 },
      { x: 850, y: 700, width: 100, height: 20 },
      { x: 1100, y: 640, width: 100, height: 20 },
    ],
    trophy: { x: 950, y: 640, width: 100, height: 100 },
    door: { x: 1300, y: 580, width: 40, height: 60 },
  },
];

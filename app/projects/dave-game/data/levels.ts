export const levels = [
  //tip: the width of one brick is 490 if height is 100 || width of one brick is 390 if height is 80
  //tips for tiles under door and trophy, for trophy make the tile 100 more than trophy, for door make it 60 more than door -> if width 100 height 100
  //level 1
  // {
  //   width: 3000,
  //   height: 1500,
  //   platforms: [
  //     { x: 0, y: 800, width: 1960, height: 100 },
  //     { x: 250, y: 400, width: 100, height: 80 },
  //     { x: 150, y: 600, width: 100, height: 80 },
  //     { x: 620, y: 150, width: 100, height: 80 }, // above trophy
  //     { x: 750, y: 500, width: 100, height: 80 },
  //     { x: 950, y: 300, width: 100, height: 80 },
  //     { x: 1300, y: 600, width: 100, height: 80 },
  //     // { x: 500, y: 400, width: 80, height: 40 },

  //     // { x: 250, y: 300, width: 80, height: 40 },
  //     { x: 420, y: 350, width: 100, height: 80 }, //under the trophy
  //     { x: 1200, y: 310, width: 100, height: 80 }, //under the door
  //   ],

  //   trophy: { x: 420, y: 265, width: 100, height: 100 },
  //   door: { x: 1305, y: 515, width: 100, height: 100 },
  //   diamonds: [
  //     { x: 130, y: 480, width: 150, height: 150, type: "green" },
  //     { x: 230, y: 280, width: 150, height: 150, type: "green" },
  //     { x: 930, y: 185, width: 150, height: 150, type: "green" },
  //     { x: 1180, y: 195, width: 150, height: 150, type: "green" },
  //     { x: 600, y: 35, width: 150, height: 150, type: "purple" },
  //     { x: 730, y: 380, width: 150, height: 150, type: "blue" },
  //   ],

  //   lava: [
  //     { x: 1940, y: 800, width: 1000, height: 100 }, // lava at end of the room
  //   ],
  // },

  // {
  //   // Level 2
  //   width: 5000,
  //   height: 1000,
  //   platforms: [
  //     { x: 0, y: 825, width: 395, height: 80 },
  //     { x: 0, y: 595, width: 100, height: 80 },
  //     { x: 0, y: 250, width: 100, height: 80 },
  //     { x: 250, y: 450, width: 395, height: 80 },
  //     { x: 750, y: 350, width: 100, height: 80 },
  //     { x: 950, y: 730, width: 100, height: 80 },
  //     { x: 1000, y: 250, width: 100, height: 80 },
  //     { x: 1450, y: 350, width: 100, height: 80 },
  //     { x: 1700, y: 520, width: 100, height: 80 },
  //     { x: 1900, y: 700, width: 100, height: 80 },
  //     { x: 2200, y: 600, width: 395, height: 80 },
  //     { x: 2600, y: 400, width: 395, height: 80 },
  //     { x: 2995, y: 500, width: 395, height: 80 },
  //     { x: 1200, y: 150, width: 100, height: 80 },
  //     { x: 300, y: 100, width: 100, height: 80 }, // under door

  //     { x: 3480, y: 600, width: 100, height: 80 },
  //     { x: 3480, y: 700, width: 100, height: 80 },
  //     { x: 3700, y: 650, width: 100, height: 80 }, //where trophy is
  //     { x: 3930, y: 600, width: 100, height: 80 },
  //     { x: 3930, y: 700, width: 100, height: 80 },
  //   ],
  //   trophy: { x: 3690, y: 555, width: 100, height: 100 },
  //   door: { x: 305, y: 20, width: 100, height: 100 },

  //   diamonds: [
  //     { x: 130, y: 480, width: 150, height: 150, type: "green" },
  //     { x: 230, y: 280, width: 150, height: 150, type: "green" },
  //     { x: 930, y: 185, width: 150, height: 150, type: "green" },
  //     { x: 1180, y: 195, width: 150, height: 150, type: "green" },
  //     { x: 600, y: 35, width: 150, height: 150, type: "purple" },
  //     { x: 730, y: 380, width: 150, height: 150, type: "blue" },
  //   ],
  //   monsters: [
  //     {
  //       type: "dragon",
  //       x: 4300,
  //       y: 300,
  //       width: 150,
  //       height: 150,
  //       radiusX: 90,
  //       radiusY: 150,
  //       angleSpeed: 0.05,
  //       fireball: { width: 40, height: 40 }, // 💥 size of fireball
  //     },
  //   ],
  // },

  //Level 3
  {
    width: 5000,
    height: 2000,
    platforms: [
      { x: 0, y: 825, width: 5000, height: 80 },
      { x: 0, y: 595, width: 100, height: 80 },
      { x: 2500, y: 50, width: 100, height: 100 },
    ],
    trophy: { x: 2500, y: 30, width: 100, height: 100 },
    door: { x: 4000, y: 500, width: 100, height: 100 },

    pistolPickup: { x: -600, y: 700, width: 100, height: 100 },
    m16Pickup: { x: 0, y: 500, width: 100, height: 100 },
    monsters: [
      {
        type: "dragon",
        x: 4300,
        y: 300,
        width: 150,
        height: 150,
        radiusX: 90,
        radiusY: 150,
        angleSpeed: 0.05,
        fireball: { width: 40, height: 40 },
      },
    ],

    diamonds: [
      { x: 130, y: 480, width: 150, height: 150, type: "green" },
      { x: 230, y: 280, width: 150, height: 150, type: "green" },
      { x: 930, y: 185, width: 150, height: 150, type: "green" },
      { x: 1180, y: 195, width: 150, height: 150, type: "green" },
      { x: 600, y: 35, width: 150, height: 150, type: "purple" },
      { x: 730, y: 380, width: 150, height: 150, type: "blue" },
    ],

    hazards: [
      { x: 100, y: 600, width: 100, height: 40, type: "lava" },
      // { x: 300, y: 600, width: 100, height: 40, type: "water" },
    ],
  },
];

//green = 100
//purple = 200
//blue = 500
//red = 1000
//golden = 5000

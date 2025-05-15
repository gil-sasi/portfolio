export const levels = [
  //tip: the width of one brick is 490 if height is 100 || width of one brick is 390 if height is 80
  //tips for tiles under door and trophy, for trophy make the tile 100 more than trophy, for door make it 60 more than door -> if width 100 height 100
  //level 1
  // {
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
  //     { x: 1940, y: 700, width: 1000, height: 240 }, // lava at end of the room
  //   ],
  // },

  {
    // Level 2
    platforms: [
      { x: 0, y: 825, width: 5000, height: 80 },

      { x: 0, y: 825, width: 395, height: 80 },
      { x: 0, y: 595, width: 100, height: 80 },
      { x: 0, y: 250, width: 100, height: 80 },
      { x: 250, y: 450, width: 395, height: 80 },
      { x: 750, y: 350, width: 100, height: 80 },
      { x: 1000, y: 350, width: 100, height: 80 },
      { x: 1250, y: 350, width: 100, height: 80 },
      { x: 1450, y: 600, width: 100, height: 80 },
      { x: 1450, y: 350, width: 100, height: 80 },
      { x: 1300, y: 500, width: 100, height: 80 },
      { x: 1900, y: 700, width: 100, height: 80 },
      // { x: 2050, y: 800, width: 500, height: 100 }, // floor near door
      { x: 1200, y: 150, width: 100, height: 80 }, // under trophy
      { x: 300, y: 100, width: 100, height: 80 }, // under door
    ],
    trophy: { x: 1200, y: 63, width: 100, height: 100 },
    door: { x: 305, y: 20, width: 100, height: 100 },
    diamonds: [
      { x: -30, y: 130, width: 150, height: 150, type: "green" },
      { x: 470, y: 430, width: 150, height: 150, type: "green" },
      { x: 670, y: 280, width: 150, height: 150, type: "green" },
      { x: 870, y: 120, width: 150, height: 150, type: "blue" },
      { x: 1470, y: 280, width: 150, height: 150, type: "purple" },
      { x: 1870, y: 580, width: 150, height: 150, type: "red" },
    ],
    lava: [
      { x: 1000, y: 880, width: 1200, height: 120 }, // deadly mid-lava
      { x: 0, y: 900, width: 3000, height: 100 }, // fallback floor lava
    ],
  },
];

//green = 100
//purple = 200
//blue = 500
//red = 1000
//golden = 5000

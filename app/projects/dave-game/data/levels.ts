import type { Platform } from "../engine/platform";

export const levels = [
  //level 1
  {
    width: 3000,
    height: 1500,
    platforms: [
      { x: 0, y: 800, width: 1925, height: 100 }, //floor
      { x: 250, y: 400, width: 100, height: 80 },
      { x: 150, y: 600, width: 100, height: 80 },
      { x: 620, y: 150, width: 100, height: 80 }, // above trophy
      { x: 750, y: 500, width: 100, height: 80 },
      { x: 950, y: 300, width: 100, height: 80 },
      { x: 1300, y: 600, width: 100, height: 80 },

      // { x: 250, y: 300, width: 80, height: 40 },
      { x: 420, y: 350, width: 100, height: 80 }, //under the trophy
      { x: 1200, y: 310, width: 100, height: 80 }, //under the door
    ],
    pistolPickup: { x: -2000, y: 700, width: 100, height: 100 },
    m16Pickup: { x: -2000, y: 500, width: 100, height: 100 },
    trophy: { x: 420, y: 265, width: 100, height: 100 },
    door: { x: 1305, y: 515, width: 100, height: 100 },
    diamonds: [
      { x: 130, y: 480, width: 150, height: 150, type: "green" },
      { x: 230, y: 280, width: 150, height: 150, type: "green" },
      { x: 930, y: 185, width: 150, height: 150, type: "green" },
      { x: 1180, y: 195, width: 150, height: 150, type: "green" },
      { x: 600, y: 35, width: 150, height: 150, type: "purple" },
      { x: 730, y: 380, width: 150, height: 150, type: "blue" },
    ],

    hazards: [
      { x: 1920, y: 800, width: 1000, height: 80, type: "lava" }, // lava at end of the room
    ],
    monsters: [
      {
        type: "dragon",
        x: 2100,
        y: 500,
        width: 150,
        height: 150,
        radiusX: 90,
        radiusY: 150,
        angleSpeed: 0.05,
        fireball: { width: 40, height: 40 }, 
      },
   
    ],
  
  },

  {
    // Level 2
    width: 5000,
    height: 1000,
    platforms: [
      { x: 0, y: 825, width: 395, height: 80 },
      { x: 0, y: 595, width: 100, height: 80 },
      { x: 0, y: 250, width: 100, height: 80 },
      { x: 250, y: 450, width: 395, height: 80 },
      { x: 750, y: 350, width: 100, height: 80 },
      { x: 950, y: 730, width: 100, height: 80 },
      { x: 1000, y: 250, width: 100, height: 80 },
      { x: 1450, y: 350, width: 100, height: 80 },
      { x: 1700, y: 520, width: 100, height: 80 },
      { x: 1900, y: 700, width: 100, height: 80 },
      { x: 2200, y: 600, width: 395, height: 80 },
      { x: 2600, y: 400, width: 395, height: 80 },
      { x: 2995, y: 500, width: 395, height: 80 },
      { x: 1200, y: 150, width: 100, height: 80 },
      { x: 300, y: 100, width: 100, height: 80 }, // under door

      { x: 3480, y: 600, width: 100, height: 80 },
      { x: 3480, y: 700, width: 100, height: 80 },
      { x: 3700, y: 650, width: 100, height: 80 }, //where trophy is
      { x: 3930, y: 600, width: 100, height: 80 },
      { x: 3930, y: 700, width: 100, height: 80 },
    ],
    pistolPickup: { x: -600, y: 700, width: 100, height: 100 },
    m16Pickup: { x: -2000, y: 500, width: 100, height: 100 },
    trophy: { x: 3690, y: 555, width: 100, height: 100 },
    door: { x: 305, y: 20, width: 100, height: 100 },

    diamonds: [
      { x: -25, y: 480, width: 150, height: 150, type: "green" },
      { x: 260, y: 335, width: 150, height: 150, type: "green" },
      { x: 980, y: 135, width: 150, height: 150, type: "green" },
      { x: 925, y: 610, width: 150, height: 150, type: "green" }, //unreachable
      { x: -25, y: 125, width: 150, height: 150, type: "purple" },
      { x: 730, y: 220, width: 150, height: 150, type: "blue" },
    ],
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
        fireball: { width: 40, height: 40 }, // 💥 size of fireball
      },
    ],
  },

  //Level 3
  {
    width: 5000,
    height: 2000,
    platforms: [
      { x: 0, y: 800, width: 775, height: 80 }, //first 2 normals
      { x: 380, y: 625, width: 190, height: 180, type: "metalbox" }, //first metal box
      { x: 2400, y: 170, width: 230, height: 100, type: "small" }, //under the trophy
      { x: 550, y: 400, width: 210, height: 400, type: "pillar" }, //first pillar
      { x: 900, y: 200, width: 1150, height: 100, type: "bridge" },
      { x: 2180, y: 400, width: 210, height: 400, type: "pillar" }, //2nd pillar
      { x: 1900, y: 800, width: 775, height: 80 }, //platform near 2nd bridge
      { x: 2000, y: 625, width: 190, height: 180, type: "metalbox" }, //second metal box
      { x: 2400, y: 625, width: 190, height: 180, type: "metalbox" }, //third metal box
      { x: 2800, y: 300, width: 242, height: 80, type: "small2" },
      { x: 3200, y: 500, width: 242, height: 80, type: "small2" },
      { x: 3600, y: 650, width: 484, height: 80, type: "small2" },
    ] as Platform[],
    trophy: { x: 2500, y: 70, width: 100, height: 100 },
    door: { x: 3800, y: 510, width: 100, height: 150 },

    m16Pickup: { x: -600, y: 700, width: 100, height: 100 },
    pistolPickup: { x: 0, y: 500, width: 100, height: 100 },
    monsters: [
      {
        type: "dragon",
        x: 2300,
        y: 300,
        width: 150,
        height: 150,
        radiusX: 90,
        radiusY: 150,
        angleSpeed: 0.05,
        fireball: { width: 40, height: 40 },
      },
      {
        type: "dragon",
        x: 3900,
        y: 250,
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
      { x: 930, y: 82, width: 150, height: 150, type: "green" },
      { x: 1180, y: 82, width: 150, height: 150, type: "green" },
      { x: 600, y: 35, width: 150, height: 150, type: "purple" },
      { x: 625, y: 270, width: 150, height: 150, type: "blue" },
      { x: 900, y: 500, width: 150, height: 150, type: "golden" }, //unreachable
      { x: 1100, y: 500, width: 150, height: 150, type: "golden" }, //unreachable
      { x: 1300, y: 500, width: 150, height: 150, type: "golden" }, //unreachable
      { x: 1500, y: 500, width: 150, height: 150, type: "golden" }, //unreachable
    ],

    hazards: [
      { x: 775, y: 805, width: 1115, height: 65, type: "water" },
      { x: 2680, y: 805, width: 3000, height: 65, type: "lava" },
    ],
  },

  //Level 4
  {
    width: 7001,
    height: 2000,
    platforms: [

      { x: 0, y: 800, width: 4900, height: 100 }, //floor
      { x: 300, y: 700, width: 100, height: 100, type: "woodenbox" },
      { x: 500, y: 600, width: 100, height: 100, type: "woodenbox" },
      { x: 720, y: 400, width: 400, height: 100, type: "woodenbox" },
      { x: 1100, y: 400, width: 205, height: 400, type: "pillar" },
      { x: 1300, y: 400, width: 400, height: 100, type: "woodenbox" },


      { x: 5200, y: 500, width: 100, height: 100, type: "small2" },
      { x: 5900, y: 800, width: 1200, height: 100 },
      { x: 5500, y: 800, width: 200, height: 80 }, //platform in middle of water
      { x: 5470, y: 300, width: 250, height: 500, type: "pillar" },
      { x: 6750, y: 300, width: 250, height: 500, type: "pillar" },
      { x: 6575, y: 620, width: 182, height: 180, type: "woodenbox" },




      { x: 3500, y: 300, width: 250, height: 500, type: "pillar" },
      { x: 3345, y: 620, width: 182, height: 180, type: "woodenbox" },

    ],


    trophy: { x: 3600, y: 200, width: 100, height: 100 },
    door: { x: 6850, y: 210, width: 100, height: 100 },


    diamonds: [
      { x: 1000, y: 480, width: 150, height: 150, type: "green" },
      { x: 900, y: 480, width: 150, height: 150, type: "green" },
      { x: 800, y: 480, width: 150, height: 150, type: "green" }, //first diamonds
      { x: 700, y: 480, width: 150, height: 150, type: "green" },
      { x: 600, y: 480, width: 150, height: 150, type: "green" },
      { x: 1000, y: 680, width: 150, height: 150, type: "green" },
      { x: 1000, y: 580, width: 150, height: 150, type: "green" },

      { x: 1270, y: 480, width: 150, height: 150, type: "green" },
      { x: 1270, y: 580, width: 150, height: 150, type: "green" },
      { x: 1270, y: 680, width: 150, height: 150, type: "green" },
      { x: 1270, y: 480, width: 150, height: 150, type: "green" },
      { x: 1370, y: 480, width: 150, height: 150, type: "green" },
      { x: 1370, y: 680, width: 150, height: 150, type: "green" },
      { x: 1370, y: 580, width: 150, height: 150, type: "green" },



      { x: 3800, y: 680, width: 150, height: 150, type: "blue" },
      { x: 3900, y: 680, width: 150, height: 150, type: "blue" },
      { x: 4000, y: 680, width: 150, height: 150, type: "blue" },
      { x: 4100, y: 680, width: 150, height: 150, type: "blue" },
      { x: 4200, y: 680, width: 150, height: 150, type: "blue" },
      { x: 4300, y: 680, width: 150, height: 150, type: "blue" },

    ],


    pistolPickup: { x: 750, y: 300, width: 100, height: 100 },
    m16Pickup: { x: -2000, y: 500, width: 100, height: 100 },


    potions: [
      { x: 3400, y: 550, type: "yellow" },
      { x: 1700, y: 730, type: "red" },

    ],


    monsters: [


      { type: "ghost", x: 6750, y: 150, width: 120, height: 120 },
      { type: "ghost", x: 2500, y: 680, width: 120, height: 120 },



      {
        type: "dragon",
        x: 1550,
        y: 250,
        width: 150,
        height: 150,
        radiusX: 125,
        radiusY: 280,
        angleSpeed: 0.05,
        fireball: { width: 100, height: 100 },
      },


      {
        type: "dragon",
        x: 2300,
        y: 300,
        width: 150,
        height: 150,
        radiusX: 125,
        radiusY: 280,
        angleSpeed: 0.05,
        fireball: { width: 100, height: 100 },
      },
    ],
    hazards: [
      { x: 4860, y: 800, width: 635, height: 70, type: "water" },
      { x: 5700, y: 800, width: 400, height: 65, type: "water" },
      // { x: 2680, y: 805, width: 3000, height: 65, type: "lava" },
    ],



  },
];

//green = 100
//purple = 200
//blue = 500
//red = 1000
//golden = 5000

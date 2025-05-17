import { Player } from "./player";
import { PlatformManager } from "./platform";
import { LevelManager } from "./levelmanager";
import { diamondPoints } from "../data/diamonds";
import { MonsterBase } from "../monster/MonsterBase";
import { Dragon } from "../monster/Dragon";
import { Bullet } from "../projectiles/Bullet";
import { Explosion } from "../effects/Explosion";
import { HazardManager } from "./hazardManager";
import { createPlayerAtSpawn } from "./resetLevel";
import { handleShooting } from "./handleShooting";
import { setupControls } from "./controls";
import { createMonsters } from "./initMonsters";
import { drawGunPickups } from "../render/pickups";
import {
  drawTrophy,
  drawDoor,
  drawDiamonds,
  drawHUD,
  drawDebugGrid,
} from "../render/gameRender";
import { drawSky } from "../render/sky";
export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private player: Player;
  private destroyControls: () => void = () => {};
  private monsters: MonsterBase[] = [];
  private stars: { x: number; y: number; r: number }[] = [];
  private moonImage: HTMLImageElement = new Image();
  private showDebug = false;
  private platforms: PlatformManager;
  private levelManager: LevelManager;
  private keys: Record<string, boolean> = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
  };
  private cameraX = 0;
  private cameraY = 0;
  private hasTrophy = false;
  private trophyMessageShown = true;
  private score = 0;
  private explosions: Explosion[] = [];
  private trophyFrames: HTMLImageElement[] = [];
  private trophyFrame = 0;
  private trophyFrameCounter = 0;
  private doorImage: HTMLImageElement = new Image();
  private pistolIcon: HTMLImageElement = new Image();
  private m16Icon: HTMLImageElement = new Image();
  private diamondImages: Record<string, HTMLImageElement> = {};
  private flyMode = false;
  private hazardRects: {
    x: number;
    y: number;
    width: number;
    height: number;
    type: "lava" | "water";
  }[] = [];
  private waterFrames: HTMLImageElement[] = [];
  private hazardManager: HazardManager = new HazardManager();
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context is null");
    this.ctx = ctx;

    for (let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `/assets/images/trophy-frames/${i}.png`;
      this.trophyFrames.push(img);
    }

    this.doorImage.src = "/assets/images/door/door.png";

    this.pistolIcon.src = "/assets/images/guns/pistol.png";
    this.m16Icon.src = "/assets/images/guns/m16.png";
    const colors = ["green", "purple", "blue", "red", "golden"];
    colors.forEach((color) => {
      const img = new Image();
      img.src = `/assets/images/diamonds/${color}.png`;
      this.diamondImages[color] = img;
    });

    this.levelManager = new LevelManager();
    this.platforms = new PlatformManager(
      this.levelManager.getCurrentLevel().platforms
    );
    this.monsters = createMonsters(this.levelManager.getCurrentLevel());

    const spawnX = 0;
    const playerHeight = 120;
    const platforms = this.levelManager.getCurrentLevel().platforms;
    const spawnPlatform = platforms.find(
      (p) => spawnX >= p.x && spawnX <= p.x + p.width
    );
    const spawnY = spawnPlatform ? spawnPlatform.y - playerHeight : 100;
    this.player = createPlayerAtSpawn(this.levelManager);

    this.destroyControls = setupControls(
      this.keys,
      () => this.player.jump(),
      () => {
        this.showDebug = !this.showDebug;
        this.flyMode = !this.flyMode;
      }
    );

    // 🌌 Generate starfield
    for (let i = 0; i < 200; i++) {
      this.stars.push({
        x: Math.random() * 5000, // up to level width
        y: Math.random() * 300, // top portion only
        r: Math.random() * 1.5 + 0.5,
      });
    }

    // 🌙 Load detailed moon image
    this.moonImage.src = "/assets/images/moon.png";
  }

  start() {
    this.loop();
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
    this.destroyControls();
  }

  loop = () => {
    drawSky(
      this.ctx,
      this.canvas,
      this.cameraX,
      this.cameraY,
      this.stars,
      this.moonImage
    );
    this.animationFrameId = requestAnimationFrame(this.loop);
    const level = this.levelManager.getCurrentLevel();
    this.platforms.setPlatforms(level.platforms);
    this.hazardRects = (level.hazards || []) as {
      x: number;
      y: number;
      width: number;
      height: number;
      type: "lava" | "water";
    }[];

    // 🪂 Fly mode override
    if (this.flyMode) {
      this.player.flyMove(this.keys);
    } else {
      this.player.move(this.keys);
      this.player.applyGravity();

      if (this.player.x < 0) this.player.x = 0;
      if (this.player.x + this.player.width > level.width) {
        this.player.x = level.width - this.player.width;
      }

      this.platforms.handleCollisions(this.player);
    }
    //guns logic displaying in the game
    const { pistolPickup, m16Pickup } = level;

    drawGunPickups(
      this.ctx,
      this.player,
      pistolPickup,
      m16Pickup,
      this.pistolIcon,
      this.m16Icon,
      this.cameraX,
      this.cameraY
    );

    this.player.bullets.forEach((b) => b.move());
    this.player.bullets.forEach((b) => b.draw(this.ctx, this.cameraX));
    this.monsters = this.monsters.filter((m) => {
      const hit = this.player.bullets.some((b) => b.collidesWith(m));
      if (hit) {
        const explosion = new Explosion(m.x, m.y);
        this.explosions.push(explosion);
      }
      return !hit;
    });

    if (this.player.checkCollision(level.pistolPickup)) {
      this.player.hasGun = true;
      this.player.currentWeapon = "pistol";
    }
    if (this.player.checkCollision(level.m16Pickup)) {
      this.player.hasGun = true;
      this.player.currentWeapon = "m16";
    }

    // 🏆 Trophy and door logic
    if (!this.hasTrophy && this.player.checkCollision(level.trophy)) {
      this.hasTrophy = true;
      this.trophyMessageShown = false;
    }

    if (this.hasTrophy && this.player.checkCollision(level.door)) {
      this.levelManager.nextLevel();

      const nextLevel = this.levelManager.getCurrentLevel();
      this.platforms.setPlatforms(nextLevel.platforms);

      const spawnX = 0;
      const playerHeight = 120;
      const spawnPlatform = nextLevel.platforms.find(
        (p) => spawnX >= p.x && spawnX <= p.x + p.width
      );
      const spawnY = spawnPlatform ? spawnPlatform.y - playerHeight : 100;
      this.player = createPlayerAtSpawn(this.levelManager);
      this.monsters = createMonsters(this.levelManager.getCurrentLevel());
      nextLevel.diamonds = this.levelManager.cloneLevelDiamonds
        ? this.levelManager.cloneLevelDiamonds()
        : [...nextLevel.diamonds];

      this.hasTrophy = false;
      this.trophyMessageShown = true;
    }

    // 💎 Diamond collection
    if (level.diamonds) {
      level.diamonds = level.diamonds.filter((diamond) => {
        if (this.player.checkCollision(diamond)) {
          this.score += diamondPoints[diamond.type] || 0;
          return false;
        }
        return true;
      });
    }

    // 🎥 Camera follow
    this.cameraX =
      this.player.x - this.canvas.width / 2 + this.player.width / 2;
    this.cameraX = Math.max(
      0,
      Math.min(this.cameraX, level.width - this.canvas.width)
    );

    const levelHeight = level.height;
    const targetCameraY =
      this.player.y - this.canvas.height + this.player.height + 100;
    this.cameraY = Math.min(
      levelHeight - this.canvas.height,
      Math.max(0, targetCameraY)
    );

    // 🎨 Drawing
    this.platforms.draw(this.ctx, this.cameraX, this.cameraY);
    if (
      this.hazardManager.checkCollision(
        this.player.x,
        this.player.y,
        this.player.width,
        this.player.height
      )
    ) {
      this.score = 0;
      this.hasTrophy = false;
      this.trophyMessageShown = true;
      this.player = createPlayerAtSpawn(this.levelManager);
      this.platforms.setPlatforms(
        this.levelManager.getCurrentLevel().platforms
      );
    }
    const updated = drawTrophy(
      this.ctx,
      level.trophy,
      this.cameraX,
      this.cameraY,
      this.trophyFrames,
      this.trophyFrame,
      this.hasTrophy,
      this.trophyMessageShown,
      this.trophyFrameCounter
    );
    this.trophyFrame = updated.trophyFrame;
    this.trophyFrameCounter = updated.trophyFrameCounter;

    drawDoor(this.ctx, level.door, this.cameraX, this.cameraY, this.doorImage);
    drawDiamonds(
      this.ctx,
      level.diamonds || [],
      this.diamondImages,
      this.cameraX,
      this.cameraY
    );
    this.player.draw(this.ctx, this.cameraX, this.cameraY);
    this.monsters.forEach((m) => {
      m.move(this.player.x);
      m.draw(this.ctx, this.cameraX);

      if (m instanceof Dragon) {
        m.shootIfPlayerVisible(
          this.player.x,
          this.player.y,
          this.cameraX,
          this.canvas.width
        );

        m.updateFireballs();
        m.drawFireballs(this.ctx, this.cameraX);
        console.log("🔥 Fireballs:", m.fireballs);
        // check collision if not in debug/fly mode
        if (!this.flyMode && m.checkFireballHit(this.player)) {
          this.score = 0;
          this.hasTrophy = false;
          this.trophyMessageShown = true;
          this.player = createPlayerAtSpawn(this.levelManager);
          this.platforms.setPlatforms(
            this.levelManager.getCurrentLevel().platforms
          );
        }
      }
    });
    // Player bullets
    handleShooting(this.player, this.keys, level.width);
    this.player.bullets.forEach((b) => b.draw(this.ctx, this.cameraX));

    // Update & draw explosions in loop
    this.explosions.forEach((e) => e.update());
    this.explosions.forEach((e) => e.draw(this.ctx, this.cameraX));
    this.explosions = this.explosions.filter((e) => !e.done);

    if (this.player.bulletCooldown > 0) this.player.bulletCooldown--;

    drawHUD(
      this.ctx,
      this.player,
      this.hasTrophy,
      this.trophyMessageShown,
      this.trophyFrames,
      this.score,
      this.cameraX,
      this.cameraY,
      this.showDebug,
      this.levelManager.getCurrentLevel().width,
      this.canvas.width,
      this.canvas.height
    );

    if (this.showDebug) {
      drawDebugGrid(
        this.ctx,
        this.cameraX,
        this.cameraY,
        this.canvas.width,
        this.canvas.height,
        this.levelManager.getCurrentLevel().width
      );

      this.ctx.strokeStyle = "white";
      this.platforms.getPlatforms().forEach((p) => {
        this.ctx.strokeRect(
          p.x - this.cameraX,
          p.y - this.cameraY,
          p.width,
          p.height
        );
      });
    }
  }; //end of loop
}

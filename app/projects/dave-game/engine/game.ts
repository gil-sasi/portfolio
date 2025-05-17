import { Player } from "./player";
import { PlatformManager } from "./platform";
import { LevelManager } from "./levelmanager";
import { diamondPoints } from "../data/diamonds";
import { MonsterBase } from "../monster/MonsterBase";
import { Dragon } from "../monster/Dragon";
import { Bullet } from "../projectiles/Bullet";
import { Explosion } from "../effects/Explosion";
import { HazardManager } from "./hazardManager";
import { setupControls } from "./controls";
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

    this.doorImage.src = "/assets/images/door.png";

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
    this.initMonsters();

    const spawnX = 0;
    const playerHeight = 120;
    const platforms = this.levelManager.getCurrentLevel().platforms;
    const spawnPlatform = platforms.find(
      (p) => spawnX >= p.x && spawnX <= p.x + p.width
    );
    const spawnY = spawnPlatform ? spawnPlatform.y - playerHeight : 100;
    this.player = new Player(spawnX, spawnY);

    this.destroyControls = setupControls(
      this.keys,
      () => {
        if (!this.player.isJumping) {
          this.player.jump();
        }
      },
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

  drawSky() {
    // Dark sky
    this.ctx.fillStyle = "#050510";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const starOffsetX = this.cameraX * 0.2;
    const moonOffsetX = this.cameraX * 0.05;

    // ✨ Stars
    for (const star of this.stars) {
      const screenX = star.x - starOffsetX;
      if (screenX >= 0 && screenX <= this.canvas.width) {
        this.ctx.beginPath();
        this.ctx.arc(screenX, star.y, star.r, 0, Math.PI * 2);
        this.ctx.fillStyle = "white";
        this.ctx.shadowColor = "white";
        this.ctx.shadowBlur = 8 + Math.random() * 6;
        this.ctx.fill();
        this.ctx.closePath();
      }
    }

    this.ctx.shadowBlur = 0;

    // 🌙 High-res moon image with glow
    const moonX = this.canvas.width - 180 - moonOffsetX;
    const moonY = 100 - this.cameraY * 0.05;
    const moonSize = 80;

    this.ctx.save();
    this.ctx.shadowColor = "#fdf6e3";
    this.ctx.shadowBlur = 60;
    this.ctx.drawImage(this.moonImage, moonX, moonY, moonSize, moonSize);
    this.ctx.restore();
  }

  loop = () => {
    this.drawSky(); // draw background sky first
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

    if (pistolPickup && !this.player.hasGun) {
      this.ctx.drawImage(
        this.pistolIcon,
        pistolPickup.x - this.cameraX,
        pistolPickup.y - this.cameraY,
        pistolPickup.width,
        pistolPickup.height
      );
    }

    if (m16Pickup && !this.player.hasGun) {
      this.ctx.drawImage(
        this.m16Icon,
        m16Pickup.x - this.cameraX,
        m16Pickup.y - this.cameraY,
        m16Pickup.width,
        m16Pickup.height
      );
    }

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
      this.player = new Player(spawnX, spawnY);
      this.initMonsters();
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
      this.resetLevel();
    }
    this.drawDiamonds(level.diamonds || []);
    this.drawTrophy(level.trophy);
    this.drawDoor(level.door);
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
          this.resetLevel();
        }
      }
    });
    // Player bullets
    this.player.bullets.forEach((b) => b.move());
    this.player.bullets.forEach((b) => b.draw(this.ctx, this.cameraX));
    this.player.bullets = this.player.bullets.filter(
      (b) => b.x >= 0 && b.x <= level.width
    );

    if (this.keys["Control"] && this.player.hasGun) {
      const canShoot = this.player.bulletCooldown === 0;

      if (canShoot) {
        const dir = this.player.facingLeft ? -1 : 1;
        const bullet = new Bullet(
          this.player.x + this.player.width / 2,
          this.player.y + this.player.height / 2,
          dir
        );
        this.player.bullets.push(bullet);

        // Set cooldown based on weapon
        if (this.player.currentWeapon === "m16") {
          this.player.bulletCooldown = 25;
        } else if (this.player.currentWeapon === "pistol") {
          this.player.bulletCooldown = 100;
        }
      }
    }

    // Update & draw explosions in loop
    this.explosions.forEach((e) => e.update());
    this.explosions.forEach((e) => e.draw(this.ctx, this.cameraX));
    this.explosions = this.explosions.filter((e) => !e.done);

    if (this.player.bulletCooldown > 0) this.player.bulletCooldown--;
    this.drawHUD();
  }; //end of loop

  drawTrophy(trophy: { x: number; y: number; width: number; height: number }) {
    if (!this.hasTrophy) {
      this.trophyFrameCounter++;
      if (this.trophyFrameCounter % 10 === 0) {
        this.trophyFrame = (this.trophyFrame + 1) % this.trophyFrames.length;
      }
      const frame = this.trophyFrames[this.trophyFrame];
      this.ctx.drawImage(
        frame,
        trophy.x - this.cameraX,
        trophy.y - this.cameraY,
        trophy.width,
        trophy.height
      );
    }
  }

  drawDoor(door: { x: number; y: number; width: number; height: number }) {
    this.ctx.drawImage(
      this.doorImage,
      door.x - this.cameraX,
      door.y - this.cameraY,
      door.width,
      door.height
    );
  }

  drawDiamonds(
    diamonds: {
      x: number;
      y: number;
      width: number;
      height: number;
      type: string;
    }[]
  ) {
    diamonds.forEach((diamond) => {
      const img = this.diamondImages[diamond.type];
      if (img) {
        this.ctx.drawImage(
          img,
          diamond.x - this.cameraX,
          diamond.y - this.cameraY,
          diamond.width,
          diamond.height
        );
      }
    });
  }

  resetLevel() {
    this.score = 0;
    this.hasTrophy = false;
    this.trophyMessageShown = true;

    const level = this.levelManager.getCurrentLevel();

    const spawnX = 0;
    const playerHeight = 120;
    const platforms = level.platforms;
    const spawnPlatform = platforms.find(
      (p) => spawnX >= p.x && spawnX <= p.x + p.width
    );
    const spawnY = spawnPlatform ? spawnPlatform.y - playerHeight : 100;
    this.player = new Player(spawnX, spawnY);

    level.diamonds = this.levelManager.cloneLevelDiamonds
      ? this.levelManager.cloneLevelDiamonds()
      : [...level.diamonds];
  }

  private initMonsters() {
    const level = this.levelManager.getCurrentLevel();

    // Load dragon frames
    const dragonFrames: HTMLImageElement[] = [];
    for (let i = 1; i <= 10; i++) {
      const img = new Image();
      img.src = `/assets/images/monsters/dragon/${i}.png`;
      dragonFrames.push(img);
    }

    (level.monsters || []).forEach((m) => {
      if (m.type === "dragon") {
        const dragon = new Dragon(
          m.x,
          m.y,
          dragonFrames,
          m.width,
          m.height,
          m.radiusX ?? 50,
          m.radiusY ?? 50,
          m.angleSpeed ?? 0.05,
          m.fireball ?? { width: 32, height: 32 }
        );
        this.monsters.push(dragon);
        console.log("Dragon added:", dragon);
      }
    });
  }

  drawHUD() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";

    if (!this.hasTrophy && this.trophyMessageShown) {
      this.ctx.fillText("Go get the trophy!", 20, 40);
    } else if (this.hasTrophy) {
      this.ctx.fillText("Now go to the door!", 20, 40);
      this.ctx.drawImage(this.trophyFrames[0], 230, 18, 20, 20);
    }

    this.ctx.fillText(`Score: ${this.score}`, 600, 40);
    if (this.player.hasGun) {
      const icon =
        this.player.currentWeapon === "m16" ? this.m16Icon : this.pistolIcon;
      this.ctx.drawImage(icon, this.canvas.width - 60, 10, 50, 50);
      this.ctx.fillStyle = "white";
      this.ctx.font = "14px Arial";
      this.ctx.fillText("Weapon", this.canvas.width - 70, 75);
    }
    if (this.showDebug) {
      this.ctx.fillText(
        `Player: ${Math.round(this.player.width)}w x ${Math.round(
          this.player.height
        )}h`,
        20,
        70
      );
      this.ctx.fillText(
        `Pos: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`,
        20,
        100
      );
      this.ctx.fillText(
        `VelocityY: ${Math.round(this.player.velocityY)}`,
        20,
        130
      );

      const levelWidth = this.levelManager.getCurrentLevel().width;
      this.ctx.fillText(`Level Width: ${levelWidth}px`, 20, 160);

      // Platform bounding boxes
      this.ctx.strokeStyle = "white";
      this.platforms.getPlatforms().forEach((p) => {
        this.ctx.strokeRect(
          p.x - this.cameraX,
          p.y - this.cameraY,
          p.width,
          p.height
        );
      });

      // 📐 Grid and labels
      this.ctx.font = "12px Arial";

      // X grid
      for (let x = 0; x < levelWidth; x += 50) {
        const screenX = x - this.cameraX;
        if (screenX >= 0 && screenX <= this.canvas.width) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = x % 100 === 0 ? "#888" : "#333";
          this.ctx.moveTo(screenX, 0);
          this.ctx.lineTo(screenX, this.canvas.height);
          this.ctx.stroke();

          if (x % 100 === 0) {
            this.ctx.fillStyle = "#aaa";
            this.ctx.fillText(`X: ${x}`, screenX + 2, 12);
          }
        }
      }

      //  Y grid
      const gridSpacing = 50;
      const worldYStart = Math.floor(this.cameraY / gridSpacing) * gridSpacing;
      const worldYEnd = this.cameraY + this.canvas.height;

      for (
        let worldY = worldYStart;
        worldY <= worldYEnd;
        worldY += gridSpacing
      ) {
        const screenY = worldY - this.cameraY;

        this.ctx.beginPath();
        this.ctx.strokeStyle = worldY % 100 === 0 ? "#888" : "#333";
        this.ctx.moveTo(0, screenY);
        this.ctx.lineTo(this.canvas.width, screenY);
        this.ctx.stroke();

        if (worldY % 100 === 0) {
          this.ctx.fillStyle = "#aaa";
          this.ctx.fillText(`Y: ${worldY}`, 5, screenY + 12);
        }
      }
    }
  }
}

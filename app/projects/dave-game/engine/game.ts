import { Player } from "./player";
import { PlatformManager } from "./platform";
import { LevelManager } from "./levelmanager";
import { diamondPoints } from "../data/diamonds";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private player: Player;
  private platforms: PlatformManager;
  private levelManager: LevelManager;
  private keys: Record<string, boolean> = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
  };
  private cameraX = 0;
  private hasTrophy = false;
  private trophyMessageShown = true;
  private score = 0;

  private trophyFrames: HTMLImageElement[] = [];
  private trophyFrame = 0;
  private trophyFrameCounter = 0;
  private doorImage: HTMLImageElement = new Image();
  private diamondImages: Record<string, HTMLImageElement> = {};

  private lavaRects: { x: number; y: number; width: number; height: number }[] =
    [];
  private lavaFrames: HTMLImageElement[] = [];
  private lavaFrameIndex: number = 0;
  private lavaFrameCounter: number = 0;

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

    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = `/assets/images/lava/${i}.png`;
      this.lavaFrames.push(img);
    }

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

    const spawnX = 0;
    const playerHeight = 120;
    const platforms = this.levelManager.getCurrentLevel().platforms;
    const spawnPlatform = platforms.find(
      (p) => spawnX >= p.x && spawnX <= p.x + p.width
    );
    const spawnY = spawnPlatform ? spawnPlatform.y - playerHeight : 100;
    this.player = new Player(spawnX, spawnY);

    this.setupControls();
  }

  setupControls() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  destroyControls() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
    )
      e.preventDefault();
    this.keys[e.key] = true;
    if (e.key === " " && !this.player.isJumping) {
      this.player.jump();
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key] = false;
  };

  start() {
    this.loop();
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
    this.destroyControls();
  }

  loop = () => {
    this.animationFrameId = requestAnimationFrame(this.loop);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const level = this.levelManager.getCurrentLevel();
    this.platforms.setPlatforms(level.platforms);
    this.lavaRects = level.lava || [];

    this.player.move(this.keys);
    this.player.applyGravity();

    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x + this.player.width > 3000)
      this.player.x = 3000 - this.player.width;

    this.platforms.handleCollisions(this.player);
    this.checkLavaDeath();

    if (!this.hasTrophy && this.player.checkCollision(level.trophy)) {
      this.hasTrophy = true;
      this.trophyMessageShown = false;
    }

    if (this.hasTrophy && this.player.checkCollision(level.door)) {
      this.levelManager.nextLevel();

      // refresh level after switching
      const nextLevel = this.levelManager.getCurrentLevel();
      this.platforms.setPlatforms(nextLevel.platforms);
      this.lavaRects = nextLevel.lava || [];

      const spawnX = 0;
      const playerHeight = 120;
      const spawnPlatform = nextLevel.platforms.find(
        (p) => spawnX >= p.x && spawnX <= p.x + p.width
      );
      const spawnY = spawnPlatform ? spawnPlatform.y - playerHeight : 100;
      this.player = new Player(spawnX, spawnY);

      nextLevel.diamonds = this.levelManager.cloneLevelDiamonds
        ? this.levelManager.cloneLevelDiamonds()
        : [...nextLevel.diamonds];

      this.hasTrophy = false;
      this.trophyMessageShown = true;
    }

    if (level.diamonds) {
      level.diamonds = level.diamonds.filter((diamond) => {
        if (this.player.checkCollision(diamond)) {
          this.score += diamondPoints[diamond.type] || 0;
          return false;
        }
        return true;
      });
    }

    this.cameraX =
      this.player.x - this.canvas.width / 2 + this.player.width / 2;
    this.cameraX = Math.max(
      0,
      Math.min(this.cameraX, 3000 - this.canvas.width)
    );

    this.platforms.draw(this.ctx, this.cameraX);
    this.drawLava();
    this.drawDiamonds(level.diamonds || []);
    this.drawTrophy(level.trophy);
    this.drawDoor(level.door);
    this.player.draw(this.ctx, this.cameraX);
    this.drawHUD();
  };

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
        trophy.y,
        trophy.width,
        trophy.height
      );
    }
  }

  drawDoor(door: { x: number; y: number; width: number; height: number }) {
    this.ctx.drawImage(
      this.doorImage,
      door.x - this.cameraX,
      door.y,
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
          diamond.y,
          diamond.width,
          diamond.height
        );
      }
    });
  }

  drawLava() {
    this.lavaFrameCounter++;
    if (this.lavaFrameCounter % 10 === 0) {
      this.lavaFrameIndex = (this.lavaFrameIndex + 1) % this.lavaFrames.length;
    }

    const currentFrame = this.lavaFrames[this.lavaFrameIndex];

    this.lavaRects.forEach((lava) => {
      this.ctx.drawImage(
        currentFrame,
        lava.x - this.cameraX,
        lava.y,
        lava.width,
        lava.height
      );
    });
  }

  checkLavaDeath() {
    for (const lava of this.lavaRects) {
      const touching =
        this.player.x < lava.x + lava.width &&
        this.player.x + this.player.width > lava.x &&
        this.player.y < lava.y + lava.height &&
        this.player.y + this.player.height > lava.y;

      if (touching) {
        this.resetLevel();
        break;
      }
    }
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
  }
}

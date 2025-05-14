import { Player } from "./player";
import { PlatformManager } from "./platform";
import { LevelManager } from "./levelmanager";

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

  private trophyFrames: HTMLImageElement[] = [];
  private trophyFrame = 0;
  private trophyFrameCounter = 0;
  private doorImage: HTMLImageElement = new Image();

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

    this.levelManager = new LevelManager();
    this.platforms = new PlatformManager(this.levelManager.getCurrentLevel().platforms);
    this.player = new Player(100, 100);

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
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
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

    // Move
    this.player.move(this.keys);
    this.player.applyGravity();

    // Collisions
    this.platforms.handleCollisions(this.player);

    // Trophy check
    if (!this.hasTrophy && this.player.checkCollision(level.trophy)) {
      this.hasTrophy = true;
      this.trophyMessageShown = false;
    }

    // Door check
    if (this.hasTrophy && this.player.checkCollision(level.door)) {
      this.levelManager.nextLevel();
      this.player.reset();
      this.hasTrophy = false;
      this.trophyMessageShown = true;
    }

    // Camera follow
    this.cameraX = this.player.x - this.canvas.width / 2 + this.player.width / 2;
    this.cameraX = Math.max(0, Math.min(this.cameraX, 3000 - this.canvas.width));

    // Draw
    this.platforms.draw(this.ctx, this.cameraX);
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
      this.ctx.drawImage(frame, trophy.x - this.cameraX, trophy.y, trophy.width, trophy.height);
    }
  }

  drawDoor(door: { x: number; y: number; width: number; height: number }) {
    this.ctx.drawImage(this.doorImage, door.x - this.cameraX, door.y, door.width, door.height);
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
  }
}

import { Player } from "./player";
import { PlatformManager } from "./platform";
import { LevelManager } from "./levelmanager";
import { diamondPoints } from "../data/diamonds";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private animationFrameId: number = 0;
    private player: Player;
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

    private trophyFrames: HTMLImageElement[] = [];
    private trophyFrame = 0;
    private trophyFrameCounter = 0;
    private doorImage: HTMLImageElement = new Image();
    private diamondImages: Record<string, HTMLImageElement> = {};
    private flyMode = false;
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

        // 🌌 Generate starfield
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * 5000,  // up to level width
                y: Math.random() * 300,   // top portion only
                r: Math.random() * 1.5 + 0.5,
            });
        }

        // 🌙 Load detailed moon image
        this.moonImage.src = "/assets/images/moon.png";




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

        if (e.key === "q" || e.key === "Q") {
            this.showDebug = !this.showDebug;
            this.flyMode = !this.flyMode;

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
        this.lavaRects = level.lava || [];

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
            this.checkLavaDeath();
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

const levelHeight = this.levelManager.getCurrentLevel().height;

// Place player near bottom of screen, offset by 100px from bottom
const targetCameraY = this.player.y - this.canvas.height + this.player.height + 100;

// Clamp so camera doesn't scroll outside level bounds
this.cameraY = Math.min(
  levelHeight - this.canvas.height,
  Math.max(0, targetCameraY)
);



        // 🎨 Drawing
       this.platforms.draw(this.ctx, this.cameraX, this.cameraY);
        this.drawLava();
        this.drawDiamonds(level.diamonds || []);
        this.drawTrophy(level.trophy);
        this.drawDoor(level.door);
        this.player.draw(this.ctx, this.cameraX, this.cameraY);

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
                lava.y - this.cameraY,
                lava.width,
                lava.height,
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

  if (this.showDebug) {
    this.ctx.fillText(`Player: ${Math.round(this.player.width)}w x ${Math.round(this.player.height)}h`, 20, 70);
    this.ctx.fillText(`Pos: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`, 20, 100);
    this.ctx.fillText(`VelocityY: ${Math.round(this.player.velocityY)}`, 20, 130);

    const levelWidth = this.levelManager.getCurrentLevel().width;
    this.ctx.fillText(`Level Width: ${levelWidth}px`, 20, 160);

    if (this.player.x < 0 || this.player.x + this.player.width > levelWidth) {
      this.ctx.fillStyle = "orange";
      this.ctx.fillText("⚠️ Player is out of horizontal bounds!", 20, 190);
    }

    if (this.player.y > this.canvas.height + this.cameraY) {
      this.ctx.fillStyle = "red";
      this.ctx.fillText("💀 Player has fallen below the screen!", 20, 220);
    }

    // Platform bounding boxes
    this.ctx.strokeStyle = "white";
    this.platforms.getPlatforms().forEach((p) => {
      this.ctx.strokeRect(p.x - this.cameraX, p.y - this.cameraY, p.width, p.height);
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

    for (let worldY = worldYStart; worldY <= worldYEnd; worldY += gridSpacing) {
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

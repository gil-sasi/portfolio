import { Player } from "./player";
import { PlatformManager } from "./platform";
import { LevelManager } from "./levelmanager";
import { diamondPoints } from "../data/diamonds";
import { MonsterBase } from "../monster/MonsterBase";
import { Explosion } from "../effects/Explosion";
import { HazardManager } from "./hazardManager";
import { createPlayerAtSpawn } from "./resetLevel";
import { Hazard } from "./hazardManager";
import { handleShooting } from "./handleShooting";
import { FloatingText } from "../effects/FloatingText";
import {
    drawPlayerHealthBar,
    drawFloatingTexts,
    drawDebugPlayerLine,
    drawTrophy,
    drawDoor,
    drawDiamonds,
    drawHUD,
    drawDebugGrid,
} from "../render/gameRender";
import { setupControls } from "./controls";
import { createMonsters } from "./initMonsters";
import { drawGunPickups } from "../render/pickups";
import { handleMonsters } from "./handleMonsters";
import { enableMobileControls } from "./mobileControls";
import { drawSky } from "../render/sky";

export class Game {
    private effects: FloatingText[] = [];
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private animationFrameId: number = 0;
    private player: Player;
    private destroyControls: () => void = () => { };
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

        ["green", "purple", "blue", "red", "golden"].forEach((color) => {
            const img = new Image();
            img.src = `/assets/images/diamonds/${color}.png`;
            this.diamondImages[color] = img;
        });

        this.levelManager = new LevelManager();
        this.platforms = new PlatformManager(
            this.levelManager.getCurrentLevel().platforms
        );
        this.monsters = createMonsters(this.levelManager.getCurrentLevel());
        this.player = createPlayerAtSpawn(this.levelManager);

        this.destroyControls = setupControls(
            this.keys,
            () => this.player.jump(),
            () => {
                this.showDebug = !this.showDebug;
                this.flyMode = !this.flyMode;
            }
        );

        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * 5000,
                y: Math.random() * 300,
                r: Math.random() * 1.5 + 0.5,
            });
        }
        enableMobileControls(this.keys);
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
        this.hazardManager.setHazards((level.hazards || []) as Hazard[]);
        this.hazardManager.update();
        this.hazardManager.draw(this.ctx, this.cameraX, this.cameraY);

        this.effects.forEach((e) => e.update());
        drawFloatingTexts(this.ctx, this.effects, this.cameraX, this.cameraY);
        this.effects = this.effects.filter((e) => !e.done);

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

        drawGunPickups(
            this.ctx,
            this.player,
            level.pistolPickup,
            level.m16Pickup,
            this.pistolIcon,
            this.m16Icon,
            this.cameraX,
            this.cameraY
        );

        this.player.bullets.forEach((b) => b.update());
        this.player.bullets.forEach((b) => b.draw(this.ctx, this.cameraX));
        this.player.bullets = this.player.bullets.filter((bullet) => bullet.isActive);

        this.monsters = this.monsters.filter((m) => {
            const bullet = this.player.bullets.find((b) => b.isActive && b.collidesWith(m));
            if (bullet && !m.health.isDead) {
                bullet.isActive = false;
                m.health.takeDamage(25);
                this.effects.push(new FloatingText(m.x, m.y - 20, "-25", "red"));
                if (m.health.isDead) {
                    this.explosions.push(new Explosion(m.x, m.y));
                    return false; // remove dead monster
                }
            }
            return true;
        });

        if (this.player.checkCollision(level.pistolPickup)) {
            this.player.hasGun = true;
            this.player.currentWeapon = "pistol";
        }
        if (this.player.checkCollision(level.m16Pickup)) {
            this.player.hasGun = true;
            this.player.currentWeapon = "m16";
        }

        if (!this.hasTrophy && this.player.checkCollision(level.trophy)) {
            this.hasTrophy = true;
            this.trophyMessageShown = false;
        }

        if (this.hasTrophy && this.player.checkCollision(level.door)) {
            this.levelManager.nextLevel();
            const nextLevel = this.levelManager.getCurrentLevel();
            this.platforms.setPlatforms(nextLevel.platforms);
            this.player = createPlayerAtSpawn(this.levelManager);
            this.monsters = createMonsters(nextLevel);
            nextLevel.diamonds = this.levelManager.cloneLevelDiamonds
                ? this.levelManager.cloneLevelDiamonds()
                : [...nextLevel.diamonds];
            this.hasTrophy = false;
            this.trophyMessageShown = true;
        }

        if (level.diamonds) {
            level.diamonds = level.diamonds.filter((d) => {
                if (this.player.checkCollision(d)) {
                    this.score += diamondPoints[d.type] || 0;
                    return false;
                }
                return true;
            });
        }

        const levelHeight = level.height;
        const screenBottomY = this.player.y + this.player.height;
        const thresholdToStartScrolling = levelHeight - this.canvas.height;
        this.cameraX = Math.max(
            0,
            Math.min(
                this.player.x - this.canvas.width / 2 + this.player.width / 2,
                level.width - this.canvas.width
            )
        );
        if (screenBottomY < thresholdToStartScrolling) {
            this.cameraY = Math.min(
                levelHeight - this.canvas.height,
                this.player.y - this.canvas.height / 2 + this.player.height / 2
            );
        }
        const targetY =
            this.player.y - this.canvas.height + this.player.height + 100;

        this.cameraY = Math.min(
            level.height - this.canvas.height,
            Math.max(0, targetY)
        );

        this.platforms.draw(this.ctx, this.cameraX, this.cameraY);
        if (!this.flyMode) {
            this.hazardManager.handlePlayerCollision(this.player, () => {
                // lava or water = instant kill
                this.player.health.hp = 0;
                this.player.health.isDead = true;
            });
        }

        // Handle respawn if player died (lava or otherwise)
        if (this.player.health.isDead) {
            this.score = 0;
            this.hasTrophy = false;
            this.trophyMessageShown = true;
            this.player = createPlayerAtSpawn(this.levelManager);
            this.platforms.setPlatforms(this.levelManager.getCurrentLevel().platforms);
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
        drawPlayerHealthBar(this.ctx, this.player, this.cameraX, this.cameraY);
        drawDebugPlayerLine(this.ctx, this.player, this.cameraX, this.cameraY);

        this.monsters = handleMonsters(
            this.ctx,
            this.monsters,
            this.player,
            this.cameraX,
            this.flyMode,
            this.canvas.width,
            () => {
                this.score = 0;
                this.hasTrophy = false;
                this.trophyMessageShown = true;
                this.player = createPlayerAtSpawn(this.levelManager);
                this.platforms.setPlatforms(this.levelManager.getCurrentLevel().platforms);
            },
            (explosion) => this.explosions.push(explosion),
            this.effects
        );

        handleShooting(this.player, this.keys, level.width);
        this.player.bullets.forEach((b) => b.draw(this.ctx, this.cameraX));

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
            level.width,
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
                level.width
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

if (this.player.y > level.height + 100) {
  this.player.health.hp = 0;
  this.player.health.isDead = true;
}


    };//end of loop
}

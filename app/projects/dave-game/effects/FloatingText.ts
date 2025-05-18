
export class FloatingText {
    x: number;
    y: number;
    text: string;
    color: string;
    life: number = 60; // frames to live (e.g. 1 second at 60fps)
    opacity: number = 1;
    done: boolean = false;


    constructor(x: number, y: number, text: string, color: string) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
    }

    update() {
        this.y -= 0.5; // float upward
        this.life--;
        this.opacity = this.life / 60;
          this.done = this.life <= 0; //
    }

    draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        ctx.font = "16px Arial";
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillText(this.text, this.x - cameraX, this.y - cameraY);
        ctx.globalAlpha = 1;
    }

    isExpired(): boolean {
        return this.life <= 0;
    }
}
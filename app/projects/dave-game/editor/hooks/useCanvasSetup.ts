import { useEffect } from "react";
import { GRID_SIZE } from "../types";
import { drawGrid } from "../utils";

export function useCanvasSetup(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  levelSize: { width: number; height: number }
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const snapW = Math.ceil((levelSize.width + 1) / GRID_SIZE) * GRID_SIZE;
    const snapH = Math.ceil((levelSize.height + 1) / GRID_SIZE) * GRID_SIZE;

    canvas.width = snapW;
    canvas.height = snapH;

    ctx.clearRect(0, 0, snapW, snapH);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, snapW, snapH);

    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = "white";
      ctx.fillRect(Math.random() * snapW, Math.random() * snapH, 2, 2);
    }

    const moon = new Image();
    moon.src = "/assets/images/moon.png";
    moon.onload = () => ctx.drawImage(moon, snapW - 200, 100, 100, 100);

    drawGrid(ctx, snapW, snapH);
  }, [canvasRef, levelSize]);
}
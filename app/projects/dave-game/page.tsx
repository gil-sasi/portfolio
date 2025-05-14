"use client";

import { useEffect, useRef } from "react";
import { Game } from "./engine/game";
//UI and canvas setup
export default function DaveGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const game = new Game(canvasRef.current);
      game.start();
      return () => game.stop();
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl mb-4">Daring Platformer</h1>
      <canvas
        ref={canvasRef}
        width={1500}
        height={900}
        style={{
          border: "2px solid white",
          imageRendering: "pixelated",
        }}
      />
    </main>
  );
}

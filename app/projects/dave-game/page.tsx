"use client";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { FaShoePrints } from "react-icons/fa";
import { GiPistolGun } from "react-icons/gi";
import { useEffect, useRef } from "react";
import { Game } from "./engine/game";
import { enableMobileControls } from "./engine/mobileControls"; // you'll create this file (see below)

export default function DaveGamePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const game = new Game(canvasRef.current);
            game.start();

            // 👇 Enable mobile controls
            enableMobileControls(game["keys"]); // access the `keys` object from game instance

            return () => game.stop();
        }
    }, []);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 relative">
            <h1 className="text-2xl mb-4">Dangerous Gil</h1>

            <canvas
                ref={canvasRef}
                width={1500}
                height={900}
                style={{
                    border: "2px solid white",
                    imageRendering: "pixelated",
                }}
            />


           {/* ✅ Mobile Controls (SVG Version) */}
<div className="fixed bottom-6 left-6 flex gap-5 z-50">
  <div className="flex flex-col items-center gap-1">
    <button id="jump" className="touch-btn">
      <FaShoePrints size={28} />
    </button>
    <span className="text-xs text-white">Jump</span>
  </div>
  <div className="flex gap-3">
    <div className="flex flex-col items-center gap-1">
      <button id="left" className="touch-btn">
        <MdArrowBack size={28} />
      </button>
      <span className="text-xs text-white">Left</span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <button id="right" className="touch-btn">
        <MdArrowForward size={28} />
      </button>
      <span className="text-xs text-white">Right</span>
    </div>
  </div>
  <div className="flex flex-col items-center gap-1">
    <button id="shoot" className="touch-btn">
      <GiPistolGun size={28} />
    </button>
    <span className="text-xs text-white">Shoot</span>
  </div>
</div>
        </main>
    );
}
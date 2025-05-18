"use client";
import { useEffect, useRef, useState } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdFullscreen,
  MdFullscreenExit,
} from "react-icons/md";
import { FaShoePrints } from "react-icons/fa";
import { GiPistolGun } from "react-icons/gi";
import { Game } from "./engine/game";
import { enableMobileControls } from "./engine/mobileControls";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "./hooks/useIsMobile";

export default function DaveGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    if (canvasRef.current) {
      const game = new Game(canvasRef.current);
      game.start();
      setTimeout(() => enableMobileControls(game["keys"]), 100);
      return () => game.stop();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const wrapper = document.getElementById("canvas-wrapper");
    const tryFullscreen = () => {
      if (wrapper && !document.fullscreenElement && wrapper.requestFullscreen) {
        wrapper.requestFullscreen().catch(() => {});
      }
    };

    document.addEventListener("touchend", tryFullscreen, { once: true });
    document.addEventListener("click", tryFullscreen, { once: true });

    return () => {
      document.removeEventListener("touchend", tryFullscreen);
      document.removeEventListener("click", tryFullscreen);
    };
  }, [isMobile]);

  const toggleFullscreen = () => {
    const wrapper = document.getElementById("canvas-wrapper");
    if (!document.fullscreenElement && wrapper?.requestFullscreen) {
      wrapper.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
      {mounted && <h1 className="text-2xl mt-4 mb-2 text-center">{t("gamename")}</h1>}

      <div
        id="canvas-wrapper"
        className="relative"
        style={{
          width: isFullscreen || isMobile ? "100vw" : "auto",
          height: isFullscreen || isMobile ? "100vh" : "auto",
          overflow: "hidden",
          touchAction: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          width={isMobile ? window.innerWidth : 1500}
          height={isMobile ? window.innerHeight : 900}
          style={{
            width: isMobile ? "100vw" : "100%",
            height: isMobile ? "100vh" : "auto",
            display: "block",
            imageRendering: "pixelated",
            border: "2px solid white",
            touchAction: "none",
          }}
        />

        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition z-10"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
        </button>
      </div>

      {isMobile && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center flex-wrap gap-5 px-2 z-50">
          <div className="flex flex-col items-center gap-1">
            <button id="jump" className="touch-btn" onTouchStart={() => dispatchKey("Space")} onTouchEnd={() => releaseKey("Space")}> <FaShoePrints size={28} /> </button>
            <span className="text-xs text-white">Jump</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button id="left" className="touch-btn" onTouchStart={() => dispatchKey("ArrowLeft")} onTouchEnd={() => releaseKey("ArrowLeft")}> <MdArrowBack size={28} /> </button>
            <span className="text-xs text-white">Left</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button id="right" className="touch-btn" onTouchStart={() => dispatchKey("ArrowRight")} onTouchEnd={() => releaseKey("ArrowRight")}> <MdArrowForward size={28} /> </button>
            <span className="text-xs text-white">Right</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button id="shoot" className="touch-btn" onTouchStart={() => dispatchKey("Control")} onTouchEnd={() => releaseKey("Control")}> <GiPistolGun size={28} /> </button>
            <span className="text-xs text-white">Shoot</span>
          </div>
        </div>
      )}
    </main>
  );

  // Mobile button key dispatch helpers
  function dispatchKey(key: string) {
    const event = new KeyboardEvent("keydown", { key });
    document.dispatchEvent(event);
  }

  function releaseKey(key: string) {
    const event = new KeyboardEvent("keyup", { key });
    document.dispatchEvent(event);
  }
}

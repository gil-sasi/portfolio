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
      requestAnimationFrame(() => {
        enableMobileControls(game["keys"]);
      });
      return () => game.stop();
    }
  }, []);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (document.fullscreenElement) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        canvas.width = 1500;
        canvas.height = 900;
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const wrapper = document.getElementById("canvas-wrapper");
    const tryFullscreen = () => {
      if (
        wrapper &&
        !document.fullscreenElement &&
        wrapper.requestFullscreen
      ) {
        wrapper.requestFullscreen().catch(() => {});
      } else {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
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
    <main className="flex flex-col items-center justify-start min-h-screen bg-black text-white relative pb-28">
      {mounted && <h1 className="text-2xl mt-4 mb-2">{t("gamename")}</h1>}

      <button
        onClick={toggleFullscreen}
        className="mb-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition z-10"
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
      </button>

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
          width={1500}
          height={900}
          style={{
            border: "2px solid white",
            imageRendering: "pixelated",
            display: "block",
            width: isFullscreen || isMobile ? "100vw" : "1500px",
            height: isFullscreen || isMobile ? "100vh" : "900px",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>

      {/* Touch Controls */}
      {isMobile && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-5 z-50">
          {[
            { id: "jump", icon: <FaShoePrints size={28} />, label: "Jump" },
            { id: "left", icon: <MdArrowBack size={28} />, label: "Left" },
            { id: "right", icon: <MdArrowForward size={28} />, label: "Right" },
            { id: "shoot", icon: <GiPistolGun size={28} />, label: "Shoot" },
          ].map(({ id, icon, label }) => (
            <div key={id} className="flex flex-col items-center gap-1">
              <button id={id} className="touch-btn">
                {icon}
              </button>
              <span className="text-xs text-white">{label}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

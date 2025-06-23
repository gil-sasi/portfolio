"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import TrackProjectVisit from "../../../components/TrackProjectVisit";
import { useEffect, useState } from "react";

export default function DangerousGilHome() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white px-4">
      <TrackProjectVisit
        projectId="dave-game"
        projectName="Dave's Adventure Game"
      />
      <h1 className="text-5xl font-bold mb-10 text-center">Dangerous Gil</h1>

      <div className="flex flex-col gap-6 w-full max-w-xs">
        <Link
          href="/projects/dave-game/play"
          className="game-button border border-white text-white hover:bg-white/10"
        >
          🎮 {t("newgame")}
        </Link>

        <Link
          href="/projects/dave-game/editor"
          className="game-button border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
        >
          🧱 {t("createlevel")}
        </Link>
      </div>
    </main>
  );
}

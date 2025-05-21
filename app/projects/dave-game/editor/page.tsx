"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LevelEditorCanvas from "./editor-canvas";

export default function LevelEditorPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === "141291") {
      setAuthenticated(true); 
    } else {
      setError("❌ Wrong password");
    }
  };

  if (!mounted) return null;

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-3xl font-bold mb-6">{t("enterpassword")}</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <input
            type="password"
            placeholder={t("password")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            {t("unlockeditor")}
          </button>
          {error && <p className="text-red-400">{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <LevelEditorCanvas />
    </main>
  );
}

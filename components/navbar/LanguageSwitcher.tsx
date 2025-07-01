"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

interface LanguageSwitcherProps {
  isMobile?: boolean;
  onLanguageChange?: () => void;
}

export default function LanguageSwitcher({
  isMobile = false,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();

  // Initialize language from localStorage on mount
  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang).catch(console.error);
    }
  }, [i18n]);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng).catch(console.error);
    localStorage.setItem("i18nextLng", lng);
    onLanguageChange?.();
  };

  if (isMobile) {
    return (
      <div>
        <p className="text-xl font-bold text-white mb-4 text-center">
          🌍 {t("language", "Language")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleLanguageChange("en")}
            title="English"
            className="flex items-center justify-center py-5 px-6 rounded-2xl text-lg font-semibold text-white bg-blue-600/30 hover:bg-blue-600/50 active:bg-blue-600/70 transition-all duration-200 border border-blue-500/40 touch-manipulation"
          >
            <Image
              src="/flags/us.png"
              alt="English"
              width={32}
              height={32}
              className="rounded mr-3 border border-white/30"
            />
            English
          </button>
          <button
            onClick={() => handleLanguageChange("he")}
            title="עברית"
            className="flex items-center justify-center py-5 px-6 rounded-2xl text-lg font-semibold text-white bg-green-600/30 hover:bg-green-600/50 active:bg-green-600/70 transition-all duration-200 border border-green-500/40 touch-manipulation"
          >
            <Image
              src="/flags/il.png"
              alt="Hebrew"
              width={32}
              height={32}
              className="rounded mr-3 border border-white/30"
            />
            עברית
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-1 items-center">
      <button
        onClick={() => handleLanguageChange("en")}
        title="English"
        className="p-1 rounded touch-manipulation transition-transform hover:scale-105"
      >
        <Image
          src="/flags/us.png"
          alt="English"
          width={40}
          height={40}
          className="rounded-sm border border-white"
        />
      </button>
      <button
        onClick={() => handleLanguageChange("he")}
        title="עברית"
        className="p-1 rounded touch-manipulation transition-transform hover:scale-105"
      >
        <Image
          src="/flags/il.png"
          alt="Hebrew"
          width={40}
          height={40}
          className="rounded-sm border border-white"
        />
      </button>
    </div>
  );
}

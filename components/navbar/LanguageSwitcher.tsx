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
      <div className="pt-4 border-t border-gray-700/50">
        <p className="text-sm text-gray-400 mb-3">
          {t("language", "Language")}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleLanguageChange("en")}
            title="English"
            className="p-3 rounded-lg hover:bg-gray-700/50 transition-colors touch-manipulation min-h-[48px] flex items-center justify-center"
          >
            <Image
              src="/flags/us.png"
              alt="English"
              width={32}
              height={32}
              className="rounded border border-white/20"
            />
          </button>
          <button
            onClick={() => handleLanguageChange("he")}
            title="עברית"
            className="p-3 rounded-lg hover:bg-gray-700/50 transition-colors touch-manipulation min-h-[48px] flex items-center justify-center"
          >
            <Image
              src="/flags/il.png"
              alt="Hebrew"
              width={32}
              height={32}
              className="rounded border border-white/20"
            />
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

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
        <p className="text-sm text-gray-400 mb-2">
          {t("language", "Language")}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleLanguageChange("en")}
            title="English"
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <Image
              src="/flags/us.png"
              alt="English"
              width={24}
              height={24}
              className="rounded"
            />
          </button>
          <button
            onClick={() => handleLanguageChange("he")}
            title="עברית"
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <Image
              src="/flags/il.png"
              alt="Hebrew"
              width={24}
              height={24}
              className="rounded"
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

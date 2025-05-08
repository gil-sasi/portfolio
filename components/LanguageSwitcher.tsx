"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import "../../src/i18n/config"; //
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <div className="flex gap-2 ml-4">
      <button onClick={() => handleLanguageChange("en")} title="English">
        <Image
          src="/flags/us.png"
          alt="English"
          width={28}
          height={28}
          className="rounded-sm border border-white"
        />
      </button>
      <button onClick={() => handleLanguageChange("he")} title="עברית">
        <Image
          src="/flags/israel.png"
          alt="Hebrew"
          width={28}
          height={28}
          className="rounded-sm border border-white"
        />
      </button>
    </div>
  );
};

export default LanguageSwitcher;

"use client";

import Link from "next/link";
import { useTranslation, Trans } from "react-i18next";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const lng = localStorage.getItem("i18nextLng");
    if (lng && lng !== i18n.language) {
      i18n.changeLanguage(lng);
    }
    setMounted(true);
  }, [i18n]);

  if (!mounted) return null;

  return (
    <main className="flex flex-col items-center justify-start min-h-screen h-full overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-4 sm:px-6 pt-8 sm:pt-16 pb-16">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 text-center leading-tight">
        <Trans
          i18nKey="heroTitle"
          values={{ name: "Gil" }}
          components={[<span key="name" className="text-blue-500" />]}
        />
      </h1>

      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 text-center max-w-2xl mb-8 sm:mb-10 px-2">
        {t("heroSubtitle")}
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md sm:max-w-none">
        <Link
          href="/projects"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 sm:py-3 rounded-lg shadow-md transition font-medium text-base sm:text-sm text-center touch-manipulation"
        >
          🚀 {t("viewprojects")}
        </Link>
        <Link
          href="/contact"
          className="border-2 border-white hover:bg-white hover:text-black text-white px-6 py-4 sm:py-3 rounded-lg transition font-medium text-base sm:text-sm text-center touch-manipulation"
        >
          📬 {t("contactMe")}
        </Link>
      </div>
    </main>
  );
}

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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 text-center">
        <Trans
          i18nKey="heroTitle"
          values={{ name: "Gil" }}
          components={[<span className="text-blue-500" />]}
        />
      </h1>

      <p className="text-lg sm:text-xl md:text-2xl text-gray-300 text-center max-w-2xl mb-10">
        {t("heroSubtitle")}
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/projects"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          🚀 {t("viewprojects")}
        </Link>
        <Link
          href="/contact"
          className="border border-white hover:bg-white hover:text-black text-white px-6 py-3 rounded-lg transition"
        >
          📬 {t("contactMe")}
        </Link>
      </div>
    </main>
  );
}

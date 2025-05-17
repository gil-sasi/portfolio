"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("myprojects")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Link Shortener Project */}
        <Link href="/projects/link-shortener">
          <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition cursor-pointer shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              🔗 {t("linkshortener")}
            </h2>
            <p className="text-sm text-gray-400">{t("linkshortenerdesc")}</p>
          </div>
        </Link>

        {/* Image-to-Text OCR Project */}
        <Link href="/projects/image-to-text">
          <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition cursor-pointer shadow-md">
            <h2 className="text-xl font-semibold mb-2">🖼️ {t("ocrtitle")}</h2>
            <p className="text-sm text-gray-400">{t("ocrdesc")}</p>
          </div>
        </Link>

        {/* Dangerous Gil Game Project */}
        <Link href="/projects/dave-game">
          <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition cursor-pointer shadow-md">
            <h2 className="text-xl font-semibold mb-2">🎮{t("gamename")}</h2>
            <p className="text-sm text-gray-400">{t("gamedescription")}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

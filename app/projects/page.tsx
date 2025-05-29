"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen overflow-auto px-6 py-10 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-10">
        {t("myprojects")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Link Shortener */}
        <Link href="/projects/link-shortener">
          <div className="bg-gray-800 hover:bg-gray-700 transition rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 flex items-center">
              🔗 {t("linkshortener")}
            </h2>
            <p className="text-gray-400 text-sm">{t("linkshortenerdesc")}</p>
          </div>
        </Link>

        {/* Image to Text */}
        <Link href="/projects/image-to-text">
          <div className="bg-gray-800 hover:bg-gray-700 transition rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 flex items-center">
              🖼️ {t("ocrtitle")}
            </h2>
            <p className="text-gray-400 text-sm">{t("ocrdesc")}</p>
          </div>
        </Link>

        {/* Dave Game */}
        <Link href="/projects/dave-game">
          <div className="bg-gray-800 hover:bg-gray-700 transition rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 flex items-center">
              🎮 {t("gamename")}
            </h2>
            <p className="text-gray-400 text-sm">{t("gamedescription")}</p>
          </div>
        </Link>

        {/* Barbershop */}
        <Link href="/projects/barbershop">
          <div className="bg-gray-800 hover:bg-gray-700 transition rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 flex items-center">
              💈 {t("mobilbarbereapp")}
            </h2>
            <p className="text-gray-400 text-sm">{t("barbershop")}</p>
          </div>
        </Link>

        {/* Quiz App */}
        <Link href="/projects/quiz-app">
          <div className="bg-gray-800 hover:bg-gray-700 transition rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 flex items-center">
              🧠 {t("quizapptitle")}
            </h2>
            <p className="text-gray-400 text-sm">{t("quizappdesc")}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

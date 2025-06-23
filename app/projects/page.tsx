"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen overflow-auto px-4 sm:px-6 py-8 sm:py-10 text-white">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10">
        {t("myprojects")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {/* Link Shortener */}
        <Link href="/projects/link-shortener" className="group">
          <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700 hover:border-gray-600 hover:shadow-xl group-hover:scale-105 transform touch-manipulation">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 flex items-center text-white group-hover:text-blue-400 transition-colors">
              🔗 {t("linkshortener")}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t("linkshortenerdesc")}
            </p>
          </div>
        </Link>

        {/* Image to Text */}
        <Link href="/projects/image-to-text" className="group">
          <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700 hover:border-gray-600 hover:shadow-xl group-hover:scale-105 transform touch-manipulation">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 flex items-center text-white group-hover:text-blue-400 transition-colors">
              🖼️ {t("ocrtitle")}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t("ocrdesc")}
            </p>
          </div>
        </Link>

        {/* Dave Game */}
        <Link href="/projects/dave-game" className="group">
          <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700 hover:border-gray-600 hover:shadow-xl group-hover:scale-105 transform touch-manipulation">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 flex items-center text-white group-hover:text-blue-400 transition-colors">
              🎮 {t("gamename")}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t("gamedescription")}
            </p>
          </div>
        </Link>

        {/* Barbershop */}
        <Link href="/projects/barbershop" className="group">
          <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700 hover:border-gray-600 hover:shadow-xl group-hover:scale-105 transform touch-manipulation">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 flex items-center text-white group-hover:text-blue-400 transition-colors">
              💈 {t("mobilbarbereapp")}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t("barbershop")}
            </p>
          </div>
        </Link>

        {/* Quiz App */}
        <Link href="/projects/quiz-app" className="group">
          <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700 hover:border-gray-600 hover:shadow-xl group-hover:scale-105 transform touch-manipulation">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 flex items-center text-white group-hover:text-blue-400 transition-colors">
              🧠 {t("quizapptitle")}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t("quizappdesc")}
            </p>
          </div>
        </Link>

        {/* Coca Cola Visitor Management Web App */}
        <Link href="/projects/visitor-management" className="group">
          <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-700 hover:border-gray-600 hover:shadow-xl group-hover:scale-105 transform touch-manipulation">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 flex items-center text-white group-hover:text-blue-400 transition-colors">
              🥤 {t("VisitorManagementTitle")}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t("VisitorManagementDescription")}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

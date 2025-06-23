"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation, Trans } from "react-i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  // Calculate years of experience dynamically (started in 2024)
  const getYearsOfExperience = () => {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();

    // If we're still in 2024, show "1 year"
    // Otherwise calculate the difference
    return currentYear >= startYear
      ? Math.max(1, currentYear - startYear + 1)
      : 1;
  };

  useEffect(() => {
    const lng = localStorage.getItem("i18nextLng");
    if (lng && lng !== i18n.language) {
      i18n.changeLanguage(lng);
    }
    setMounted(true);
  }, [i18n]);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-bg opacity-10"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 float-animation"></div>
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-32 left-20 w-12 h-12 bg-pink-500 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center">
        {/* Hero Section */}
        <div className="glass rounded-3xl p-8 sm:p-12 mb-8 max-w-4xl mx-auto">
          <div className="mb-6">
            {user?.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt="Profile"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-2xl font-bold text-white border-2 border-white/20">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : "GS"}
              </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <Trans
              i18nKey="heroTitle"
              values={{ name: user?.firstName || "Gil" }}
              components={[
                <span
                  key="name"
                  className="gradient-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                />,
              ]}
            />
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="modern-card p-4">
              <div className="text-2xl font-bold text-blue-400">6+</div>
              <div className="text-sm text-gray-400">{t("projects")}</div>
            </div>
            <div className="modern-card p-4">
              <div className="text-2xl font-bold text-purple-400">
                {getYearsOfExperience()}+
              </div>
              <div className="text-sm text-gray-400">{t("years")}</div>
            </div>
            <div className="modern-card p-4">
              <div className="text-2xl font-bold text-pink-400">15+</div>
              <div className="text-sm text-gray-400">{t("technologies")}</div>
            </div>
            <div className="modern-card p-4">
              <div className="text-2xl font-bold text-cyan-400">∞</div>
              <div className="text-sm text-gray-400">{t("passion")}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/projects"
              className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg glow-hover transition-all duration-300 hover:scale-105 text-center"
            >
              🚀 {t("viewprojects")}
            </Link>
            <Link
              href="/contact"
              className="btn-secondary px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 text-center"
            >
              📬 {t("contactMe")}
            </Link>
          </div>
        </div>

        {/* Tech Stack Preview */}
        <div className="modern-card p-6 w-full max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">
            <span className="gradient-text">{t("techStackLabel")}</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "React",
              "Next.js",
              "TypeScript",
              "Node.js",
              "MongoDB",
              "Tailwind CSS",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-sm font-medium border border-white/10 hover:border-blue-400/50 transition-all duration-300 glow-hover"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

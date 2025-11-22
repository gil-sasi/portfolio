"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

const projects = [
  {
    id: "link-shortener",
    icon: "🔗",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "image-to-text",
    icon: "🖼️",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "dave-game",
    icon: "🎮",
    color: "from-red-500 to-pink-500",
    bgColor: "from-red-500/20 to-pink-500/20",
  },
  {
    id: "backgammon",
    icon: "🎲",
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "barbershop",
    icon: "💈",
    color: "from-purple-500 to-violet-500",
    bgColor: "from-purple-500/20 to-violet-500/20",
  },
  {
    id: "barbershop-webapp",
    icon: "✂️",
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "quiz-app",
    icon: "🧠",
    color: "from-orange-500 to-yellow-500",
    bgColor: "from-orange-500/20 to-yellow-500/20",
  },
  {
    id: "visitor-management",
    icon: "🥤",
    color: "from-indigo-500 to-blue-500",
    bgColor: "from-indigo-500/20 to-blue-500/20",
  },
  {
    id: "online-shop",
    icon: "🛍️",
    color: "from-pink-500 to-rose-500",
    bgColor: "from-pink-500/20 to-rose-500/20",
  },
];

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="gradient-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t("myprojects")}
              </span>
            </h1>
            <p className="text-lg text-gray-300">{t("exploreCollection")}</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group"
            >
              <div className="modern-card p-6 h-full min-h-[200px] hover:scale-105 transform transition-all duration-500 relative overflow-hidden">
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.bgColor} opacity-50 rounded-2xl`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center text-2xl shadow-lg glow`}
                    >
                      {project.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300">
                    {t(
                      project.id === "link-shortener"
                        ? "linkshortener"
                        : project.id === "image-to-text"
                        ? "ocrtitle"
                        : project.id === "dave-game"
                        ? "gamename"
                        : project.id === "backgammon"
                        ? "backgammon"
                        : project.id === "barbershop"
                        ? "mobilbarbereapp"
                        : project.id === "barbershop-webapp"
                        ? "barbershopWebappTitle"
                        : project.id === "quiz-app"
                        ? "quizapptitle"
                        : project.id === "online-shop"
                        ? "onlineshopTitle"
                        : "VisitorManagementTitle"
                    )}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {t(
                      project.id === "link-shortener"
                        ? "linkshortenerdesc"
                        : project.id === "image-to-text"
                        ? "ocrdesc"
                        : project.id === "dave-game"
                        ? "gamedescription"
                        : project.id === "backgammon"
                        ? "backgammonDescription"
                        : project.id === "barbershop"
                        ? "barbershop"
                        : project.id === "barbershop-webapp"
                        ? "barbershopWebappDescription"
                        : project.id === "quiz-app"
                        ? "quizappdesc"
                        : project.id === "online-shop"
                        ? "onlineshopDescription"
                        : "VisitorManagementDescription"
                    )}
                  </p>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-500/20 text-green-400 border-green-500/30">
                      {t("live")}
                    </span>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              <span className="gradient-text">{t("wantToWorkTogether")}</span>
            </h2>
            <p className="text-gray-300 mb-6">{t("discussOpportunities")}</p>
            <Link
              href="/contact"
              className="btn-primary px-8 py-3 rounded-xl font-semibold glow-hover transition-all duration-300 hover:scale-105 inline-block"
            >
              {t("getInTouchCTA")} 🚀
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import TrackProjectVisit from "../../../components/TrackProjectVisit";
import Footer from "../../../components/Footer";

export default function OnlineShopProject() {
  const { t } = useTranslation();

  const features = [
    {
      icon: "🛍️",
      title: t("onlineshopFeature1"),
      color: "from-pink-500 to-rose-500",
      textIcon: "🛍️",
    },
    {
      icon: "🚚",
      title: t("onlineshopFeature2"),
      color: "from-blue-500 to-cyan-500",
      textIcon: "🚚",
    },
    {
      icon: "🔒",
      title: t("onlineshopFeature3"),
      color: "from-green-500 to-emerald-500",
      textIcon: "🔒",
    },
    {
      icon: "🛒",
      title: t("onlineshopFeature4"),
      color: "from-purple-500 to-indigo-500",
      textIcon: "🛒",
    },
    {
      icon: "📱",
      title: t("onlineshopFeature5"),
      color: "from-orange-500 to-yellow-500",
      textIcon: "📱",
    },
    {
      icon: "⚙️",
      title: t("onlineshopFeature6"),
      color: "from-cyan-500 to-blue-500",
      textIcon: "⚙️",
    },
  ];

  const techStack = [
    {
      icon: "🖥️",
      title: "Frontend",
      textIcon: "💻",
      technologies: [
        { name: "Next.js", color: "from-gray-800 to-black" },
        { name: "React", color: "from-blue-400 to-blue-600" },
        { name: "Tailwind CSS", color: "from-cyan-400 to-cyan-600" },
        { name: "TypeScript", color: "from-blue-500 to-blue-700" },
      ],
    },
    {
      icon: "⚙️",
      title: "Backend",
      textIcon: "🔧",
      technologies: [
        { name: "Node.js", color: "from-green-500 to-green-700" },
        { name: "Express", color: "from-gray-500 to-gray-700" },
        { name: "MongoDB", color: "from-green-600 to-green-800" },
      ],
    },
    {
      icon: "🔐",
      title: "Admin Authentication",
      textIcon: "🔒",
      technologies: [
        { name: "JWT Auth", color: "from-orange-500 to-orange-700" },
        { name: "bcrypt", color: "from-red-500 to-red-700" },
      ],
    },
    {
      icon: "🌍",
      title: "Deployment",
      textIcon: "🚀",
      technologies: [
        { name: "Vercel", color: "from-purple-500 to-purple-700" },
        { name: "MongoDB Atlas", color: "from-green-500 to-green-700" },
      ],
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TrackProjectVisit
        projectId="online-shop"
        projectName="Online Clothing Store"
      />

      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-rose-500/10 rounded-full blur-xl"></div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-pink-500 rounded-full opacity-20 float-animation"></div>
      <div
        className="absolute top-40 right-10 w-12 h-12 bg-rose-500 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-medium transition-colors duration-300 group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("backToProjects")}
          </Link>

          {/* Header */}
          <div className="text-center">
            <div className="glass rounded-2xl p-8 max-w-3xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center text-3xl font-bold glow">
                🛍️
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                  {t("onlineshopTitle")}
                </span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t("onlineshopDescription")}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              ✨{" "}
              <span className="gradient-text bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                {t("keyFeatures")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-xl mb-3 glow`}
                  >
                    <span className="text-white text-2xl">
                      {feature.textIcon}
                    </span>
                  </div>
                  <p className="text-gray-200 font-medium">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              🛠️{" "}
              <span className="gradient-text bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                {t("techStack")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {techStack.map((section, index) => (
                <div key={index} className="glass p-6 rounded-xl">
                  <h3 className="font-semibold text-pink-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">{section.textIcon}</span>{" "}
                    {section.title}
                  </h3>
                  <div className="space-y-2">
                    {section.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`inline-block px-3 py-1 bg-gradient-to-r ${tech.color} bg-opacity-20 text-white rounded-full text-sm border border-gray-600 mb-1 mr-1`}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Demo Link */}
          <div className="modern-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">
              🚀{" "}
              <span className="gradient-text bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                {t("tryItOut")}
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://onlineshop-webapp.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
              >
                🌐{" "}
                <span className="flex items-center justify-center gap-2">
                  {t("visitLiveWebsite")}
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}


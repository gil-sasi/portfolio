"use client";

import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../../components/Footer";

export default function QuizAppProjectPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const images = Array.from(
    { length: 17 },
    (_, i) => `/assets/quiz-app/${i + 1}.jpg`
  );

  const features = [
    {
      icon: "⏱️",
      title: t("featuretimer"),
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: "👨‍💼",
      title: t("featureadminpanel"),
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: "🏆",
      title: t("featurescoreboard"),
      color: "from-green-500 to-blue-500",
    },
    {
      icon: "🔐",
      title: t("featurejwt"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "✨",
      title: t("featurereanimated"),
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: "📱",
      title: t("featureresponsive"),
      color: "from-pink-500 to-red-500",
    },
  ];

  const techStack = [
    {
      icon: "📱",
      title: "Frontend",
      technologies: [
        { name: "React Native", color: "from-blue-400 to-blue-600" },
        { name: "TypeScript", color: "from-blue-500 to-blue-700" },
        { name: "Reanimated v3", color: "from-purple-500 to-purple-700" },
      ],
    },
    {
      icon: "⚙️",
      title: "Backend",
      technologies: [
        { name: "Node.js", color: "from-green-500 to-green-700" },
        { name: "Express", color: "from-gray-500 to-gray-700" },
        { name: "MongoDB", color: "from-green-600 to-green-800" },
      ],
    },
    {
      icon: "🔐",
      title: "Authentication",
      technologies: [
        { name: "JWT Auth", color: "from-orange-500 to-orange-700" },
        { name: "Token Storage", color: "from-yellow-500 to-yellow-700" },
      ],
    },
    {
      icon: "🚀",
      title: "Deployment",
      technologies: [{ name: "Vercel", color: "from-black to-gray-800" }],
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl"></div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-orange-500 rounded-full opacity-20 float-animation"></div>
      <div
        className="absolute top-40 right-10 w-12 h-12 bg-yellow-500 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors duration-300 group"
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-yellow-600 flex items-center justify-center text-3xl font-bold glow">
                🧠
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
                  {t("quizapp")}
                </span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t("quizappdesc")}
              </p>
            </div>
          </div>

          {/* Screenshots and Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Screenshots */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                <span className="gradient-text bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                  📱 App Screenshots
                </span>
              </h2>
              <div className="max-w-sm mx-auto">
                <div className="glass rounded-3xl p-6 shadow-2xl">
                  <Swiper
                    navigation
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    className="quiz-swiper rounded-2xl overflow-hidden"
                  >
                    {images.map((src, index) => (
                      <SwiperSlide
                        key={index}
                        className="flex items-center justify-center"
                      >
                        <Image
                          src={src}
                          alt={`Quiz App Screenshot ${index + 1}`}
                          width={300}
                          height={600}
                          className="object-contain rounded-xl max-h-[500px]"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                <span className="gradient-text bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  ✨ {t("keyFeatures")}
                </span>
              </h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="glass p-4 rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-lg glow`}
                      >
                        {feature.icon}
                      </div>
                      <p className="text-gray-200 font-medium">
                        {feature.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              <span className="gradient-text bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                🛠️ {t("techStack")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {techStack.map((section, index) => (
                <div key={index} className="glass p-6 rounded-xl">
                  <h3 className="font-semibold text-orange-400 mb-4 flex items-center gap-2">
                    {section.icon} {section.title}
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

          {/* GitHub Links */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                🔗 GitHub Repositories
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a
                href="https://github.com/deadly91/quiz-app-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl glow">
                    📱
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                      Frontend Repository
                    </h3>
                    <p className="text-sm text-gray-400">
                      React Native + TypeScript
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="https://github.com/deadly91/quiz-app-backend"
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-xl glow">
                    ⚙️
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-400 group-hover:text-green-300 transition-colors">
                      Backend Repository
                    </h3>
                    <p className="text-sm text-gray-400">
                      Node.js + Express + MongoDB
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background-color: rgba(251, 146, 60, 0.2);
          backdrop-filter: blur(6px);
          border-radius: 9999px;
          padding: 10px;
          transition: all 0.3s ease;
          border: 1px solid rgba(251, 146, 60, 0.3);
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(251, 146, 60, 0.4);
          transform: scale(1.1);
        }

        .swiper-button-next:focus,
        .swiper-button-prev:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.5);
        }
      `}</style>
    </div>
  );
}

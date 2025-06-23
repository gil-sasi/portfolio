"use client";

import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TrackProjectVisit from "../../../components/TrackProjectVisit";
import TestProjectTracking from "../../../components/TestProjectTracking";

export default function BarbershopProjectPage() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const images = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
  ].map((filename) => `/assets/barbershop/${filename}`);

  const features = [
    {
      icon: "👤",
      title: t("barbershopFeature1"),
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: "📅",
      title: t("barbershopFeature2"),
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: "✂️",
      title: t("barbershopFeature3"),
      color: "from-pink-500 to-purple-500",
    },
    {
      icon: "🔔",
      title: t("barbershopFeature4"),
      color: "from-orange-500 to-pink-500",
    },
    {
      icon: "🛒",
      title: t("barbershopFeature5"),
      color: "from-violet-500 to-purple-500",
    },
  ];

  if (!isMounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TrackProjectVisit
        projectId="barbershop"
        projectName="Barbershop Management App"
      />
      <TestProjectTracking
        projectId="barbershop"
        projectName="Barbershop Management App"
      />

      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-violet-500/10 rounded-full blur-xl"></div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-purple-500 rounded-full opacity-20 float-animation"></div>
      <div
        className="absolute top-40 right-10 w-12 h-12 bg-violet-500 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300 group"
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-3xl font-bold glow">
                💈
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                  {t("barbershopApp")}
                </span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t("barbershopDescription")}
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              <span className="gradient-text bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
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
                    {feature.icon}
                  </div>
                  <p className="text-gray-200 font-medium">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshots Section */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              <span className="gradient-text bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                📸 {t("screenshots")}
              </span>
            </h2>

            <div className="max-w-md mx-auto">
              <div className="glass rounded-3xl p-6 shadow-2xl">
                <Swiper
                  modules={[Navigation]}
                  navigation
                  spaceBetween={20}
                  slidesPerView={1}
                  className="rounded-xl overflow-hidden custom-swiper"
                >
                  {images.map((src, i) => (
                    <SwiperSlide key={i}>
                      <div className="relative">
                        <Image
                          src={src}
                          alt={`Screenshot ${i + 1}`}
                          width={300}
                          height={600}
                          className="w-full max-h-[500px] object-contain rounded-xl"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              <span className="gradient-text bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                {t("techStack")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-xl">
                <h3 className="font-semibold text-purple-400 mb-4 flex items-center gap-2">
                  📱 Frontend
                </h3>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                    React Native
                  </span>
                  <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 ml-2">
                    TypeScript
                  </span>
                  <span className="inline-block px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm border border-violet-500/30 ml-2">
                    Expo
                  </span>
                </div>
              </div>
              <div className="glass p-6 rounded-xl">
                <h3 className="font-semibold text-violet-400 mb-4 flex items-center gap-2">
                  ⚙️ Backend
                </h3>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                    Node.js
                  </span>
                  <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 ml-2">
                    Express
                  </span>
                  <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30 ml-2">
                    MongoDB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background-color: rgba(147, 51, 234, 0.2);
          backdrop-filter: blur(6px);
          border-radius: 9999px;
          padding: 10px;
          transition: all 0.3s ease;
          border: 1px solid rgba(147, 51, 234, 0.3);
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(147, 51, 234, 0.4);
          transform: scale(1.1);
        }

        .swiper-button-next:focus,
        .swiper-button-prev:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.5);
        }
      `}</style>
    </div>
  );
}

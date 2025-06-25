"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import TrackProjectVisit from "../../../components/TrackProjectVisit";
import TestProjectTracking from "../../../components/TestProjectTracking";

export default function VisitorManagementProject() {
  const { t } = useTranslation();

  const screenshots = [
    { src: "/assets/visitor-management/1.png", title: "Dashboard" },
    { src: "/assets/visitor-management/2.png", title: "Edit Visitor" },
    { src: "/assets/visitor-management/3.png", title: "Events Journal" },
    { src: "/assets/visitor-management/4.png", title: "Create New Event" },
    { src: "/assets/visitor-management/5.png", title: "Visitor History" },
    { src: "/assets/visitor-management/6.png", title: "Create Visitor Page" },
  ];

  const features = [
    {
      icon: "🏭",
      title: t("multiFactorySupport"),
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: "📋",
      title: t("checkInHistory"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "🎉",
      title: t("eventManagement"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "👥",
      title: t("bulkCheckIn"),
      color: "from-green-500 to-teal-500",
    },
    {
      icon: "🌐",
      title: t("multiLanguage"),
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const techStack = [
    {
      icon: "🖥️",
      title: "Frontend",
      technologies: [
        { name: "Next.js", color: "from-gray-800 to-black" },
        { name: "React", color: "from-blue-400 to-blue-600" },
        { name: "Tailwind CSS", color: "from-cyan-400 to-cyan-600" },
        { name: "Radix UI", color: "from-purple-400 to-purple-600" },
      ],
    },
    {
      icon: "⚙️",
      title: "Backend",
      technologies: [
        { name: "Node.js", color: "from-green-500 to-green-700" },
        { name: "MongoDB", color: "from-green-600 to-green-800" },
      ],
    },
    {
      icon: "🔐",
      title: "Authentication",
      technologies: [
        { name: "JWT Auth", color: "from-orange-500 to-orange-700" },
      ],
    },
    {
      icon: "🌍",
      title: "Internationalization",
      technologies: [{ name: "i18n", color: "from-pink-500 to-pink-700" }],
    },
  ];
  const demoVideo = "https://www.youtube.com/embed/ZCo5RW1Rb5E";

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (openIdx !== null && el) {
      disableBodyScroll(el, { reserveScrollBarGap: true });
      return () => {
        enableBodyScroll(el);
      };
    }
  }, [openIdx]);

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks();
    };
  }, []);

  useEffect(() => {
    if (openIdx === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowLeft")
        setOpenIdx((i) => (i !== null && i > 0 ? i - 1 : i));
      if (e.key === "ArrowRight")
        setOpenIdx((i) =>
          i !== null && i < screenshots.length - 1 ? i + 1 : i
        );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIdx, screenshots.length]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) setOpenIdx(null);
    },
    []
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TrackProjectVisit
        projectId="visitor-management"
        projectName="Coca-Cola Visitor Management App"
      />
      <TestProjectTracking
        projectId="visitor-management"
        projectName="Coca-Cola Visitor Management App"
      />

      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-indigo-500 rounded-full opacity-20 float-animation"></div>
      <div
        className="absolute top-40 right-10 w-12 h-12 bg-blue-500 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300 group"
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-3xl font-bold glow">
                🥤
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-indigo-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  {t("VisitorManagementTitle")}
                </span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t("VisitorManagementDescription")}
              </p>
            </div>
          </div>

          {/* Demo Video */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
                🎥 {t("projectDemo")}
              </span>
            </h2>
            <div className="glass rounded-2xl p-4 max-w-4xl mx-auto">
              <iframe
                width="100%"
                height="400"
                src={demoVideo}
                title={t("demoVideo")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl border border-gray-700 shadow-lg"
              />
            </div>
          </div>

          {/* Screenshots */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                📸 {t("appScreenshots")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {screenshots.map((shot, idx) => (
                <div
                  key={idx}
                  className="glass p-4 rounded-xl cursor-zoom-in hover:scale-105 transition-all duration-300"
                  onClick={() => setOpenIdx(idx)}
                  tabIndex={0}
                  aria-label="Zoom screenshot"
                >
                  <Image
                    src={shot.src}
                    alt={shot.title}
                    width={320}
                    height={200}
                    className="rounded-lg w-full h-48 object-cover mb-3"
                    draggable={false}
                  />
                  <h3 className="text-center font-medium text-indigo-400">
                    {shot.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              <span className="gradient-text bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
                ✨ {t("keyFeatures")}
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

          {/* Tech Stack */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              <span className="gradient-text bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                🛠️ {t("techStack")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {techStack.map((section, index) => (
                <div key={index} className="glass p-6 rounded-xl">
                  <h3 className="font-semibold text-indigo-400 mb-4 flex items-center gap-2">
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

          {/* Live Demo Link */}
          <div className="modern-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">
              <span className="gradient-text bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
                🚀 {t("tryItOut")}
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25">
                <span className="flex items-center justify-center gap-2">
                  🚀 {t("tryItOut")}
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
              </button>
              <button className="px-8 py-4 border-2 border-indigo-500/50 hover:border-indigo-400 rounded-lg font-semibold text-indigo-400 hover:text-indigo-300 transition-all duration-300 hover:scale-105 hover:bg-indigo-500/10">
                🎥 {t("projectDemo")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Modal */}
      {openIdx !== null && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={handleOverlayClick}
          style={{ animation: "fadeIn 0.2s" }}
        >
          <div className="relative max-w-6xl max-h-[90vh] p-4">
            <Image
              src={screenshots[openIdx].src}
              alt={screenshots[openIdx].title}
              width={1200}
              height={800}
              className="max-w-full max-h-full rounded-xl border-4 border-white shadow-2xl"
              draggable={false}
            />
            <button
              onClick={() => setOpenIdx(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

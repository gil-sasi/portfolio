"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useState, useCallback, useEffect } from "react";

export default function VisitorManagementProject() {
  const { t } = useTranslation();

  const screenshots = [
    { src: "/assets/visitor-management/1.png" },
    { src: "/assets/visitor-management/2.png" },
    { src: "/assets/visitor-management/3.png" },
    { src: "/assets/visitor-management/4.png" },
    { src: "/assets/visitor-management/5.png" },
    { src: "/assets/visitor-management/6.png" },
  ];

  const demoVideo = "https://www.youtube.com/embed/pmGokTfo1bM";
  const liveAppLink = "https://coca-cola-visitor-site.vercel.app/";

  // Lightbox state
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Lock/unlock scroll when lightbox is open/closed
  useEffect(() => {
    if (openIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openIdx]);

  // ESC closes modal and arrow navigation
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

  // Lightbox overlay click handler
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only close if the overlay itself (not image) was clicked
      if (e.target === e.currentTarget) setOpenIdx(null);
    },
    []
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
      <Link
        href="/projects"
        className="text-blue-400 hover:underline mb-6 inline-block"
      >
        ← {t("backToProjects")}
      </Link>
      <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
        🥤 {t("visitorManagementTitle")}
      </h1>
      <p className="text-lg text-gray-300 mb-6">
        {t("visitorManagementDescription")}
      </p>

      {/* Demo Video */}
      <div className="mb-8">
        <iframe
          width="100%"
          height="380"
          src={demoVideo}
          title={t("demoVideo")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-2xl border border-gray-700 shadow"
        ></iframe>
      </div>

      {/* Screenshots Gallery */}
      <div className="flex flex-wrap gap-4 mb-8">
        {screenshots.map((shot, idx) => (
          <div
            key={idx}
            className="cursor-zoom-in"
            onClick={() => setOpenIdx(idx)}
            tabIndex={0}
            aria-label="Zoom screenshot"
          >
            <Image
              src={shot.src}
              alt=""
              width={320}
              height={200}
              className="rounded-xl border border-gray-700 shadow object-cover transition hover:scale-105"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {openIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={handleOverlayClick}
          style={{ animation: "fadeIn 0.2s" }}
        >
          <Image
            src={screenshots[openIdx].src}
            alt=""
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] rounded-xl border-4 border-white shadow-2xl"
            draggable={false}
          />
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">{t("keyFeatures")}</h2>
        <ul className="list-disc list-inside text-gray-200">
          <li>{t("multiFactorySupport")}</li>
          <li>{t("checkInHistory")}</li>
          <li>{t("eventManagement")}</li>
          <li>{t("bulkCheckIn")}</li>
          <li>{t("multiLanguage")}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">{t("techStack")}</h2>
        <p className="text-gray-200">
          Next.js, React, Tailwind CSS, MongoDB, Node.js, Radix UI, i18n, JWT
          Auth
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">{t("links")}</h2>
        <ul className="list-disc list-inside text-gray-200">
          <li>
            <a
              href={liveAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {t("liveDemo")}
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}

"use client";

import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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

  return (
    <main className="p-6 text-white max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-center">
        🧠 {mounted ? t("quizapp") : ""}
      </h1>

      <p className="text-lg text-gray-300 mb-8 text-center">
        {mounted ? t("quizappdesc") : ""}
      </p>

      {mounted && (
        <div className="relative mx-auto max-w-[360px] mb-10">
          <Swiper
            navigation
            modules={[Navigation]}
            className="quiz-swiper rounded-2xl overflow-hidden shadow-lg"
          >
            {images.map((src, index) => (
              <SwiperSlide
                key={index}
                className="flex items-center justify-center bg-black"
              >
                <Image
                  src={src}
                  alt={`Quiz App Screenshot ${index + 1}`}
                  width={300}
                  height={600}
                  className="object-contain rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-2">
            📱 {mounted ? t("features") : ""}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>{mounted ? t("featuretimer") : ""}</li>
            <li>{mounted ? t("featureadminpanel") : ""}</li>
            <li>{mounted ? t("featurescoreboard") : ""}</li>
            <li>{mounted ? t("featurejwt") : ""}</li>
            <li>{mounted ? t("featurereanimated") : ""}</li>
            <li>{mounted ? t("featureresponsive") : ""}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            🛠️ {mounted ? t("techstack") : ""}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>{mounted ? t("techreactnative") : ""}</li>
            <li>{mounted ? t("techbackend") : ""}</li>
            <li>{mounted ? t("techjwt") : ""}</li>
            <li>{mounted ? t("techreanimated") : ""}</li>
            <li>{mounted ? t("techvercel") : ""}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">🔗 GitHub Repositories</h2>
          <ul className="list-disc list-inside text-blue-400 space-y-1 underline">
            <li>
              <a
                href="https://github.com/deadly91/quiz-app-frontend"
                target="_blank"
                rel="noopener noreferrer"
              >
                Frontend Repository
              </a>
            </li>
            <li>
              <a
                href="https://github.com/deadly91/quiz-app-backend"
                target="_blank"
                rel="noopener noreferrer"
              >
                Backend Repository
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

"use client";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useState, useEffect } from "react";

export default function BarbershopProjectPage() {
  const { t } = useTranslation();
   const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

 

   const images = [
    "1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png"
  ].map((filename) => `/assets/barbershop/${filename}`);
 if (!isMounted) return null; // Prevent mismatch between server/client
  return (
    <main className="p-6 text-white max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-center">
        💈 {t("barbershopApp")}
      </h1>

      <p className="text-lg mb-6 text-center max-w-3xl mx-auto">
        {t("barbershopDescription")}
      </p>

      <ul className="list-disc pl-6 mb-10 text-base">
        <li>{t("barbershopFeature1")}</li>
        <li>{t("barbershopFeature2")}</li>
        <li>{t("barbershopFeature3")}</li>
        <li>{t("barbershopFeature4")}</li>
        <li>{t("barbershopFeature5")}</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4 text-center">📸 {t("screenshots")}</h2>

      <div className="bg-[#141622] rounded-3xl p-4 shadow-2xl border border-gray-700 max-w-3xl mx-auto">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={30}
          slidesPerView={1}
          className="rounded-xl overflow-hidden custom-swiper"
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={`Screenshot ${i + 1}`}
                className="w-full max-h-[480px] object-contain rounded-xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(6px);
          border-radius: 9999px;
          padding: 10px;
          transition: background-color 0.2s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .swiper-button-next:focus,
        .swiper-button-prev:focus {
          outline: none;
          box-shadow: none;
        }
      `}</style>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import AuthButtons from "./AuthButtons";
import LanguageSwitcher from "./LanguageSwitcher";
import { DecodedToken } from "../../redux/slices/authSlice";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: DecodedToken | null;
  onLoginPage: boolean;
  onSignupPage: boolean;
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  onLoginPage,
  onSignupPage,
}: MobileMenuProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Menu drawer */}
      <div className="absolute right-0 top-0 h-full w-5/6 max-w-xs bg-gradient-to-b from-gray-900 to-purple-950 shadow-xl flex flex-col z-10 animate-slideIn rounded-l-3xl">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="rounded-full hover:bg-gray-800 transition p-2 text-white text-2xl"
            aria-label={t("close")}
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 px-4">
          <Link
            href="/skills"
            onClick={onClose}
            className="block px-4 py-3 text-white hover:bg-gray-800 rounded-xl text-lg font-semibold transition"
          >
            {t("skills")}
          </Link>
          <Link
            href="/projects"
            onClick={onClose}
            className="block px-4 py-3 text-white hover:bg-gray-800 rounded-xl text-lg font-semibold transition"
          >
            {t("projects")}
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="block px-4 py-3 text-white hover:bg-gray-800 rounded-xl text-lg font-semibold transition"
          >
            {t("contact")}
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className="block px-4 py-3 text-white hover:bg-gray-800 rounded-xl text-lg font-semibold transition"
          >
            {t("about")}
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="block px-4 py-3 text-white hover:bg-gray-800 rounded-xl text-lg font-semibold transition"
            >
              {t("adminPanel")}
            </Link>
          )}
          <Link
            href="/"
            onClick={onClose}
            className="block px-4 py-3 text-white hover:bg-gray-800 rounded-xl text-lg font-semibold transition"
          >
            {t("home")}
          </Link>
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-700 my-4 mx-4" />

        {/* Bottom Auth and Language */}
        <div className="px-4 pb-6 mt-auto">
          <div className="mb-4">
            <AuthButtons
              user={user}
              onLoginPage={onLoginPage}
              onSignupPage={onSignupPage}
              isMobile={true}
              onClose={onClose}
            />
          </div>
          <LanguageSwitcher isMobile={true} onLanguageChange={onClose} />
        </div>
      </div>

      {/* Optional: CSS for slide in */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0%);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

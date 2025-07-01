"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
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

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-4 inset-y-20 z-[9999]">
      {/* Dark overlay with blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        {/* Top section with close button */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-white/90 text-xl font-medium">{t("menu")}</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white/90 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col justify-center items-center flex-1 py-8 space-y-6">
          <Link
            href="/"
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-2xl font-light tracking-wide"
          >
            {t("home")}
          </Link>
          <Link
            href="/skills"
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-2xl font-light tracking-wide"
          >
            {t("skills")}
          </Link>
          <Link
            href="/projects"
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-2xl font-light tracking-wide"
          >
            {t("projects")}
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-2xl font-light tracking-wide"
          >
            {t("contact")}
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-2xl font-light tracking-wide"
          >
            {t("about")}
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors text-2xl font-light tracking-wide"
            >
              {t("adminPanel")}
            </Link>
          )}
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 p-6 bg-black/20">
          <div className="flex flex-col items-center space-y-4">
            <AuthButtons
              user={user}
              onLoginPage={onLoginPage}
              onSignupPage={onSignupPage}
              isMobile={true}
              onClose={onClose}
            />
            <LanguageSwitcher isMobile={true} onLanguageChange={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

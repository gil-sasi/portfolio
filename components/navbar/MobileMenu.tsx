"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { DecodedToken } from "../../redux/slices/authSlice";
import AuthButtons from "./AuthButtons";
import LanguageSwitcher from "./LanguageSwitcher";

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 z-[60] md:hidden"
        onClick={onClose}
      />

      {/* Mobile Menu Items */}
      <div
        className="fixed inset-0 md:hidden bg-gray-900 z-[70] pt-20 overflow-y-auto"
        style={{ backgroundColor: "rgb(17, 24, 39)" }}
      >
        <div className="px-6 py-8 space-y-4 h-full">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-8 border-b border-gray-600/30 pb-4">
            <h2 className="text-2xl font-bold text-white">
              📱 {t("navigation", "Navigation")}
            </h2>
            <button
              onClick={onClose}
              className="p-4 rounded-full text-white bg-red-600/20 hover:bg-red-600/40 active:bg-red-600/60 transition-all duration-200 touch-manipulation text-xl"
            >
              ✕
            </button>
          </div>
          {/* Navigation Links */}
          <div className="space-y-3">
            <Link
              href="/skills"
              onClick={onClose}
              className="flex items-center py-5 px-6 rounded-2xl text-xl font-semibold text-white bg-blue-600/30 hover:bg-blue-600/50 active:bg-blue-600/70 transition-all duration-200 border border-blue-500/40 touch-manipulation"
            >
              <span className="text-2xl mr-4">🚀</span>
              {t("skills")}
            </Link>
            <Link
              href="/projects"
              onClick={onClose}
              className="flex items-center py-5 px-6 rounded-2xl text-xl font-semibold text-white bg-purple-600/30 hover:bg-purple-600/50 active:bg-purple-600/70 transition-all duration-200 border border-purple-500/40 touch-manipulation"
            >
              <span className="text-2xl mr-4">💼</span>
              {t("projects")}
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center py-5 px-6 rounded-2xl text-xl font-semibold text-white bg-green-600/30 hover:bg-green-600/50 active:bg-green-600/70 transition-all duration-200 border border-green-500/40 touch-manipulation"
            >
              <span className="text-2xl mr-4">📬</span>
              {t("contact")}
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="flex items-center py-5 px-6 rounded-2xl text-xl font-semibold text-white bg-pink-600/30 hover:bg-pink-600/50 active:bg-pink-600/70 transition-all duration-200 border border-pink-500/40 touch-manipulation"
            >
              <span className="text-2xl mr-4">👨‍💻</span>
              {t("about")}
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center py-5 px-6 rounded-2xl text-xl font-semibold text-white bg-red-600/30 hover:bg-red-600/50 active:bg-red-600/70 transition-all duration-200 border border-red-500/40 touch-manipulation"
              >
                <span className="text-2xl mr-4">⚙️</span>
                {t("adminPanel")}
              </Link>
            )}
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center py-5 px-6 rounded-2xl text-xl font-semibold text-white bg-cyan-600/30 hover:bg-cyan-600/50 active:bg-cyan-600/70 transition-all duration-200 border border-cyan-500/40 touch-manipulation"
            >
              <span className="text-2xl mr-4">🏠</span>
              {t("home")}
            </Link>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-600/30 my-6"></div>

          {/* Auth Buttons */}
          <div className="space-y-3">
            <AuthButtons
              user={user}
              onLoginPage={onLoginPage}
              onSignupPage={onSignupPage}
              isMobile={true}
              onClose={onClose}
            />
          </div>

          {/* Separator */}
          <div className="border-t border-gray-600/30 my-6"></div>

          {/* Language Switcher for Mobile */}
          <LanguageSwitcher isMobile={true} onLanguageChange={onClose} />

          {/* Bottom spacing for safe area */}
          <div className="h-8"></div>
        </div>
      </div>
    </>
  );
}

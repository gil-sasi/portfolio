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
        className="fixed inset-0 bg-black/70 mobile-menu-backdrop z-40 md:hidden"
        onClick={onClose}
      />

      {/* Mobile Menu Items */}
      <div className="fixed top-20 left-0 right-0 bottom-0 md:hidden bg-gray-900/98 backdrop-blur-xl border-t border-gray-600/50 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300 overflow-y-auto mobile-menu-safe">
        <div className="px-4 py-6 space-y-3 max-h-full">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              📱 {t("navigation", "Navigation")}
            </h2>
            <button
              onClick={onClose}
              className="p-3 rounded-xl text-white hover:bg-red-600/20 active:bg-red-600/30 transition-all duration-200 touch-manipulation"
            >
              ❌
            </button>
          </div>
          <Link
            href="/skills"
            onClick={onClose}
            className="block py-4 px-6 rounded-xl text-lg font-medium text-white hover:bg-blue-600/20 active:bg-blue-600/30 transition-all duration-200 border border-transparent hover:border-blue-500/30 touch-manipulation"
          >
            🚀 {t("skills")}
          </Link>
          <Link
            href="/projects"
            onClick={onClose}
            className="block py-4 px-6 rounded-xl text-lg font-medium text-white hover:bg-purple-600/20 active:bg-purple-600/30 transition-all duration-200 border border-transparent hover:border-purple-500/30 touch-manipulation"
          >
            💼 {t("projects")}
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="block py-4 px-6 rounded-xl text-lg font-medium text-white hover:bg-green-600/20 active:bg-green-600/30 transition-all duration-200 border border-transparent hover:border-green-500/30 touch-manipulation"
          >
            📬 {t("contact")}
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className="block py-4 px-6 rounded-xl text-lg font-medium text-white hover:bg-pink-600/20 active:bg-pink-600/30 transition-all duration-200 border border-transparent hover:border-pink-500/30 touch-manipulation"
          >
            👨‍💻 {t("about")}
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="block py-4 px-6 rounded-xl text-lg font-medium text-white hover:bg-red-600/20 active:bg-red-600/30 transition-all duration-200 border border-transparent hover:border-red-500/30 touch-manipulation"
            >
              ⚙️ {t("adminPanel")}
            </Link>
          )}
          <Link
            href="/"
            onClick={onClose}
            className="block py-4 px-6 rounded-xl text-lg font-medium text-white hover:bg-cyan-600/20 active:bg-cyan-600/30 transition-all duration-200 border border-transparent hover:border-cyan-500/30 touch-manipulation"
          >
            🏠 {t("home")}
          </Link>

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

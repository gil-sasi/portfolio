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
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[100]">
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Menu content */}
      <div className="fixed inset-y-0 right-0 w-[80vw] bg-gray-900 shadow-2xl z-[101] overflow-y-auto mobile-menu-safe">
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex justify-end p-4 sticky top-0 bg-gray-900 z-[102]">
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center px-4 py-6 space-y-4">
            <Link
              href="/skills"
              onClick={onClose}
              className="block text-white hover:bg-gray-800 rounded-lg text-xl py-3 px-4 mobile-nav-item"
            >
              {t("skills")}
            </Link>
            <Link
              href="/projects"
              onClick={onClose}
              className="block text-white hover:bg-gray-800 rounded-lg text-xl py-3 px-4 mobile-nav-item"
            >
              {t("projects")}
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="block text-white hover:bg-gray-800 rounded-lg text-xl py-3 px-4 mobile-nav-item"
            >
              {t("contact")}
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="block text-white hover:bg-gray-800 rounded-lg text-xl py-3 px-4 mobile-nav-item"
            >
              {t("about")}
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={onClose}
                className="block text-white hover:bg-gray-800 rounded-lg text-xl py-3 px-4 mobile-nav-item"
              >
                {t("adminPanel")}
              </Link>
            )}
            <Link
              href="/"
              onClick={onClose}
              className="block text-white hover:bg-gray-800 rounded-lg text-xl py-3 px-4 mobile-nav-item"
            >
              {t("home")}
            </Link>
          </div>

          {/* Bottom section */}
          <div className="p-4 space-y-4 bg-gray-900/50 border-t border-gray-800">
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

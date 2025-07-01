"use client";

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      {/* Mobile Menu Items */}
      <div className="absolute top-full left-0 right-0 md:hidden glass bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
          <Link
            href="/skills"
            onClick={onClose}
            className="block py-3 px-4 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-200 hover:text-white"
          >
            {t("skills")}
          </Link>
          <Link
            href="/projects"
            onClick={onClose}
            className="block py-3 px-4 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-200 hover:text-white"
          >
            {t("projects")}
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="block py-3 px-4 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-200 hover:text-white"
          >
            {t("contact")}
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className="block py-3 px-4 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-200 hover:text-white"
          >
            {t("about")}
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="block py-3 px-4 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-200 hover:text-white"
            >
              {t("adminPanel")}
            </Link>
          )}
          <Link
            href="/"
            onClick={onClose}
            className="block py-3 px-4 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-200 hover:text-white"
          >
            {t("home")}
          </Link>

          {/* Auth Buttons */}
          <AuthButtons
            user={user}
            onLoginPage={onLoginPage}
            onSignupPage={onSignupPage}
            isMobile={true}
            onClose={onClose}
          />

          {/* Language Switcher for Mobile */}
          <LanguageSwitcher isMobile={true} onLanguageChange={onClose} />
        </div>
      </div>
    </>
  );
}

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
    <div className="md:hidden">
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} />

      {/* Menu content */}
      <div className="fixed inset-y-0 right-0 w-full bg-gray-900 z-50 overflow-y-auto max-h-screen">
        <div className="p-4 pb-20">
          {/* Close button */}
          <div className="flex justify-end">
            <button onClick={onClose} className="p-2 text-white">
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mt-4 space-y-3">
            <Link
              href="/skills"
              onClick={onClose}
              className="block px-4 py-3 text-white hover:bg-gray-800 rounded-lg text-lg"
            >
              {t("skills")}
            </Link>
            <Link
              href="/projects"
              onClick={onClose}
              className="block px-4 py-3 text-white hover:bg-gray-800 rounded-lg text-lg"
            >
              {t("projects")}
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="block px-4 py-3 text-white hover:bg-gray-800 rounded-lg text-lg"
            >
              {t("contact")}
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="block px-4 py-3 text-white hover:bg-gray-800 rounded-lg text-lg"
            >
              {t("about")}
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={onClose}
                className="block px-4 py-3 text-white hover:bg-gray-800 rounded-lg text-lg"
              >
                {t("adminPanel")}
              </Link>
            )}
            <Link
              href="/"
              onClick={onClose}
              className="block px-4 py-3 text-white hover:bg-gray-800 rounded-lg text-lg"
            >
              {t("home")}
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="mt-6">
            <AuthButtons
              user={user}
              onLoginPage={onLoginPage}
              onSignupPage={onSignupPage}
              isMobile={true}
              onClose={onClose}
            />
          </div>

          {/* Language Switcher */}
          <div className="mt-6">
            <LanguageSwitcher isMobile={true} onLanguageChange={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

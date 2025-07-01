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
    <div className="md:hidden">
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} />

      {/* Menu content */}
      <div className="fixed inset-y-0 right-0 w-full bg-gray-900 z-50">
        <div className="flex flex-col min-h-screen">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button onClick={onClose} className="p-2 text-white">
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center px-4">
            <div className="space-y-6">
              <Link
                href="/skills"
                onClick={onClose}
                className="block text-white hover:bg-gray-800 rounded-lg text-2xl py-3 px-4"
              >
                {t("skills")}
              </Link>
              <Link
                href="/projects"
                onClick={onClose}
                className="block text-white hover:bg-gray-800 rounded-lg text-2xl py-3 px-4"
              >
                {t("projects")}
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="block text-white hover:bg-gray-800 rounded-lg text-2xl py-3 px-4"
              >
                {t("contact")}
              </Link>
              <Link
                href="/about"
                onClick={onClose}
                className="block text-white hover:bg-gray-800 rounded-lg text-2xl py-3 px-4"
              >
                {t("about")}
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="block text-white hover:bg-gray-800 rounded-lg text-2xl py-3 px-4"
                >
                  {t("adminPanel")}
                </Link>
              )}
              <Link
                href="/"
                onClick={onClose}
                className="block text-white hover:bg-gray-800 rounded-lg text-2xl py-3 px-4"
              >
                {t("home")}
              </Link>
            </div>
          </div>

          {/* Bottom section */}
          <div className="p-4 space-y-4">
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

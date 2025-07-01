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
    <div className="fixed inset-0 z-[9999]">
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="fixed inset-y-0 right-0 w-full h-screen bg-gray-900 flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-2xl text-white"
        >
          ✕
        </button>

        {/* Navigation Links */}
        <div className="flex flex-col justify-center items-center h-full space-y-8 -mt-20">
          <Link href="/" onClick={onClose} className="text-white text-2xl">
            {t("home")}
          </Link>
          <Link
            href="/skills"
            onClick={onClose}
            className="text-white text-2xl"
          >
            {t("skills")}
          </Link>
          <Link
            href="/projects"
            onClick={onClose}
            className="text-white text-2xl"
          >
            {t("projects")}
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="text-white text-2xl"
          >
            {t("contact")}
          </Link>
          <Link href="/about" onClick={onClose} className="text-white text-2xl">
            {t("about")}
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="text-white text-2xl"
            >
              {t("adminPanel")}
            </Link>
          )}
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center space-y-4">
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
  );
}

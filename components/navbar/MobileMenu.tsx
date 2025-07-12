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

  const navItems = [
    { href: "/", label: t("home"), icon: "🏠" },
    { href: "/skills", label: t("skills"), icon: "💻" },
    { href: "/projects", label: t("projects"), icon: "🚀" },
    { href: "/contact", label: t("contact"), icon: "📬" },
    { href: "/about", label: t("about"), icon: "👤" },
  ];

  if (user?.role === "admin") {
    navItems.push({ href: "/admin", label: t("adminPanel"), icon: "⚙️" });
  }

  return (
    <div className="fixed inset-x-4 inset-y-20 z-[9999] animate-fadeIn">
      {/* Dark overlay with blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10 animate-fadeIn"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="w-full h-full glass rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-slideInRight">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>

        {/* Floating background elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Top section with close button */}
        <div className="relative z-10 flex justify-between items-center p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
              🎯
            </div>
            <h2 className="text-white/90 text-xl font-semibold">{t("menu")}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white/70 hover:text-white/90 hover:rotate-90 transform"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <div className="relative z-10 flex flex-col justify-center items-center flex-1 py-8 space-y-4">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group w-full max-w-xs"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slideInUp">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-white/80 group-hover:text-white transition-colors text-lg font-medium">
                  {item.label}
                </span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-5 h-5 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom section */}
        <div className="relative z-10 border-t border-white/10 p-6 bg-black/20 backdrop-blur-sm">
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

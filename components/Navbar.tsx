"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logout, setUserFromToken } from "../redux/slices/authSlice";

import "../src/i18n/config";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [hasMounted, setHasMounted] = useState(false);
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    dispatch(setUserFromToken());

    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang).catch(console.error);
    }
  }, [dispatch, i18n]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng).catch(console.error);
    localStorage.setItem("i18nextLng", lng);
  };

  const onLoginPage = pathname === "/login";
  const onSignupPage = pathname === "/signup";

  if (!hasMounted) return null;

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold whitespace-nowrap">
          Gil Sasi
        </Link>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/projects">{t("projects")}</Link>
          <Link href="/contact">{t("contact")}</Link>
          <Link href="/about">{t("about")}</Link>
          {user?.role === "admin" && (
            <Link href="/admin">{t("adminPanel")}</Link>
          )}
          <Link href="/" className="hover:text-blue-400">
            {t("home")}
          </Link>

          {/* Auth */}
          {!user && !onLoginPage && (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
            >
              {t("login")}
            </Link>
          )}
          {!user && !onSignupPage && (
            <Link
              href="/signup"
              className="bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded"
            >
              {t("signup")}
            </Link>
          )}
          {user && (
            <>
              <Link
                href="/profile"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded text-sm"
              >
                {t("profile")}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm"
              >
                {t("logout")}
              </button>
            </>
          )}

          {/* Language flags */}
          <div className="flex gap-2 items-center ml-2">
            <button onClick={() => handleLanguageChange("en")} title="English">
              <Image
                src="/flags/us.png"
                alt="English"
                width={28}
                height={28}
                className="rounded-sm border border-white"
              />
            </button>
            <button onClick={() => handleLanguageChange("he")} title="עברית">
              <Image
                src="/flags/il.png"
                alt="Hebrew"
                width={28}
                height={28}
                className="rounded-sm border border-white"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-4 mt-4 text-sm">
          <Link href="/projects">{t("projects")}</Link>
          <Link href="/contact">{t("contact")}</Link>
          <Link href="/about">{t("about")}</Link>
          {user?.role === "admin" && (
            <Link href="/admin">{t("adminPanel")}</Link>
          )}
          <Link href="/">{t("home")}</Link>

          {!user && !onLoginPage && (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
            >
              {t("login")}
            </Link>
          )}
          {!user && !onSignupPage && (
            <Link
              href="/signup"
              className="bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded"
            >
              {t("signup")}
            </Link>
          )}
          {user && (
            <>
              <Link
                href="/profile"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded text-sm"
              >
                {t("profile")}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm"
              >
                {t("logout")}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

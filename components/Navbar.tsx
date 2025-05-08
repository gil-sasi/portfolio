"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import jwt from "jsonwebtoken";
import { useTranslation } from "react-i18next";
import "../src/i18n/config";

interface DecodedToken {
  firstName: string;
  lastName: string;
  role: string;
}

// ✅ Decode token immediately on first load (to prevent render mismatch)
const getInitialUser = (): DecodedToken | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwt.decode(token) as DecodedToken;
      if (decoded?.firstName && decoded?.lastName) {
        return decoded;
      }
    } catch {
      localStorage.removeItem("token");
    }
  }
  return null;
};

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setHasMounted(true); // 👈 prevents hydration mismatch

    // Restore preferred language
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang).catch(console.error);
    }
  }, [i18n]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng).catch(console.error);
    localStorage.setItem("i18nextLng", lng);
  };

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const onLoginPage = pathname === "/login";
  const onSignupPage = pathname === "/signup";

  const LanguageFlags = () => (
    <div className="ml-4 flex gap-2 items-center">
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
  );

  if (!hasMounted) return null;

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Gil Sasi
        </Link>

        <button onClick={toggleMenu} className="md:hidden text-2xl">
          ☰
        </button>

        <div className="hidden md:flex gap-4 items-center">
          <Link href="/">{t("home")}</Link>
          <Link href="/projects">{t("projects")}</Link>
          <Link href="/contact">{t("contact")}</Link>

          {user?.role === "admin" && (
            <Link href="/admin" className="text-yellow-400 font-semibold">
              {t("adminPanel")}
            </Link>
          )}

          {!user && !onLoginPage && (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded transition"
            >
              {t("login")}
            </Link>
          )}
          {!user && !onSignupPage && (
            <Link
              href="/signup"
              className="bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded transition"
            >
              {t("signup")}
            </Link>
          )}

          {user && (
            <>
              <span className="text-sm text-gray-300">
                {t("loggedInAs")}: {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition"
              >
                {t("logout")}
              </button>
            </>
          )}

          <LanguageFlags />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 bg-gray-700 p-4 rounded">
          <Link href="/" onClick={closeMenu}>
            {t("home")}
          </Link>
          <Link href="/projects" onClick={closeMenu}>
            {t("projects")}
          </Link>
          <Link href="/contact" onClick={closeMenu}>
            {t("contact")}
          </Link>

          {user?.role === "admin" && (
            <Link href="/admin" onClick={closeMenu} className="text-yellow-400">
              {t("adminPanel")}
            </Link>
          )}

          {!user && !onLoginPage && (
            <Link
              href="/login"
              onClick={closeMenu}
              className="bg-blue-600 px-4 py-1 rounded text-center"
            >
              {t("login")}
            </Link>
          )}
          {!user && !onSignupPage && (
            <Link
              href="/signup"
              onClick={closeMenu}
              className="bg-gray-600 px-4 py-1 rounded text-center"
            >
              {t("signup")}
            </Link>
          )}

          {user && (
            <>
              <span className="text-sm text-gray-300">
                {t("loggedInAs")}: {user.firstName} {user.lastName}
              </span>
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition"
              >
                {t("logout")}
              </button>
            </>
          )}

          <LanguageFlags />
        </div>
      )}
    </nav>
  );
}

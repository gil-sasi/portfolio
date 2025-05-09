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
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="text-xl font-bold whitespace-nowrap">
          Gil Sasi
        </Link>

        {/* Right */}
        <div className="flex-1 flex items-center justify-end gap-4 ml-4">
          {/* Language flags */}
          <div className="flex gap-2 items-center">
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

          {/* Logged in user */}
          {user && (
            <span className="text-sm text-gray-300 whitespace-nowrap">
              {t("loggedInAs")}: {user.firstName} {user.lastName}
            </span>
          )}

          {/* Navigation */}
          <div className="flex gap-4 items-center">
            <Link href="/projects">{t("projects")}</Link>
            <Link href="/contact">{t("contact")}</Link>
            <Link href="/about">{t("about")}</Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="text-yellow-400 font-semibold">
                {t("adminPanel")}
              </Link>
            )}
          </div>

          {/* Home right aligned */}
          <Link
            href="/"
            className="text-white hover:text-blue-400 transition whitespace-nowrap"
          >
            {t("home")}
          </Link>

          {/* Auth buttons */}
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
              <Link
                href="/profile"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded text-sm whitespace-nowrap"
              >
                {t("profile")}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm whitespace-nowrap"
              >
                {t("logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

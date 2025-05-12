"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logout, setUserFromToken } from "../redux/slices/authSlice";
import "../src/i18n/config";

type Message = {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  message: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { t, i18n } = useTranslation();

  // State
  const [hasMounted, setHasMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Detect current page (used for hiding buttons)
  const onLoginPage = pathname === "/login";
  const onSignupPage = pathname === "/signup";

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/messages/unread-count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  }, []);

  // Fetch recent messages
  const fetchRecentMessages = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/messages/recent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecentMessages(data);
    } catch (err) {
      console.error("Failed to fetch recent messages", err);
    }
  }, []);

  // Handle token/user setup and language
  useEffect(() => {
    setHasMounted(true);
    dispatch(setUserFromToken());
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang).catch(console.error);
    }
  }, [dispatch, i18n]);

  // Fetch data when admin is logged in
  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetchUnreadCount();
    fetchRecentMessages();
  }, [user, fetchUnreadCount, fetchRecentMessages]);

  // Listen for broadcasted unread count updates
  useEffect(() => {
    const handler = (e: CustomEvent<number>) => setUnreadCount(e.detail);
    const listener = (e: Event) => {
      if (e instanceof CustomEvent) handler(e);
    };
    window.addEventListener("unreadCountUpdate", listener);
    return () => window.removeEventListener("unreadCountUpdate", listener);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  // Language toggle
  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng).catch(console.error);
    localStorage.setItem("i18nextLng", lng);
  };

  if (!hasMounted) return null;

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold whitespace-nowrap">
          Gil Sasi
        </Link>

        {/* Admin Notification Bell */}
        {user?.role === "admin" && (
          <div className="relative">
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                fetchUnreadCount();
                fetchRecentMessages();
              }}
              className="relative"
            >
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M12 2C10.343 2 9 3.343 9 5v1.268C6.718 7.047 5 9.364 5 12v4l-2 2v1h18v-1l-2-2v-4c0-2.636-1.718-4.953-4-5.732V5c0-1.657-1.343-3-3-3zM12 22c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-80 text-white bg-gray-900/90 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-xl z-50 p-4"
              >
                <p className="font-semibold mb-2 text-sm border-b border-white/10 pb-1">
                  {t("newmessages")}
                </p>
                {recentMessages.length === 0 ? (
                  <p className="text-sm text-gray-400">{t("nonewmessages")}</p>
                ) : (
                  recentMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className="border-b border-white/10 pb-2 mb-2"
                    >
                      <p className="text-sm font-semibold">
                        {msg.name || "Guest"} &lt;{msg.email}&gt;
                      </p>
                      <p className="text-xs text-gray-300 italic truncate max-w-[220px]">
                        {msg.message}
                      </p>
                      <p className="text-[10px] text-right text-gray-400">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
                <Link
                  href="/admin/messages"
                  className="block text-blue-400 text-sm text-right mt-2 hover:underline"
                >
                  {t("viewallmessages")}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
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

          {/* Language Switcher */}
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
        </div>
      </div>

      {/* Mobile Menu Items */}
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

          {/* Language Flags (Mobile) */}
          <div className="flex gap-2 items-center mt-2">
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
      )}
    </nav>
  );
}

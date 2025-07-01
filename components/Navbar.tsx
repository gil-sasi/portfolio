"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setUserFromToken } from "../redux/slices/authSlice";

// Import our extracted components
import Logo from "./navbar/Logo";
import NotificationDropdown from "./navbar/NotificationDropdown";
import MobileMenu from "./navbar/MobileMenu";
import DesktopNav from "./navbar/DesktopNav";
import AuthButtons from "./navbar/AuthButtons";
import LanguageSwitcher from "./navbar/LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  // State
  const [hasMounted, setHasMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect current page (used for hiding buttons)
  const onLoginPage = pathname === "/login";
  const onSignupPage = pathname === "/signup";

  // Handle token/user setup
  useEffect(() => {
    setHasMounted(true);
    dispatch(setUserFromToken());
  }, [dispatch]);

  if (!hasMounted) return null;

  return (
    <nav className="glass backdrop-blur-lg bg-gray-900/50 text-white shadow-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[80px] px-4">
        {/* Logo */}
        <Logo />

        {/* Admin Notification Bell */}
        <NotificationDropdown user={user} />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none p-2 rounded-lg hover:bg-gray-700/50 transition-colors z-[51]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${
              menuOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <DesktopNav user={user} />

          <AuthButtons
            user={user}
            onLoginPage={onLoginPage}
            onSignupPage={onSignupPage}
          />

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLoginPage={onLoginPage}
        onSignupPage={onSignupPage}
      />
    </nav>
  );
}

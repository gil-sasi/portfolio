"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setUserFromToken } from "../redux/slices/authSlice";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  // State
  const [hasMounted, setHasMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect current page (used for hiding buttons)
  const onLoginPage = pathname === "/login";
  const onSignupPage = pathname === "/signup";

  // Get current page title
  const getPageTitle = () => {
    switch (pathname) {
      case "/about":
        return t("about");
      case "/skills":
        return t("skills");
      case "/projects":
        return t("projects");
      case "/contact":
        return t("contact");
      case "/admin":
        return t("adminPanel");
      default:
        return t("home");
    }
  };

  // Handle token/user setup
  useEffect(() => {
    setHasMounted(true);
    dispatch(setUserFromToken());
  }, [dispatch]);

  if (!hasMounted) return null;

  return (
    <>
      <nav className="glass backdrop-blur-lg bg-gray-900/50 text-white shadow-xl border-b border-white/10 sticky top-0 z-[200]">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[80px] px-4">
          {/* Logo on desktop */}
          <div className="hidden md:block">
            <Logo />
          </div>

          {/* Page Title on Mobile */}
          <h1 className="md:hidden text-xl font-semibold">{getPageTitle()}</h1>

          {/* Admin Notification Bell */}
          <NotificationDropdown user={user} />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none p-2 text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
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
      </nav>

      {/* Mobile Menu - Moved outside nav */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLoginPage={onLoginPage}
        onSignupPage={onSignupPage}
      />
    </>
  );
}

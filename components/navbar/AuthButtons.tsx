"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { logout, DecodedToken } from "../../redux/slices/authSlice";

interface AuthButtonsProps {
  user: DecodedToken | null;
  onLoginPage: boolean;
  onSignupPage: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function AuthButtons({
  user,
  onLoginPage,
  onSignupPage,
  isMobile = false,
  onClose,
}: AuthButtonsProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  const handleClick = () => {
    onClose?.();
  };

  if (isMobile) {
    return (
      <div className="space-y-4 w-full">
        {!user && !onLoginPage && (
          <Link
            href="/login"
            onClick={handleClick}
            className="block w-full px-6 py-5 text-center text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
          >
            {t("login")}
          </Link>
        )}
        {!user && !onSignupPage && (
          <Link
            href="/signup"
            onClick={handleClick}
            className="block w-full px-6 py-5 text-center text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-lg"
          >
            {t("signup")}
          </Link>
        )}
        {user && (
          <>
            <Link
              href="/profile"
              onClick={handleClick}
              className="block w-full px-6 py-5 text-center text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-xl font-semibold transition-all duration-300 text-lg"
            >
              {t("profile")}
            </Link>
            <button
              onClick={() => {
                handleLogout();
                handleClick();
              }}
              className="block w-full px-6 py-5 text-center text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
            >
              {t("logout")}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {!user && !onLoginPage && (
        <Link href="/login" className="btn-primary px-4 py-2 text-sm">
          {t("login")}
        </Link>
      )}
      {!user && !onSignupPage && (
        <Link href="/signup" className="btn-secondary px-4 py-2 text-sm">
          {t("signup")}
        </Link>
      )}
      {user && (
        <>
          <Link href="/profile" className="btn-secondary px-4 py-2 text-sm">
            {t("profile")}
          </Link>
          <button
            onClick={handleLogout}
            className="btn-danger px-4 py-2 text-sm"
          >
            {t("logout")}
          </button>
        </>
      )}
    </>
  );
}

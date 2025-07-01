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
      <div className="space-y-3">
        {!user && !onLoginPage && (
          <Link
            href="/login"
            onClick={handleClick}
            className="block py-4 px-6 rounded-xl text-lg font-medium text-center text-white bg-blue-600/30 hover:bg-blue-600/40 active:bg-blue-600/50 transition-all duration-200 border border-blue-500/40 hover:border-blue-400/60 touch-manipulation w-full"
          >
            🔐 {t("login")}
          </Link>
        )}
        {!user && !onSignupPage && (
          <Link
            href="/signup"
            onClick={handleClick}
            className="block py-4 px-6 rounded-xl text-lg font-medium text-center text-white bg-purple-600/30 hover:bg-purple-600/40 active:bg-purple-600/50 transition-all duration-200 border border-purple-500/40 hover:border-purple-400/60 touch-manipulation w-full"
          >
            👤 {t("signup")}
          </Link>
        )}
        {user && (
          <>
            <Link
              href="/profile"
              onClick={handleClick}
              className="block py-4 px-6 rounded-xl text-lg font-medium text-center text-white bg-green-600/30 hover:bg-green-600/40 active:bg-green-600/50 transition-all duration-200 border border-green-500/40 hover:border-green-400/60 touch-manipulation w-full"
            >
              👨‍💼 {t("profile")}
            </Link>
            <button
              onClick={() => {
                handleLogout();
                handleClick();
              }}
              className="block py-4 px-6 rounded-xl text-lg font-medium text-center text-white bg-red-600/30 hover:bg-red-600/40 active:bg-red-600/50 transition-all duration-200 border border-red-500/40 hover:border-red-400/60 touch-manipulation w-full"
            >
              🚪 {t("logout")}
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

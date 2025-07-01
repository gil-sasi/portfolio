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
      <div className="space-y-2">
        {!user && !onLoginPage && (
          <Link
            href="/login"
            onClick={handleClick}
            className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
          >
            {t("login")}
          </Link>
        )}
        {!user && !onSignupPage && (
          <Link
            href="/signup"
            onClick={handleClick}
            className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
          >
            {t("signup")}
          </Link>
        )}
        {user && (
          <>
            <Link
              href="/profile"
              onClick={handleClick}
              className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
            >
              {t("profile")}
            </Link>
            <button
              onClick={() => {
                handleLogout();
                handleClick();
              }}
              className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
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

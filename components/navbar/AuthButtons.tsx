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
      <div className="pt-4 border-t border-gray-700/50 space-y-3">
        {!user && !onLoginPage && (
          <Link
            href="/login"
            onClick={handleClick}
            className="btn-primary px-4 py-3 text-sm w-full text-center block rounded-lg"
          >
            {t("login")}
          </Link>
        )}
        {!user && !onSignupPage && (
          <Link
            href="/signup"
            onClick={handleClick}
            className="btn-secondary px-4 py-3 text-sm w-full text-center block rounded-lg"
          >
            {t("signup")}
          </Link>
        )}
        {user && (
          <>
            <Link
              href="/profile"
              onClick={handleClick}
              className="btn-secondary px-4 py-3 text-sm w-full text-center block rounded-lg"
            >
              {t("profile")}
            </Link>
            <button
              onClick={() => {
                handleLogout();
                handleClick();
              }}
              className="btn-danger px-4 py-3 text-sm w-full rounded-lg"
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

"use client";

import { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setUserFromToken } from "../redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import ErrorBoundary from "./ErrorBoundary";

function AuthGate() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("🚀 Running setUserFromToken in AuthGate");

    // Wrap in try-catch to handle any potential errors
    try {
      dispatch(setUserFromToken());
    } catch (error) {
      console.warn("Error in setUserFromToken:", error);
    }

    // Warm up API route with proper error handling
    fetch("/api/skills")
      .then(() => {
        console.log("🧊 Warmed up /api/skills route");
      })
      .catch((error) => {
        console.log("🧊 Warming up /api/skills route failed:", error);
      });
  }, [dispatch]);

  return null;
}

function LanguageDirectionHandler({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isRTL = i18n.language === "he";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, mounted]);

  if (!mounted) return null;

  const isRTL = i18n.language === "he";

  return (
    <div
      className={`min-h-screen mobile-container bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <Navbar />
      <div className="px-4 py-10">{children}</div>
    </div>
  );
}

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthGate />
        <LanguageDirectionHandler>{children}</LanguageDirectionHandler>
      </Provider>
    </ErrorBoundary>
  );
}

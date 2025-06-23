"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import jwt from "jsonwebtoken";
import { login } from "../../redux/slices/authSlice";
import "../../src/i18n/config";

interface DecodedToken {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  useEffect(() => {
    const lang = localStorage.getItem("i18nextLng") || "en";
    i18n.changeLanguage(lang).finally(() => setMounted(true));
  }, [i18n]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": i18n.language,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setMessage(t("Your account is banned", "החשבון שלך נחסם"));
        } else if (res.status === 401) {
          setMessage(t("Invalid email or password", "אימייל או סיסמה שגויים"));
        } else {
          setMessage(data.message || t("loginFailed"));
        }
        return;
      }

      const token = data.token;
      localStorage.setItem("token", token);

      const decoded = jwt.decode(token) as DecodedToken;
      dispatch(login(decoded));

      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setMessage(t("somethingWentWrong") || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-10"></div>
      <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-2xl font-bold glow">
              🔐
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t("login")}
              </span>
            </h1>
            <p className="text-gray-400">{t("welcomeBack")}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="modern-card p-8 space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                {t("email")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder={t("email")}
                  className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📧
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder={t("password")}
                  className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔒
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t("signingIn")}
                </div>
              ) : (
                t("login")
              )}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
              >
                {t("forgotPassword")}
              </button>
            </div>

            {/* Error Message */}
            {message && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                {message}
              </div>
            )}
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              {t("dontHaveAccount")}{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
              >
                {t("signUpHere")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

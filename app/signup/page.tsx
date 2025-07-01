"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { useRouter } from "next/navigation";

interface DecodedToken {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError(t("passwordMismatch", "Passwords do not match"));
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwt.decode(token) as DecodedToken;
      if (decoded?.firstName && decoded?.lastName) {
        dispatch(login(decoded));
      }

      alert(t("accountCreated", "Account created successfully"));
      router.push("/");
    } catch (err) {
      console.error("Signup error:", err);
      setError(t("signupFailed", "Signup failed"));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-10"></div>
      <div className="absolute top-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center text-2xl font-bold glow">
              👤
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {t("signUp")}
              </span>
            </h1>
            <p className="text-gray-400">{t("createAccount")}</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="modern-card p-8 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {t("fullName")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("fullName")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {t("lastName")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("lastName")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                {t("email")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📧
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {t("password")}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔒
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {t("confirmPassword")}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder={t("confirmPassword")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔐
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t("creatingAccount")}
                </div>
              ) : (
                t("signUp")
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                {error}
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              {t("alreadyHaveAccount")}{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
              >
                {t("signInHere")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

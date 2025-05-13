"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import "../../src/i18n/config";
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
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const lang = localStorage.getItem("i18nextLng") || "en";
    i18n.changeLanguage(lang).finally(() => setMounted(true));
  }, [i18n]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage(t("passwordMismatch", "Passwords do not match"));
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
      setMessage(t("signupFailed", "Signup failed"));
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSignup}
        className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">{t("signUp")}</h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder={t("fullName")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-1/2 p-3 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder={t("lastName")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-1/2 p-3 rounded bg-gray-700 text-white"
          />
        </div>

        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder={t("confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {t("signUp")}
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-blue-400 hover:text-blue-600"
          >
            {t("forgotPassword")}
          </button>
        </div>

        {message && (
          <p className="text-center text-sm mt-2 text-red-400">{message}</p>
        )}
      </form>
    </div>
  );
}

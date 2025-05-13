"use client";

import { useState } from "react";
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

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert(t("passwordMismatch"));
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

      alert(t("accountCreated"));
      router.push("/");
    } catch (err) {
      alert(t("signupFailed"));
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">{t("signUp")}</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={t("fullName")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-1/2 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              placeholder={t("lastName")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-1/2 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <input
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="password"
            placeholder={t("confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold py-3 rounded-xl"
          >
            {t("signUp")}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-blue-400 hover:text-blue-500 transition-colors duration-200 underline"
          >
            {t("forgotPassword")}
          </button>
        </div>
      </div>
    </div>
  );
}

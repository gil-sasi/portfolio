"use client";

import { useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import "../../src/i18n/config";

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
      window.location.href = "/";
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response === "object"
      ) {
        alert((err as any).response?.data?.message || t("signupFailed"));
      } else {
        alert(t("signupFailed"));
      }
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{t("signUp")}</h1>
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="text"
          placeholder={t("fullName")}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="p-2 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="text"
          placeholder={t("lastName")}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="p-2 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="password"
          placeholder={t("confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="p-2 rounded bg-gray-800 border border-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {t("signUp")}
        </button>
      </form>
    </div>
  );
}

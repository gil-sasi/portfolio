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

  useEffect(() => {
    const lang = localStorage.getItem("i18nextLng") || "en";
    i18n.changeLanguage(lang).finally(() => setMounted(true));
  }, [i18n]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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
        setMessage(data.message || t("loginFailed"));
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
    }
  };

  //  Prevent hydration error by delaying render
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">{t("login")}</h2>
        <input
          type="email"
          placeholder={t("email")}
          className="w-full p-3 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("password")}
          className="w-full p-3 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {t("login")}
        </button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}

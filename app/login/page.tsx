"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "../../src/i18n/config";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || t("loginFailed"));
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.user.email);
      localStorage.setItem("role", data.user.role);

      setMessage("✅ " + t("login"));
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setMessage(t("somethingWentWrong") || "Something went wrong");
    }
  };

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

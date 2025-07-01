"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const { t, i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch", "Passwords do not match"));
      setStatus("");
      return;
    }

    if (newPassword.length < 6) {
      setError(t("passwordTooShort", "Password must be at least 6 characters"));
      setStatus("");
      return;
    }

    try {
      const response = await axios.post("/api/auth/reset-password", {
        resetCode: resetCode.trim().toLowerCase(),
        newPassword,
      });

      const message = response.data?.message || t("passwordResetSuccess");
      setStatus(message);
      setError("");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      console.error("Reset error:", err);

      if (axios.isAxiosError(err)) {
        const serverMessage = (err.response?.data as { message?: string })
          ?.message;
        setError(
          serverMessage ||
            t("passwordResetError", "Something went wrong. Please try again.")
        );
      } else {
        setError(
          t("passwordResetError", "Something went wrong. Please try again.")
        );
      }

      setStatus("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6">
          {t("resetpassword")}
        </h2>

        {status && (
          <p className="text-center text-green-400 text-sm mb-4">{status}</p>
        )}
        {error && (
          <p className="text-center text-red-400 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t("enterresetcode", "Enter your reset code")}
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder={t("newpassword", "New Password")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder={t("confirmnewpassword", "Confirm New Password")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold py-3 rounded-xl"
          >
            {t("resetpassword")}
          </button>
        </form>
      </div>
    </div>
  );
}

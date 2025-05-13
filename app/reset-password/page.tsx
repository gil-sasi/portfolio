"use client";

import { useState, useTransition } from "react";

import axios from "axios";
import "../../src/i18n/config";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/api/auth/reset-password", {
        resetCode,
        newPassword,
      });
      setStatus("Password reset successful");
    } catch (error) {
      setError("Error resetting password");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-2xl mb-4 text-center">{t("resetpassword")}</h2>
      {status && <p className="text-green-400">{status}</p>}
      {error && <p className="text-red-400">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter reset code"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          {t("resetpassword")}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../src/i18n/config";

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/change-password",
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(t("passwordChanged"));
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
    } catch (err) {
      toast.error(t("errorChangingPassword"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
        {t("notAuthorized")}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <ToastContainer position="top-center" autoClose={2500} />
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">{t("profile")}</h1>

        <div className="space-y-3 text-base mb-6 leading-relaxed">
          <p>
            <strong>{t("firstName")}:</strong> {user.firstName}
          </p>
          <p>
            <strong>{t("lastName")}:</strong> {user.lastName}
          </p>
          <p>
            <strong>{t("email")}:</strong> {user.email}
          </p>
          <p>
            <strong>{t("role")}:</strong> {user.role}
          </p>
        </div>

        {!showPasswordFields ? (
          <button
            onClick={() => setShowPasswordFields(true)}
            className="w-full text-sm border border-gray-500 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            {t("changePassword")}
          </button>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">
              {t("changePassword")}
            </h2>

            <input
              type="password"
              placeholder={t("newPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 mb-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder={t("confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-3">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("updating")}...
                  </div>
                ) : (
                  t("updatePassword")
                )}
              </button>
              <button
                onClick={() => {
                  setShowPasswordFields(false);
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="flex-1 border border-gray-500 text-sm text-gray-300 rounded px-4 py-2 hover:bg-gray-700 transition"
              >
                {t("cancel")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

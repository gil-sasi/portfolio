"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { updateProfilePicture } from "../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../src/i18n/config";

export default function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.error("Error changing password:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setUploadingPicture(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        const token = localStorage.getItem("token");
        const response = await axios.post(
          "/api/profile-picture",
          { profilePicture: base64String },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch(updateProfilePicture(base64String));
        toast.success(t("profilePictureUpdated"));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error(t("profilePictureError"));
      console.error("Error uploading profile picture:", err);
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      setUploadingPicture(true);
      const token = localStorage.getItem("token");
      await axios.delete("/api/profile-picture", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(updateProfilePicture(null));
      toast.success(t("profilePictureRemoved"));
    } catch (err) {
      toast.error(t("profilePictureError"));
      console.error("Error removing profile picture:", err);
    } finally {
      setUploadingPicture(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 animated-bg opacity-5"></div>

        <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
          <div className="modern-card p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-2xl font-bold">
              🚫
            </div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">
              {t("notAuthorized")}
            </h1>
            <p className="text-gray-400">Please log in to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ToastContainer position="top-center" autoClose={2500} />

      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 float-animation"></div>
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-32 left-20 w-12 h-12 bg-pink-500 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative z-10 px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="glass rounded-2xl p-8">
              <div className="relative inline-block mb-4">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-br from-blue-400 to-purple-600 glow"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-3xl font-bold glow">
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {t("profile")}
                </span>
              </h1>
              <p className="text-gray-300">{t("manageAccountSettings")}</p>
            </div>
          </div>

          {/* Profile Picture Management */}
          <div className="modern-card p-8">
            <h2 className="text-xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                {t("profilePicture")}
              </span>
            </h2>

            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-dashed border-gray-600 flex items-center justify-center relative overflow-hidden">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="text-3xl mb-2">📸</div>
                    <p className="text-sm">{t("selectImage")}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">{t("dragDropImage")}</p>
                <p className="text-xs text-gray-500">{t("imageSize")}</p>
                <p className="text-xs text-gray-500">{t("supportedFormats")}</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPicture}
                  className="btn-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {uploadingPicture ? (
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t("updating")}...
                    </div>
                  ) : user.profilePicture ? (
                    t("changeProfilePicture")
                  ) : (
                    t("uploadProfilePicture")
                  )}
                </button>

                {user.profilePicture && (
                  <button
                    onClick={handleRemoveProfilePicture}
                    disabled={uploadingPicture}
                    className="btn-secondary px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                  >
                    {t("removeProfilePicture")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="modern-card p-8">
            <h2 className="text-xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {t("accountInformation")}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  {t("firstName")}
                </label>
                <div className="glass p-4 rounded-xl">
                  <p className="text-white font-semibold">{user.firstName}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  {t("lastName")}
                </label>
                <div className="glass p-4 rounded-xl">
                  <p className="text-white font-semibold">{user.lastName}</p>
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  {t("email")}
                </label>
                <div className="glass p-4 rounded-xl">
                  <p className="text-white font-semibold break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  {t("role")}
                </label>
                <div className="glass p-4 rounded-xl flex items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        user.role === "admin"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500"
                      }`}
                    >
                      {user.role === "admin" ? "👑" : "👤"}
                    </div>
                    <div>
                      <span
                        className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                          user.role === "admin"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        }`}
                      >
                        {t(user.role)}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {user.role === "admin"
                          ? t("fullSystemAccess")
                          : t("standardUserAccess")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Management */}
          <div className="modern-card p-8">
            <h2 className="text-xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {t("securitySettings")}
              </span>
            </h2>

            {!showPasswordFields ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center text-2xl">
                  🔒
                </div>
                <p className="text-gray-300 mb-6">{t("keepAccountSecure")}</p>
                <button
                  onClick={() => setShowPasswordFields(true)}
                  className="btn-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 glow-hover"
                >
                  {t("changePassword")}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      {t("newPassword")}
                    </label>
                    <input
                      type="password"
                      placeholder={t("newPassword")}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      {t("confirmPassword")}
                    </label>
                    <input
                      type="password"
                      placeholder={t("confirmPassword")}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="flex-1 btn-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                    className="flex-1 btn-secondary px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

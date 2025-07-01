"use client";

import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getValidToken } from "../../utils/auth";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture?: string | null;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      const token = getValidToken(); // This automatically removes expired tokens
      if (!token) {
        setInitialLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setEditedFirstName(response.data.firstName);
        setEditedLastName(response.data.lastName);
      } catch (error) {
        console.error("Error loading user data:", error);
        localStorage.removeItem("token");
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    if (!editedFirstName.trim() || !editedLastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    if (editedFirstName.length < 2 || editedLastName.length < 2) {
      toast.error("Names must be at least 2 characters long");
      return;
    }

    try {
      setSavingProfile(true);
      const token = getValidToken();
      const response = await axios.put(
        "/api/update-profile",
        {
          firstName: editedFirstName.trim(),
          lastName: editedLastName.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data.user);
      setEditMode(false);
      toast.success(t("profileUpdated"));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t("profileUpdateError"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedFirstName(user?.firstName || "");
    setEditedLastName(user?.lastName || "");
    setEditMode(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    try {
      setLoading(true);
      const token = getValidToken();
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

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setUploadingPicture(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        const token = getValidToken();
        if (!token) {
          toast.error("No authentication token found. Please login again.");
          return;
        }

        try {
          await axios.post(
            "/api/profile-picture",
            { profilePicture: base64String },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          setUser((prev) =>
            prev ? { ...prev, profilePicture: base64String } : null
          );
          toast.success(t("profilePictureUpdated"));
        } catch (apiError) {
          console.error("API Error:", apiError);
          toast.error(t("profilePictureError"));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("File reading error:", err);
      toast.error(t("profilePictureError"));
    } finally {
      setUploadingPicture(false);
    }
  };

  const removeProfilePicture = async () => {
    if (!user) return;

    try {
      const token = getValidToken();
      await axios.delete("/api/profile-picture", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prev) => (prev ? { ...prev, profilePicture: null } : null));
      toast.success(t("profilePictureRemoved"));
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast.error(t("profilePictureRemoveError"));
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 animated-bg opacity-5"></div>
        <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
          <div className="modern-card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden">
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
                  <Image
                    src={user.profilePicture}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-2xl font-bold text-white border-2 border-white/20">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {t("profile")}
                </span>
              </h1>
              <p className="text-gray-300 text-lg">
                {t("welcome")}, {user.firstName} {user.lastName}!
              </p>
            </div>
          </div>

          {/* User Information */}
          <div className="modern-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                <span className="gradient-text bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {t("accountInfo")}
                </span>
              </h2>
              <button
                onClick={() =>
                  editMode ? handleCancelEdit() : setEditMode(true)
                }
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
              >
                {editMode ? t("cancel") : t("editProfile")}
              </button>
            </div>

            <div className="space-y-4">
              {/* First Name */}
              <div className="flex justify-between items-center p-4 glass rounded-lg">
                <span className="text-gray-400">{t("firstName")}:</span>
                {editMode ? (
                  <input
                    type="text"
                    value={editedFirstName}
                    onChange={(e) => setEditedFirstName(e.target.value)}
                    className="bg-gray-800/50 border border-gray-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("firstName")}
                  />
                ) : (
                  <span className="text-white font-medium">
                    {user.firstName}
                  </span>
                )}
              </div>

              {/* Last Name */}
              <div className="flex justify-between items-center p-4 glass rounded-lg">
                <span className="text-gray-400">{t("lastName")}:</span>
                {editMode ? (
                  <input
                    type="text"
                    value={editedLastName}
                    onChange={(e) => setEditedLastName(e.target.value)}
                    className="bg-gray-800/50 border border-gray-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("lastName")}
                  />
                ) : (
                  <span className="text-white font-medium">
                    {user.lastName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex justify-between items-center p-4 glass rounded-lg">
                <span className="text-gray-400">{t("email")}:</span>
                <span className="text-white font-medium">{user.email}</span>
              </div>

              {/* Role with Special Indicator */}
              <div className="flex justify-between items-center p-4 glass rounded-lg">
                <span className="text-gray-400">{t("role")}:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium capitalize">
                    {user.role}
                  </span>
                  {user.role === "admin" && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-lg">👑</span>
                      <span className="text-xs text-yellow-400 font-medium">
                        ADMIN
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button for Edit Mode */}
              {editMode && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingProfile ? t("updating") : t("saveChanges")}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="modern-card p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {t("profilePicture")}
              </span>
            </h2>
            <div className="text-center space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPicture}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingPicture
                    ? t("uploading")
                    : user.profilePicture
                    ? t("changeProfilePicture")
                    : t("uploadProfilePicture")}
                </button>
                {user.profilePicture && (
                  <button
                    onClick={removeProfilePicture}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-105"
                  >
                    {t("removeProfilePicture")}
                  </button>
                )}
              </div>
              <p className="text-gray-400 text-sm">{t("profilePictureHint")}</p>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="modern-card p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {t("security")}
              </span>
            </h2>
            {!showPasswordFields ? (
              <div className="text-center">
                <button
                  onClick={() => setShowPasswordFields(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-300 hover:scale-105"
                >
                  {t("changePassword")}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    {t("newPassword")}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("enterNewPassword")}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">
                    {t("confirmPassword")}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("confirmNewPassword")}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={loading || !newPassword || !confirmPassword}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t("updating") : t("updatePassword")}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordFields(false);
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover:scale-105"
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

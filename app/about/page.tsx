"use client";
import Image from "next/image";
import Spinner from "../../components/Spinner";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface AdminProfile {
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
}

export default function AboutPage() {
  const [aboutText, setAboutText] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchAbout = async () => {
    try {
      const res = await axios.get("/api/about");
      setAboutText(res.data.content || "");
    } catch (err) {
      console.error("Failed to fetch about text", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
    // Load admin profile data
    const loadAdminProfile = async () => {
      try {
        const response = await axios.get("/api/admin-profile");
        setAdminProfile(response.data);
      } catch (error) {
        console.error("Error loading admin profile:", error);
        setAdminProfile({
          firstName: "Gil",
          lastName: "Shalev",
          profilePicture: null,
        });
      }
    };
    loadAdminProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/about",
        { content: aboutText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      await fetchAbout();
    } catch (err) {
      console.error("Failed to update about text", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <p className="text-white p-4">{t("loading")}</p>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 px-4 py-8 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="glass rounded-2xl p-8 mb-8">
            {/* Name and Description */}
            <h1 className="text-3xl font-bold text-center mb-4">
              <span className="gradient-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t("hi")}, {t("aniGil")} 👋
              </span>
            </h1>
            <p className="text-gray-300 text-center text-lg mb-8">
              {t("fullstackDev")}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="glass p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-400">6+</div>
                <div className="text-sm text-gray-400">{t("projects")}</div>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-purple-400">2+</div>
                <div className="text-sm text-gray-400">{t("years")}</div>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-pink-400">15+</div>
                <div className="text-sm text-gray-400">{t("technologies")}</div>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-cyan-400">∞</div>
                <div className="text-sm text-gray-400">{t("passion")}</div>
              </div>
            </div>

            {/* View Projects Button */}
            <div className="text-center">
              <Link
                href="/projects"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🚀 {t("viewprojects")}
              </Link>
            </div>
          </div>

          {/* About Content Section */}
          {editing ? (
            <div className="modern-card p-8">
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full h-48 p-4 rounded-xl bg-gray-800/50 border border-gray-600 resize-none focus:border-blue-400 focus:outline-none text-white"
                placeholder={t("writeAboutYourself")}
              />
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleSave}
                  className="btn-success px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  {t("save")}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="btn-secondary px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <div className="modern-card p-8">
              <p className="whitespace-pre-line text-lg leading-relaxed text-center min-h-[100px] text-gray-200">
                {aboutText.trim() || t("noAboutContent")}
              </p>

              {user?.role === "admin" && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    {t("edit")}
                  </button>
                </div>
              )}
            </div>
          )}

          {saved && (
            <p className="text-green-400 text-center mt-4 text-sm">
              ✅ {t("aboutupdated")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

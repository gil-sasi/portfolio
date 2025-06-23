"use client";
import Spinner from "../../components/Spinner";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const [aboutText, setAboutText] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
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
          {/* Header */}
          <div className="text-center mb-12">
            <div className="glass rounded-2xl p-8">
              <h1 className="text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {t("about")}
                </span>
              </h1>
              <p className="text-gray-300">{t("getToKnowMe")}</p>
            </div>
          </div>

          {/* Content Section */}
          {editing ? (
            <div className="modern-card p-8">
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full h-48 p-4 rounded-xl bg-gray-800/50 border border-gray-600 resize-none focus:border-blue-400 focus:outline-none text-white"
                placeholder="Write something about yourself..."
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
                {aboutText.trim() || "No about content found."}
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

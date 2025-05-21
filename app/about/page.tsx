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
        <p className="text-white p-4">{t("Loading...", "טוען...")}</p>
        <Spinner />
      </div>
    );
  }

 return (
  <div className="min-h-screen overflow-auto px-4 py-8 bg-gray text-white">
    <h1 className="text-3xl font-bold mb-6 text-center">{t("about")}</h1>

    {editing ? (
      <>
        <textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          className="w-full max-w-4xl mx-auto block h-48 p-3 rounded bg-gray-800 border border-gray-600 resize-none"
          placeholder="Write something about yourself..."
        />
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            {t("save")}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
          >
            {t("cancel")}
          </button>
        </div>
      </>
    ) : (
      <>
        <p className="whitespace-pre-line text-lg max-w-4xl mx-auto text-center min-h-[100px]">
          {aboutText.trim() || "No about content found."}
        </p>

        {user?.role === "admin" && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white"
            >
              {t("edit")}
            </button>
          </div>
        )}
      </>
    )}

    {saved && (
      <p className="text-green-400 text-center mt-4 text-sm">
        ✅ {t("aboutupdated")}
      </p>
    )}
  </div>
);

}

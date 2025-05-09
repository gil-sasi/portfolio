"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";

export default function AboutPage() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get("/api/about");
        setContent(res.data.content);
      } catch (err) {
        console.error("Failed to load about", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/about",
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(t("aboutUpdated"));
      setEditing(false);
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || t("updateFailed"));
    }
  };

  if (loading) return <p>{t("loading")}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">{t("about")}</h1>

      {editing ? (
        <>
          <textarea
            className="w-full h-64 p-4 bg-gray-800 border border-gray-600 rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              {t("save")}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
            >
              {t("cancel")}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="whitespace-pre-line bg-gray-800 p-4 rounded border border-gray-600">
            {content || t("noAboutContent")}
          </div>
          {user?.role === "admin" && (
            <button
              onClick={() => setEditing(true)}
              className="mt-4 bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
            >
              {t("edit")}
            </button>
          )}
        </>
      )}

      {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
    </div>
  );
}

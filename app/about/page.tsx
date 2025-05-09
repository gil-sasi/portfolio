"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function AboutPage() {
  const [aboutText, setAboutText] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

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

  if (loading) return <p className="text-white p-4 text-center">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e11] px-4">
      <div className="w-full max-w-2xl bg-[#1e1e25] text-white p-6 rounded-2xl shadow-xl space-y-4">
        <h1 className="text-3xl font-bold text-center border-b border-gray-700 pb-2">
          About Me
        </h1>

        {editing ? (
          <>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full h-48 p-3 rounded-lg bg-[#2a2a35] border border-gray-600 resize-none text-white"
              placeholder="Write something about yourself..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p
              className={`whitespace-pre-line min-h-[120px] bg-[#2a2a35] p-4 rounded-md border ${
                aboutText.trim() ? "border-gray-700" : "border-red-500"
              }`}
            >
              {aboutText.trim() || "No about content found."}
            </p>

            {user?.role === "admin" && (
              <div className="flex justify-end">
                <button
                  onClick={() => setEditing(true)}
                  className="mt-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md text-black font-semibold"
                >
                  Edit
                </button>
              </div>
            )}
          </>
        )}

        {saved && (
          <p className="text-green-400 text-sm text-center">
            ✅ About updated!
          </p>
        )}
      </div>
    </div>
  );
}

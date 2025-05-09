"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function AboutPage() {
  const [aboutText, setAboutText] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get("/api/about");
        setAboutText(res.data.text);
      } catch (err) {
        console.error("Failed to fetch about text", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put("/api/about", { text: aboutText });
      setEditing(false);
    } catch (err) {
      console.error("Failed to update about text", err);
    }
  };

  if (loading) return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto text-white p-4">
      <h1 className="text-3xl font-bold mb-4">About Me</h1>
      {editing ? (
        <div>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full h-48 p-2 bg-gray-800 border border-gray-600 rounded"
          />
          <button
            onClick={handleSave}
            className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <p className="whitespace-pre-line">{aboutText}</p>
      )}
      {user?.role === "admin" && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="mt-4 bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded"
        >
          Edit
        </button>
      )}
    </div>
  );
}

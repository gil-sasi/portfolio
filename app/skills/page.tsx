"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/Spinner";

// Define the Skill type
type Skill = {
  _id: string;
  name: string;
  category: string;
};

export default function SkillsPage() {
  const { t, i18n } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fetch skills data from the backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skills");
        const data = await res.json();
        setSkills(data);
      } catch (err) {
        console.error("Failed to fetch skills", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    const lang = localStorage.getItem("i18nextLng");
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
    setMounted(true);
  }, [i18n]);

  if (!mounted) return <Spinner />;

  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Emojis for each category
  const categoryEmojis: Record<string, string> = {
    frontend: "🖥️",
    backend: "🧠",
    devops: "⚙️",
    database: "🗄️",
    mobile: "📱",
    tools: "🛠️",
    other: "🌀",
  };

  // Function to convert category to title case (e.g., "frontend" to "Frontend")
  const toTitleCase = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">{t("skills")}</h1>

      {loading ? (
        <>
          <Spinner />
          <p className="text-center text-gray-400">{t("loading")}...</p>
        </>
      ) : skills.length === 0 ? (
        <p className="text-center text-gray-400">{t("noskillsfound")}</p>
      ) : (
        Object.entries(groupedSkills).map(([category, items]) => (
          <div key={category} className="mb-8">
            {/* Category Header with Emoji and Title Case */}
            <h2 className="text-2xl font-semibold mb-4">
              {categoryEmojis[category] || "🔹"} {toTitleCase(category)}
            </h2>

            {/* Display Skills */}
            <div className="flex flex-wrap gap-3">
              {items.map((skill) => (
                <span
                  key={skill._id}
                  className="bg-blue-700/60 text-sm px-4 py-2 rounded-full border border-blue-400 transition-all duration-200 hover:bg-blue-500 hover:text-white"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

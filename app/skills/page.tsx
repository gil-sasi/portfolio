"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/Spinner";

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

  useEffect(() => {
    const lang = localStorage.getItem("i18nextLng");
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang).finally(() => {
        setMounted(true);
      });
    } else {
      setMounted(true);
    }
  }, [i18n]);

  useEffect(() => {
    if (!mounted) return;
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skills");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSkills(data);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [mounted]);

  if (!mounted) return <Spinner />;

  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryEmojis: Record<string, string> = {
    frontend: "🖥️",
    backend: "🧠",
    devops: "⚙️",
    database: "🗄️",
    mobile: "📱",
    tools: "🛠️",
    other: "🌀",
  };

  const toTitleCase = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto text-white p-4 sm:p-6 space-y-8 sm:space-y-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          {t("skills")}
        </h1>

        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <Spinner />
            <p className="text-center text-gray-400">{t("loading")}...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">{t("noskillsfound")}</p>
          </div>
        ) : (
          Object.entries(groupedSkills).map(([category, items]) => (
            <div
              key={category}
              className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center sm:text-left">
                {categoryEmojis[category] || "🔹"} {toTitleCase(category)}
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                {items.map((skill) => (
                  <span
                    key={skill._id}
                    className="bg-blue-700/60 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full border border-blue-400 transition-all duration-200 hover:bg-blue-500 hover:text-white cursor-default touch-manipulation"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

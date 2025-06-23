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

  const categoryColors: Record<string, string> = {
    frontend: "from-blue-500 to-cyan-500",
    backend: "from-green-500 to-emerald-500",
    devops: "from-orange-500 to-red-500",
    database: "from-purple-500 to-pink-500",
    mobile: "from-indigo-500 to-blue-500",
    tools: "from-yellow-500 to-orange-500",
    other: "from-gray-500 to-slate-500",
  };

  const toTitleCase = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-pink-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
          {/* Header */}
          <div className="text-center">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-400 to-pink-600 flex items-center justify-center text-2xl font-bold glow">
                🚀
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {t("skills")}
                </span>
              </h1>
              <p className="text-gray-300">{t("myTechnicalExpertise")}</p>
            </div>
          </div>

          {/* Skills Content */}
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="modern-card p-8">
                <Spinner />
                <p className="text-center text-gray-400 mt-4">
                  {t("loading")}...
                </p>
              </div>
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-12">
              <div className="modern-card p-8">
                <p className="text-gray-400 text-lg">{t("noskillsfound")}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(groupedSkills).map(([category, items]) => (
                <div
                  key={category}
                  className="modern-card p-6 sm:p-8 hover:scale-105 transition-all duration-300"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                        categoryColors[category] || "from-gray-500 to-slate-500"
                      } flex items-center justify-center text-xl`}
                    >
                      {categoryEmojis[category] || "🔹"}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      <span className="gradient-text">
                        {toTitleCase(category)}
                      </span>
                    </h2>
                  </div>

                  {/* Skills Grid */}
                  <div className="flex flex-wrap gap-3">
                    {items.map((skill, index) => (
                      <span
                        key={skill._id}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 cursor-default
                          bg-gradient-to-r ${
                            categoryColors[category] ||
                            "from-gray-500 to-slate-500"
                          }/20 
                          border border-white/10 hover:border-white/30 
                          text-white hover:shadow-lg glow-hover`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "fadeInUp 0.6s ease-out forwards",
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>

                  {/* Skill Count */}
                  <div className="mt-4 text-right">
                    <span className="text-xs text-gray-400">
                      {items.length}{" "}
                      {items.length === 1
                        ? t("skill")
                        : t("skills_plural") || "skills"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Section */}
          {!loading && skills.length > 0 && (
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-center mb-6">
                <span className="gradient-text">{t("skillsOverview")}</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">
                    {skills.length}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("totalSkills")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {Object.keys(groupedSkills).length}
                  </div>
                  <div className="text-sm text-gray-400">{t("categories")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">
                    {Math.max(
                      ...Object.values(groupedSkills).map((arr) => arr.length)
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("maxPerCategory")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">∞</div>
                  <div className="text-sm text-gray-400">{t("learning")}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

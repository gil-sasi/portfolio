"use client";
import React from "react";
import { useTranslation } from "react-i18next";

interface Skill {
  _id: string;
  name: string;
  category: string;
}

interface Props {
  skills: Skill[];
  skillsLoading: boolean;
  newSkill: string;
  newSkillCategory: string;
  setNewSkill: (val: string) => void;
  setNewSkillCategory: (val: string) => void;
  onAddSkill: () => void;
  onDeleteSkill: (id: string) => void;
  status: string;
}

export default function SkillsSection({
  skills,
  skillsLoading,
  newSkill,
  newSkillCategory,
  setNewSkill,
  setNewSkillCategory,
  onAddSkill,
  onDeleteSkill,
  status,
}: Props) {
  const { t } = useTranslation();

  const groupSkills = (skills: Skill[]) => {
    const grouped: Record<string, Skill[]> = {};
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });
    return grouped;
  };

  const categoryEmojis: Record<string, string> = {
    frontend: "🖥️",
    backend: "🧠",
    devops: "⚙️",
    database: "🗄️",
    mobile: "📱",
    tools: "🛠️",
    other: "🌀",
  };

  return (
    <div className="mt-10 border border-gray-700 bg-gray-800 p-6 rounded">
      <h2 className="text-xl font-bold mb-4">{t("skills")}</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={t("skillname")}
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="flex-1 p-2 bg-gray-700 rounded border border-gray-600"
        />
        <select
          value={newSkillCategory}
          onChange={(e) => setNewSkillCategory(e.target.value)}
          className="p-2 bg-gray-700 rounded border border-gray-600"
        >
          <option value="frontend">🖥️ Frontend</option>
          <option value="backend">🧠 Backend</option>
          <option value="devops">⚙️ DevOps</option>
          <option value="database">🗄️ Database</option>
          <option value="mobile">📱 Mobile</option>
          <option value="tools">🛠️ Tools</option>
          <option value="other">🌀 Other</option>
        </select>
        <button
          onClick={onAddSkill}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {t("add")}
        </button>
      </div>

      {skillsLoading ? (
        <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
      ) : (
        Object.entries(groupSkills(skills)).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">
              {categoryEmojis[category] || "🔹"} {t(category)}
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {items.map((skill) => (
                <li
                  key={skill._id}
                  className="flex justify-between items-center"
                >
                  {skill.name}
                  <button
                    onClick={() => onDeleteSkill(skill._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {status && <p className="text-sm text-green-400 mt-2">{status}</p>}
    </div>
  );
}

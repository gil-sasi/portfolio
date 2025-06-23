"use client";
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCode,
  FaPlus,
  FaTrash,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaDesktop,
  FaServer,
  FaCogs,
  FaDatabase,
  FaMobile,
  FaTools,
  FaLightbulb,
  FaChartBar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLayerGroup,
} from "react-icons/fa";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level?: number;
  description?: string;
  createdAt?: string;
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

const SKILL_CATEGORIES = [
  {
    key: "frontend",
    icon: FaDesktop,
    color: "text-blue-500",
    emoji: "🖥️",
    label: "Frontend",
  },
  {
    key: "backend",
    icon: FaServer,
    color: "text-green-500",
    emoji: "🧠",
    label: "Backend",
  },
  {
    key: "devops",
    icon: FaCogs,
    color: "text-purple-500",
    emoji: "⚙️",
    label: "DevOps",
  },
  {
    key: "database",
    icon: FaDatabase,
    color: "text-yellow-500",
    emoji: "🗄️",
    label: "Database",
  },
  {
    key: "mobile",
    icon: FaMobile,
    color: "text-pink-500",
    emoji: "📱",
    label: "Mobile",
  },
  {
    key: "tools",
    icon: FaTools,
    color: "text-orange-500",
    emoji: "🛠️",
    label: "Tools",
  },
  {
    key: "other",
    icon: FaLightbulb,
    color: "text-gray-500",
    emoji: "🌀",
    label: "Other",
  },
];

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
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "category" | "date">(
    "category"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newSkillError, setNewSkillError] = useState("");

  const isRTL = i18n.language === "he";

  // Filter and sort skills
  const filteredAndSortedSkills = useMemo(() => {
    const filtered = skills.filter((skill) => {
      const matchesSearch = skill.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "date":
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          comparison = aDate - bDate;
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [skills, searchTerm, selectedCategory, sortBy, sortOrder]);

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

  const getCategoryInfo = (categoryKey: string) => {
    return (
      SKILL_CATEGORIES.find((cat) => cat.key === categoryKey) ||
      SKILL_CATEGORIES[6]
    );
  };

  const validateSkill = (skillName: string) => {
    if (!skillName.trim()) {
      setNewSkillError(t("skillNameRequired", "Skill name is required"));
      return false;
    }
    if (
      skills.some(
        (skill) => skill.name.toLowerCase() === skillName.toLowerCase()
      )
    ) {
      setNewSkillError(t("skillAlreadyExists", "This skill already exists"));
      return false;
    }
    setNewSkillError("");
    return true;
  };

  const handleAddSkill = () => {
    if (validateSkill(newSkill)) {
      onAddSkill();
    }
  };

  const handleSort = (field: "name" | "category" | "date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Statistics
  const stats = {
    total: skills.length,
    categories: Object.keys(groupSkills(skills)).length,
    frontend: skills.filter((s) => s.category === "frontend").length,
    backend: skills.filter((s) => s.category === "backend").length,
    mobile: skills.filter((s) => s.category === "mobile").length,
    tools: skills.filter((s) => s.category === "tools").length,
  };

  return (
    <div className={`modern-card p-6 ${isRTL ? "rtl-text" : ""}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-3">
            <FaCode className="text-purple-500" />
            {t("skills")}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {t(
              "manageSkillsDesc",
              "Manage your technical skills and expertise"
            )}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center min-w-[80px]">
            <div className="text-xl font-bold text-purple-400">
              {stats.total}
            </div>
            <div className="text-xs text-gray-400">{t("totalSkills")}</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center min-w-[80px]">
            <div className="text-xl font-bold text-blue-400">
              {stats.categories}
            </div>
            <div className="text-xs text-gray-400">{t("categories")}</div>
          </div>
        </div>
      </div>

      {/* Add New Skill Section */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaPlus className="text-green-500" />
          <h3 className="text-lg font-semibold">
            {t("addskill", "Add New Skill")}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t("skillname", "Skill Name")}
            </label>
            <input
              type="text"
              placeholder={t("enterSkillName", "Enter skill name...")}
              value={newSkill}
              onChange={(e) => {
                setNewSkill(e.target.value);
                if (newSkillError) validateSkill(e.target.value);
              }}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                newSkillError
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-600 focus:border-blue-500"
              }`}
            />
            {newSkillError && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                <FaExclamationTriangle />
                <span>{newSkillError}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t("category", "Category")}
            </label>
            <div className="flex gap-2">
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                {SKILL_CATEGORIES.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.emoji} {category.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddSkill}
                disabled={!newSkill.trim() || skillsLoading}
                className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center gap-2 min-w-[100px] justify-center"
              >
                <FaPlus />
                {t("add")}
              </button>
            </div>
          </div>
        </div>

        {status && (
          <div className="flex items-center gap-2 mt-4 text-green-400 text-sm">
            <FaCheckCircle />
            <span>{status}</span>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("searchSkills", "Search skills...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="all">{t("allCategories", "All Categories")}</option>
          {SKILL_CATEGORIES.map((category) => (
            <option key={category.key} value={category.key}>
              {category.emoji} {category.label}
            </option>
          ))}
        </select>

        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            setSortBy(field as "name" | "category" | "date");
            setSortOrder(order as "asc" | "desc");
          }}
          className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="category-asc">
            {t("sortByCategory", "Category A-Z")}
          </option>
          <option value="name-asc">{t("sortByNameAsc", "Name A-Z")}</option>
          <option value="name-desc">{t("sortByNameDesc", "Name Z-A")}</option>
          <option value="date-desc">{t("sortByNewest", "Newest First")}</option>
        </select>

        <div className="flex border border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-3 transition-colors ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <FaLayerGroup />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-3 transition-colors ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <FaChartBar />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {skillsLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-b-blue-500 rounded-full animate-spin animate-reverse" />
          </div>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="space-y-6">
              {Object.entries(groupSkills(filteredAndSortedSkills)).map(
                ([category, items]) => {
                  const categoryInfo = getCategoryInfo(category);
                  return (
                    <div
                      key={category}
                      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 ${categoryInfo.color}`}
                        >
                          <categoryInfo.icon className="text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {categoryInfo.emoji}{" "}
                            {t(category, categoryInfo.label)}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {items.length}{" "}
                            {items.length === 1
                              ? t("skill")
                              : t("skills_plural", "skills")}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {items.map((skill) => (
                          <div
                            key={skill._id}
                            className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors group"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                {skill.name}
                              </span>
                              <button
                                onClick={() => onDeleteSkill(skill._id)}
                                className="opacity-0 group-hover:opacity-100 px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-all"
                                title={t("deleteSkill", "Delete skill")}
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="p-4 text-left">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                      >
                        {t("skillname", "Skill Name")}
                        {sortBy === "name" &&
                          (sortOrder === "desc" ? (
                            <FaSortAmountDown />
                          ) : (
                            <FaSortAmountUp />
                          ))}
                      </button>
                    </th>
                    <th className="p-4 text-left">
                      <button
                        onClick={() => handleSort("category")}
                        className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                      >
                        {t("category")}
                        {sortBy === "category" &&
                          (sortOrder === "desc" ? (
                            <FaSortAmountDown />
                          ) : (
                            <FaSortAmountUp />
                          ))}
                      </button>
                    </th>
                    <th className="p-4 text-left">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedSkills.map((skill) => {
                    const categoryInfo = getCategoryInfo(skill.category);
                    return (
                      <tr
                        key={skill._id}
                        className="border-t border-gray-600 hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-medium text-white">
                            {skill.name}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <categoryInfo.icon
                              className={`${categoryInfo.color} text-sm`}
                            />
                            <span className="text-sm text-gray-300">
                              {t(skill.category, categoryInfo.label)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => onDeleteSkill(skill._id)}
                            className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-all"
                            title={t("deleteSkill", "Delete skill")}
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedSkills.length === 0 && (
            <div className="text-center py-12">
              <FaCode className="mx-auto text-6xl text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                {searchTerm
                  ? t("noSkillsFound", "No skills found")
                  : t("noSkillsYet", "No skills added yet")}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {searchTerm
                  ? t("tryDifferentSearch", "Try a different search term")
                  : t("addFirstSkill", "Add your first skill to get started")}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

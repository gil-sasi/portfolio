"use client";
import React from "react";
import { FaIdCard, FaCogs, FaUsers, FaHome } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface Tab {
  key: string;
  label: string;
  icon: React.ReactElement;
}

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
}: AdminSidebarProps) {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    { key: "dashboard", label: t("dashboard"), icon: <FaHome /> },
    { key: "visitors", label: t("visitors"), icon: <FaCogs /> },
    { key: "users", label: t("usermanagement"), icon: <FaUsers /> },
    { key: "contact", label: t("contactinfo"), icon: <FaIdCard /> },
    { key: "skills", label: t("skills"), icon: <FaCogs /> },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white shadow-md p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">{t("adminsidebar")}</h2>
      {tabs.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`flex items-center w-full gap-3 px-4 py-2 rounded text-left transition-all duration-200
            ${
              activeTab === key
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </aside>
  );
}

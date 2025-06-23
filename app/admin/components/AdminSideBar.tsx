"use client";
import React, { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs: Tab[] = [
    { key: "dashboard", label: t("dashboard"), icon: <FaHome /> },
    { key: "visitors", label: t("visitors"), icon: <FaCogs /> },
    { key: "users", label: t("usermanagement"), icon: <FaUsers /> },
    { key: "contact", label: t("contactinfo"), icon: <FaIdCard /> },
    { key: "skills", label: t("skills"), icon: <FaCogs /> },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen bg-gray-900 text-white shadow-md p-4 space-y-2">
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

      {/* Mobile Horizontal Tab Bar */}
      <div className="md:hidden bg-gray-900 text-white border-b border-gray-700">
        <div className="px-2 py-3">
          <h2 className="text-lg font-bold mb-2 text-center">
            {t("adminsidebar")}
          </h2>
          <div className="flex overflow-x-auto scrollbar-hide space-x-1">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex flex-col items-center min-w-[80px] px-3 py-2 rounded text-xs transition-all duration-200 whitespace-nowrap
                  ${
                    activeTab === key
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
              >
                <div className="mb-1">{icon}</div>
                <span className="text-[10px] leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

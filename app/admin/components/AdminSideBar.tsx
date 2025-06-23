"use client";
import React, { useState, useEffect } from "react";
import {
  FaIdCard,
  FaCogs,
  FaUsers,
  FaHome,
  FaChevronLeft,
  FaChevronRight,
  FaChartBar,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface Tab {
  key: string;
  label: string;
  icon: React.ReactElement;
}

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSidebarToggle?: (isCollapsed: boolean) => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onSidebarToggle,
}: AdminSidebarProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs: Tab[] = [
    { key: "dashboard", label: t("dashboard"), icon: <FaHome /> },
    { key: "visitors", label: t("visitors"), icon: <FaCogs /> },
    {
      key: "project-analytics",
      label: t("projectanalytics"),
      icon: <FaChartBar />,
    },
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
      <aside
        className={`hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-900 text-white shadow-md p-4 space-y-2 z-10 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div
          className={`flex items-center mb-4 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <h2 className="text-xl font-bold">{t("adminsidebar")}</h2>
          )}
          <button
            onClick={() => {
              const newCollapsed = !isCollapsed;
              setIsCollapsed(newCollapsed);
              onSidebarToggle?.(newCollapsed);
            }}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center w-full rounded text-left transition-all duration-200 ${
              isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-2"
            } ${
              activeTab === key
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
            title={isCollapsed ? label : undefined}
          >
            <div className={isCollapsed ? "text-lg" : ""}>{icon}</div>
            {!isCollapsed && <span>{label}</span>}
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

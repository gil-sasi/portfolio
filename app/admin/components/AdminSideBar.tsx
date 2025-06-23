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
  FaEye,
  FaEnvelope,
  FaTools,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface Tab {
  key: string;
  label: string;
  icon: React.ReactElement;
  color: string;
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
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isRTL = i18n.language === "he";

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs: Tab[] = [
    {
      key: "dashboard",
      label: t("dashboard"),
      icon: <FaHome />,
      color: "from-blue-500 to-blue-600",
    },
    {
      key: "visitors",
      label: t("visitors"),
      icon: <FaEye />,
      color: "from-green-500 to-green-600",
    },
    {
      key: "project-analytics",
      label: t("projectanalytics"),
      icon: <FaChartBar />,
      color: "from-purple-500 to-purple-600",
    },
    {
      key: "users",
      label: t("usermanagement"),
      icon: <FaUsers />,
      color: "from-red-500 to-red-600",
    },
    {
      key: "contact",
      label: t("contactinfo"),
      icon: <FaEnvelope />,
      color: "from-pink-500 to-pink-600",
    },
    {
      key: "skills",
      label: t("skills"),
      icon: <FaTools />,
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  if (!mounted) {
    return null;
  }

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onSidebarToggle?.(newCollapsed);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed ${
          isRTL ? "right-0" : "left-0"
        } top-16 h-[calc(100vh-4rem)] modern-card shadow-2xl p-6 space-y-3 z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-72"
        }`}
        style={{
          zIndex: 1000,
          pointerEvents: "auto",
        }}
      >
        {/* Header */}
        <div
          className={`flex items-center mb-8 ${
            isCollapsed
              ? "justify-center"
              : isRTL
              ? "justify-between flex-row-reverse"
              : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className={isRTL ? "text-right" : "text-left"}>
              <h2 className="text-xl font-bold gradient-text">
                {t("adminsidebar")}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isRTL ? "לוח בקרה" : "Control Panel"}
              </p>
            </div>
          )}
          <button
            onClick={handleToggle}
            className="p-3 hover:bg-gray-700/50 rounded-xl transition-all duration-200 group z-10 relative"
            title={
              isCollapsed
                ? t("expandSidebar", "Expand Sidebar")
                : t("collapseSidebar", "Collapse Sidebar")
            }
            style={{ pointerEvents: "auto" }}
          >
            {isRTL ? (
              isCollapsed ? (
                <FaChevronLeft className="text-gray-400 group-hover:text-white transition-colors" />
              ) : (
                <FaChevronRight className="text-gray-400 group-hover:text-white transition-colors" />
              )
            ) : isCollapsed ? (
              <FaChevronRight className="text-gray-400 group-hover:text-white transition-colors" />
            ) : (
              <FaChevronLeft className="text-gray-400 group-hover:text-white transition-colors" />
            )}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="space-y-2">
          {tabs.map(({ key, label, icon, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`group relative flex items-center w-full rounded-xl transition-all duration-300 z-10 ${
                isCollapsed
                  ? "justify-center px-3 py-4"
                  : isRTL
                  ? "gap-4 px-4 py-3 flex-row-reverse"
                  : "gap-4 px-4 py-3"
              } ${
                activeTab === key
                  ? `bg-gradient-to-r ${color} text-white shadow-lg shadow-${
                      color.split("-")[1]
                    }-500/25`
                  : "hover:bg-gray-700/50 text-gray-300 hover:text-white"
              }`}
              title={isCollapsed ? label : undefined}
              style={{ pointerEvents: "auto" }}
            >
              {/* Icon */}
              <div
                className={`${
                  isCollapsed ? "text-xl" : "text-lg"
                } transition-transform group-hover:scale-110`}
              >
                {icon}
              </div>

              {/* Label */}
              {!isCollapsed && (
                <span
                  className={`font-medium text-sm ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {label}
                </span>
              )}

              {/* Active Indicator */}
              {activeTab === key && !isCollapsed && (
                <div
                  className={`absolute ${
                    isRTL ? "left-2" : "right-2"
                  } w-2 h-2 bg-white rounded-full animate-pulse`}
                />
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div
            className={`absolute bottom-6 ${
              isRTL ? "right-6 left-6" : "left-6 right-6"
            }`}
          >
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div
                className={`text-xs text-gray-400 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("status", "Status")}
              </div>
              <div
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">
                  {t("systemOnline", "System Online")}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Horizontal Tab Bar */}
      <div
        className={`md:hidden modern-card border-b-2 border-gray-700/50 z-40 ${
          isRTL ? "rtl-text" : ""
        }`}
        style={{ zIndex: 999 }}
      >
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold gradient-text mb-4 text-center">
            {t("adminsidebar")}
          </h2>
          <div
            className={`flex overflow-x-auto scrollbar-hide ${
              isRTL ? "space-x-reverse space-x-2" : "space-x-2"
            } pb-2`}
          >
            {tabs.map(({ key, label, icon, color }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`group flex flex-col items-center min-w-[90px] px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === key
                    ? `bg-gradient-to-br ${color} text-white shadow-lg`
                    : "hover:bg-gray-700/50 text-gray-300 hover:text-white"
                }`}
                style={{ pointerEvents: "auto" }}
              >
                <div className="mb-2 text-lg transition-transform group-hover:scale-110">
                  {icon}
                </div>
                <span className="text-xs font-medium leading-tight text-center">
                  {label}
                </span>

                {/* Active Indicator */}
                {activeTab === key && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

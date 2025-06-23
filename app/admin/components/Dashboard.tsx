"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface DashboardStats {
  totalUsers: number;
  totalVisitors: number;
  totalMessages: number;
  totalSkills: number;
  bannedUsers: number;
}

interface Props {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: Props) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVisitors: 0,
    totalMessages: 0,
    totalSkills: 0,
    bannedUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    version: "",
    deployedAt: "",
    mongoConnected: false,
  });

  // Fix hydration by ensuring component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all data in parallel
        const [usersRes, visitorsRes, messagesRes, skillsRes, statusRes] =
          await Promise.all([
            axios.get("/api/admin/users", { headers }),
            axios.get("/api/admin/visitors", { headers }),
            axios.get("/api/messages/all", { headers }),
            axios.get("/api/skills"),
            axios.get("/api/admin/status", { headers }),
          ]);

        // Calculate stats from the responses
        const users = usersRes.data.users || [];
        const visitors = visitorsRes.data || [];
        const messages = messagesRes.data || [];
        const skills = skillsRes.data || [];

        setStats({
          totalUsers: users.length,
          totalVisitors: visitors.length,
          totalMessages: messages.length,
          totalSkills: skills.length,
          bannedUsers: users.filter((u: { isBanned: boolean }) => u.isBanned)
            .length,
        });

        setSystemStatus(statusRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [mounted]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "messages":
        window.location.href = "/admin/messages";
        break;
      case "users":
        setActiveTab("users");
        break;
      case "visitors":
        setActiveTab("visitors");
        break;
      case "skills":
        setActiveTab("skills");
        break;
    }
  };

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
          {t("dashboardoverview")}
        </h2>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Users */}
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{t("totalusers")}</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="text-blue-500 text-2xl sm:text-3xl">👥</div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {t("bannedusers")}: {stats.bannedUsers}
            </div>
          </div>

          {/* Total Visitors */}
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{t("totalvisitors")}</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stats.totalVisitors}
                </p>
              </div>
              <div className="text-green-500 text-2xl sm:text-3xl">🌐</div>
            </div>
          </div>

          {/* Total Messages */}
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{t("totalmessages")}</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stats.totalMessages}
                </p>
              </div>
              <div className="text-purple-500 text-2xl sm:text-3xl">💬</div>
            </div>
          </div>

          {/* Total Skills */}
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{t("totalskills")}</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stats.totalSkills}
                </p>
              </div>
              <div className="text-yellow-500 text-2xl sm:text-3xl">🛠️</div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            {t("quickactions")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => handleQuickAction("messages")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2 rounded font-medium text-sm transition touch-manipulation cursor-pointer"
            >
              {t("viewmessages")}
            </button>
            <button
              onClick={() => handleQuickAction("users")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 sm:py-2 rounded font-medium text-sm transition touch-manipulation cursor-pointer"
            >
              {t("manageusers")}
            </button>
            <button
              onClick={() => handleQuickAction("visitors")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 sm:py-2 rounded font-medium text-sm transition touch-manipulation cursor-pointer"
            >
              {t("viewvisitors")}
            </button>
            <button
              onClick={() => handleQuickAction("skills")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 sm:py-2 rounded font-medium text-sm transition touch-manipulation cursor-pointer"
            >
              {t("manageskills")}
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600 mt-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            {t("systemstatus")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
              <span className="text-sm text-gray-300">{t("serverstatus")}</span>
              <span className="text-green-400 text-sm font-medium flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {t("online")}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
              <span className="text-sm text-gray-300">{t("database")}</span>
              <span
                className={`text-sm font-medium flex items-center ${
                  systemStatus.mongoConnected
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    systemStatus.mongoConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                {systemStatus.mongoConnected
                  ? t("connected")
                  : t("disconnected")}
              </span>
            </div>
          </div>

          {systemStatus.version && (
            <div className="mt-4 text-center text-xs text-gray-500">
              {t("version")}: {systemStatus.version} |
              {systemStatus.deployedAt && (
                <>
                  {" "}
                  {t("deployed")}:{" "}
                  {new Date(systemStatus.deployedAt).toLocaleString()}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

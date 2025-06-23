"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  FaUsers,
  FaEye,
  FaEnvelope,
  FaCog,
  FaShieldAlt,
  FaChartLine,
  FaArrowUp,
  FaSync,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

interface DashboardStats {
  totalUsers: number;
  totalVisitors: number;
  totalMessages: number;
  totalSkills: number;
  bannedUsers: number;
  recentActivity?: {
    newUsers: number;
    newMessages: number;
    newVisitors: number;
  };
}

interface User {
  _id: string;
  createdAt?: string;
  isBanned: boolean;
}

interface Message {
  _id: string;
  createdAt?: string;
}

interface Visitor {
  _id: string;
  firstVisit?: string;
}

interface Props {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: Props) {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVisitors: 0,
    totalMessages: 0,
    totalSkills: 0,
    bannedUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    version: "1.0.0",
    deployedAt: new Date().toISOString(),
    mongoConnected: true,
    uptime: "5 days",
    memory: "85%",
  });

  const isRTL = i18n.language === "he";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchAllData();
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No auth token found, loading with limited data");
        setLoading(false);
        setRefreshing(false);
        // Set some default stats so the dashboard still works
        setStats({
          totalUsers: 0,
          totalVisitors: 0,
          totalMessages: 0,
          totalSkills: 0,
          bannedUsers: 0,
        });
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, visitorsRes, messagesRes, skillsRes, statusRes] =
        await Promise.all([
          axios.get("/api/admin/users", { headers }),
          axios.get("/api/admin/visitors", { headers }),
          axios.get("/api/messages/all", { headers }),
          axios.get("/api/skills"),
          axios
            .get("/api/admin/status", { headers })
            .catch(() => ({ data: systemStatus })),
        ]);

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
        recentActivity: {
          newUsers: users.filter(
            (u: User) =>
              new Date(u.createdAt || Date.now()) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
          newMessages: messages.filter(
            (m: Message) =>
              new Date(m.createdAt || Date.now()) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
          newVisitors: visitors.filter(
            (v: Visitor) =>
              new Date(v.firstVisit || Date.now()) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
        },
      });

      setSystemStatus(statusRes.data);
    } catch (error: unknown) {
      console.error("Failed to fetch dashboard data:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
  };

  const handleQuickAction = (action: string) => {
    const event = new CustomEvent("adminTabChange", { detail: action });
    window.dispatchEvent(event);

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
      case "contact":
        setActiveTab("contact");
        break;
      case "project-analytics":
        setActiveTab("project-analytics");
        break;
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-b-purple-500 rounded-full animate-spin animate-reverse" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: t("totalusers"),
      value: stats.totalUsers,
      icon: FaUsers,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      change: stats.recentActivity?.newUsers || 0,
      action: () => handleQuickAction("users"),
    },
    {
      title: t("totalvisitors"),
      value: stats.totalVisitors,
      icon: FaEye,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      change: stats.recentActivity?.newVisitors || 0,
      action: () => handleQuickAction("visitors"),
    },
    {
      title: t("totalmessages"),
      value: stats.totalMessages,
      icon: FaEnvelope,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      change: stats.recentActivity?.newMessages || 0,
      action: () => handleQuickAction("messages"),
    },
    {
      title: t("totalskills"),
      value: stats.totalSkills,
      icon: FaCog,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      change: 0,
      action: () => handleQuickAction("skills"),
    },
  ];

  return (
    <div className={`space-y-8 ${isRTL ? "rtl-text" : ""}`}>
      {/* Header */}
      <div className="modern-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
              {t("adminWelcome")}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {t("manageYourPortfolio")}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 min-w-[120px] justify-center"
          >
            <FaSync className={`${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? t("loading") : t("refreshData")}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            onClick={card.action}
            className={`modern-card p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${card.bgColor} ${card.borderColor} border-2 hover:border-opacity-50 group`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                <card.icon className="text-white text-xl" />
              </div>
              {card.change > 0 && (
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <FaArrowUp className="text-[10px]" />
                  <span>+{card.change}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {card.value.toLocaleString()}
              </h3>
              <p className="text-gray-400 text-sm">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="modern-card p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaChartLine className="text-blue-500" />
          {t("quickactions")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              key: "messages",
              label: t("viewmessages"),
              icon: FaEnvelope,
              color: "bg-blue-600 hover:bg-blue-700",
            },
            {
              key: "users",
              label: t("manageusers"),
              icon: FaUsers,
              color: "bg-green-600 hover:bg-green-700",
            },
            {
              key: "visitors",
              label: t("viewvisitors"),
              icon: FaEye,
              color: "bg-purple-600 hover:bg-purple-700",
            },
            {
              key: "skills",
              label: t("manageskills"),
              icon: FaCog,
              color: "bg-yellow-600 hover:bg-yellow-700",
            },
            {
              key: "contact",
              label: t("contactinfo"),
              icon: FaEnvelope,
              color: "bg-pink-600 hover:bg-pink-700",
            },
            {
              key: "project-analytics",
              label: t("projectanalytics"),
              icon: FaChartLine,
              color: "bg-indigo-600 hover:bg-indigo-700",
            },
          ].map((action) => (
            <button
              key={action.key}
              onClick={() => handleQuickAction(action.key)}
              className={`${action.color} text-white px-6 py-4 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 flex items-center gap-3 shadow-lg hover:shadow-xl`}
            >
              <action.icon className="text-lg" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="modern-card p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaDatabase className="text-green-500" />
            {t("systemstatus")}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t("database")}</span>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span className="text-green-400">{t("connected")}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t("version")}</span>
              <span className="text-white">{systemStatus.version}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t("uptime", "Uptime")}</span>
              <span className="text-white">{systemStatus.uptime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t("memory", "Memory")}</span>
              <span className="text-white">{systemStatus.memory}</span>
            </div>
          </div>
        </div>

        <div className="modern-card p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaShieldAlt className="text-yellow-500" />
            {t("recentActivity")}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">
                {t("newUsersWeek", "New Users (7 days)")}
              </span>
              <span className="text-green-400">
                +{stats.recentActivity?.newUsers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">
                {t("newMessagesWeek", "New Messages (7 days)")}
              </span>
              <span className="text-blue-400">
                +{stats.recentActivity?.newMessages || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">
                {t("newVisitorsWeek", "New Visitors (7 days)")}
              </span>
              <span className="text-purple-400">
                +{stats.recentActivity?.newVisitors || 0}
              </span>
            </div>
            {stats.bannedUsers > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t("bannedusers")}</span>
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="text-yellow-500" />
                  <span className="text-yellow-400">{stats.bannedUsers}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

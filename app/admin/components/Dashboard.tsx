"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Visitor {
  ip: string;
  country?: string;
  lastVisit: string;
}
interface Skill {
  _id: string;
}
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBanned: boolean;
  lastLogin?: {
    date?: string;
    ip?: string;
  };
}
interface LoginStat {
  date: string;
  count: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loginStats, setLoginStats] = useState<LoginStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({
    version: "",
    deployedAt: "",
    mongoConnected: false,
  });

  useEffect(() => {
    axios.get("/api/admin/status").then((res) => setStatus(res.data));
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const [usersRes, skillsRes, visitorsRes] = await Promise.all([
          axios.get("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/skills"),
          axios.get("/api/admin/visitors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersRes.data.users);
        setSkills(skillsRes.data);
        setVisitors(visitorsRes.data);

        // Generate daily stats from visitors
        const counts: Record<string, number> = {};
        visitorsRes.data.forEach((v: Visitor) => {
          const date = new Date(v.lastVisit).toISOString().slice(0, 10);
          counts[date] = (counts[date] || 0) + 1;
        });

        const today = new Date();
        const normalized: LoginStat[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);
          normalized.push({ date: dateStr, count: counts[dateStr] || 0 });
        }
        setLoginStats(normalized);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalUsers = users.length;
  const bannedUsers = users.filter((u: User) => u.isBanned).length;
  const totalSkills = skills.length;
  const totalVisitors = visitors.length;

  return (
    <div className="min-h-screen overflow-auto px-2 py-4 sm:px-6 space-y-6">
      <h2 className="text-2xl font-bold">{t("dashboard", "Dashboard")}</h2>

      {loading ? (
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mt-10" />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card title={t("totalusers")} value={totalUsers} />
            <Card title={t("bannedusers")} value={bannedUsers} />
            <Card title={t("skills")} value={totalSkills} />
            <Card title={t("visitors")} value={totalVisitors} />
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded p-4 mt-8">
            <h3 className="text-lg font-semibold mb-2">
              {t("loginsperday", "Logins per Day")}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loginStats}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#4b5563",
                  }}
                />
                <Bar dataKey="count" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <footer className="text-center text-sm text-gray-400 mt-8">
            <p>
              {t("version")}: {status.version} | {t("deployed")}:{" "}
              {status.deployedAt
                ? new Date(status.deployedAt).toLocaleString("en-GB")
                : ""}
              | MongoDB: {status.mongoConnected ? "✅" : "❌"}
            </p>
          </footer>
        </>
      )}
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-gray-800 p-4 rounded shadow text-center border border-gray-700">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

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
interface ClickStat {
  platform: string;
  count: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loginStats, setLoginStats] = useState<
    { date: string; count: number }[]
  >([]);
  const [clickStats, setClickStats] = useState<ClickStat[]>([]);
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
        const [usersRes, skillsRes, visitorsRes, loginsRes, clicksRes] =
          await Promise.all([
            axios.get("/api/admin/users", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("/api/skills"),
            axios.get("/api/admin/visitors", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`/api/admin/logins?_=${Date.now()}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("/api/admin/contact-clicks", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setUsers(usersRes.data.users);
        setSkills(skillsRes.data);
        setVisitors(visitorsRes.data);
        setLoginStats(loginsRes.data);
        console.log("Login Stats:", loginsRes.data);
        setClickStats(
          ((clicksRes.data ?? []) as ClickStat[]).sort(
            (a: ClickStat, b: ClickStat) => b.count - a.count
          )
        );
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("dashboard")}</h2>

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
            <h3 className="text-lg font-semibold mb-2">{t("loginsperday")}</h3>
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

          <div className="bg-gray-800 border border-gray-700 rounded p-4 mt-8">
            <h3 className="text-lg font-semibold mb-4">{t("mostcontacted")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {clickStats.map((c) => (
                <div
                  key={c.platform}
                  className="flex justify-between bg-gray-900 px-4 py-2 rounded border border-gray-700"
                >
                  <span className="text-white font-medium">{c.platform}</span>
                  <span className="text-blue-400">{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          <footer className="text-center text-sm text-gray-400 mt-8">
            <p>
              {t("version")}: {status.version} | {t("deployed")}:{" "}
              {new Date(status.deployedAt).toLocaleString("en-GB")} | MongoDB:{" "}
              {status.mongoConnected ? "✅" : "❌"}
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

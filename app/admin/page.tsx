"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBanned: boolean;
  lastLogin?: {
    date: string;
    ip: string;
  };
  loginHistory: {
    date: string;
    ip: string;
  }[];
}

interface ContactInfo {
  email: string;
  socials: { platform: string; url: string }[];
}

export default function AdminPage() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Contact Info State
  const [contactEmail, setContactEmail] = useState("");
  const [socials, setSocials] = useState<{ platform: string; url: string }[]>(
    []
  );
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userRes, contactRes] = await Promise.all([
          axios.get("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/contact-info"),
        ]);

        const sorted = userRes.data.users.sort((a: User, b: User) => {
          const aDate = a.lastLogin?.date
            ? new Date(a.lastLogin.date).getTime()
            : 0;
          const bDate = b.lastLogin?.date
            ? new Date(b.lastLogin.date).getTime()
            : 0;
          return bDate - aDate;
        });

        setUsers(sorted);
        setContactEmail(contactRes.data.email || "");
        setSocials(contactRes.data.socials || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBanToggle = async (userId: string, isBanned: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/admin/users",
        { userId, isBanned: !isBanned },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: !isBanned } : u))
      );
    } catch (err) {
      console.error("Failed to update user ban status", err);
    }
  };

  const updateSocial = (
    i: number,
    field: "platform" | "url",
    value: string
  ) => {
    setSocials((prev) => {
      const updated = [...prev];
      updated[i][field] = value;
      return updated;
    });
  };

  const removeSocial = (i: number) => {
    setSocials((prev) => prev.filter((_, index) => index !== i));
  };

  const handleSaveContactInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/contact-info",
        { email: contactEmail, socials },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSaveStatus(t("contactUpdated", "✅ Contact info updated!"));
    } catch (err) {
      console.error(err);
      setSaveStatus(t("saveFailed", "Failed to save contact info"));
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  if (!user || user.role !== "admin") {
    return (
      <p className="text-red-400 text-center mt-10">
        {t("unauthorized", "Unauthorized")}
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-white text-center mt-10">
        {t("loading", "Loading users...")}
      </p>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {t("adminPanel", "Admin Panel - Users")}
      </h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("search")}
          className="w-full max-w-md px-4 py-2 rounded bg-gray-800 border border-gray-600 text-sm"
        />
      </div>

      <table className="w-full border border-gray-700 bg-gray-800 text-sm rounded overflow-hidden">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-2">{t("name", "Name")}</th>
            <th className="p-2">{t("email", "Email")}</th>
            <th className="p-2">{t("role", "Role")}</th>
            <th className="p-2">{t("banned", "Banned")}</th>
            <th className="p-2">{t("lastLogin", "Last Login")}</th>
            <th className="p-2">{t("ip", "IP")}</th>
            <th className="p-2">{t("logins", "Logins")}</th>
            <th className="p-2">{t("action", "Action")}</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u) => (
            <React.Fragment key={u._id}>
              <tr className="border-t border-gray-600">
                <td className="p-2">
                  {u.firstName} {u.lastName}
                </td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.isBanned ? "✅" : "❌"}</td>
                <td className="p-2">
                  {u.lastLogin?.date
                    ? new Date(u.lastLogin.date).toLocaleString("en-GB", {
                        timeZone: "Asia/Jerusalem",
                      })
                    : "-"}
                </td>
                <td className="p-2">{u.lastLogin?.ip || "-"}</td>
                <td className="p-2">
                  <button
                    onClick={() =>
                      setExpandedUserId(expandedUserId === u._id ? null : u._id)
                    }
                    className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 text-xs rounded"
                  >
                    {expandedUserId === u._id
                      ? t("hide", "Hide")
                      : t("view", "View")}
                  </button>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleBanToggle(u._id, u.isBanned)}
                    className={`${
                      u.isBanned
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white px-2 py-1 text-xs rounded`}
                  >
                    {u.isBanned ? t("unban") : t("ban")}
                  </button>
                </td>
              </tr>
              {expandedUserId === u._id && (
                <tr>
                  <td colSpan={8} className="bg-gray-900 text-xs p-4">
                    <p className="font-semibold mb-2">
                      {t("Login History", "היסטוריית כניסות")}:
                    </p>
                    {u.loginHistory?.length ? (
                      <ul className="space-y-1">
                        {u.loginHistory.map((entry, i) => (
                          <li key={i} className="text-gray-300">
                            🕓{" "}
                            {new Date(entry.date).toLocaleString("en-GB", {
                              timeZone: "Asia/Jerusalem",
                            })}{" "}
                            — 🧭 {entry.ip}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 italic">
                        {t("No login history.", "אין היסטוריית כניסות.")}{" "}
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-6 text-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded"
        >
          {t("prev", "Previous")}
        </button>
        <span>
          {t("page")} {currentPage} {t("of")}{" "}
          {Math.ceil(filteredUsers.length / usersPerPage)}
        </span>
        <button
          disabled={startIndex + usersPerPage >= filteredUsers.length}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded"
        >
          {t("next", "Next")}
        </button>
      </div>

      {/* Contact Info Editor */}
      <div className="mt-10 border border-gray-700 bg-gray-800 p-6 rounded">
        <h2 className="text-xl font-bold mb-4">
          {t("contactInfo", "Public Contact Info")}
        </h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">
            {t("publicEmail", "Public Email")}
          </label>
          <input
            type="email"
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">
            {t("socialLinks", "Social Links")}
          </label>
          {socials.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 p-2 bg-gray-700 rounded border border-gray-600"
                placeholder={t("platform", "Platform")}
                value={s.platform}
                onChange={(e) => updateSocial(i, "platform", e.target.value)}
              />
              <input
                type="text"
                className="flex-1 p-2 bg-gray-700 rounded border border-gray-600"
                placeholder={t("url", "URL")}
                value={s.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
              />
              <button
                className="text-red-400 hover:text-red-600"
                onClick={() => removeSocial(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            className="text-blue-400 hover:underline text-sm mt-2"
            onClick={() => setSocials([...socials, { platform: "", url: "" }])}
          >
            + {t("addSocial", "Add Social")}
          </button>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          onClick={handleSaveContactInfo}
        >
          {t("save", "Save")}
        </button>

        {saveStatus && (
          <p className="mt-2 text-sm text-green-400">{saveStatus}</p>
        )}
      </div>
    </div>
  );
}

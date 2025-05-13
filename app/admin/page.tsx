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

interface Social {
  platform: string;
  url: string;
}

interface Skill {
  _id: string;
  name: string;
  category: string;
}

export default function AdminPage() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [socials, setSocials] = useState<Social[]>([]);
  const [saveStatus, setSaveStatus] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("frontend");
  const [newSkill, setNewSkill] = useState("");

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillStatus, setSkillStatus] = useState("");

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const [userRes, contactRes, skillsRes] = await Promise.all([
        axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/contact-info", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/skills"),
      ]);

      const sortedUsers = userRes.data.users.sort((a: User, b: User) => {
        const aTime = a.lastLogin?.date
          ? new Date(a.lastLogin.date).getTime()
          : 0;
        const bTime = b.lastLogin?.date
          ? new Date(b.lastLogin.date).getTime()
          : 0;
        return bTime - aTime;
      });

      setUsers(sortedUsers);
      setContactEmail(contactRes.data.email || "");
      setSocials(contactRes.data.socials || []);
      setSkills(skillsRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setSkillsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleBanToggle = async (userId: string, isBanned: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/admin/users",
        { userId, isBanned: !isBanned },
        {
          headers: { Authorization: `Bearer ${token}` },
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
      updated[i] = { ...updated[i], [field]: value };
      return updated;
    });
  };

  const removeSocial = (i: number) => {
    setSocials((prev) => prev.filter((_, idx) => idx !== i));
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

  const handleAddSkill = async () => {
    try {
      setSkillStatus(""); // Reset status before sending request
      const response = await axios.post("/api/skills", {
        name: newSkill.trim(), // Trim to remove unnecessary spaces
        category: newSkillCategory, // Category selected by the user
      });

      // Handle successful response
      setSkills((prevSkills) => [...prevSkills, response.data]); // Add to list
      setNewSkill(""); // Clear input field

      setSkillStatus("✅ Skill added!");
    } catch (error) {
      console.error("Failed to add skill:", error);
      setSkillStatus("❌ Failed to add skill");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await axios.delete(`/api/skills/${id}`);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete skill error:", err);
    }
  };

  // Group skills by category
  const groupSkills = (skills: Skill[]) => {
    const grouped: Record<string, Skill[]> = {}; // Define type explicitly
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });
    return grouped;
  };

  const categoryEmojis: Record<string, string> = {
    frontend: "🖥️",
    backend: "🧠",
    devops: "⚙️",
    database: "🗄️",
    mobile: "📱",
    tools: "🛠️",
    other: "🌀",
  };

  if (!user || user.role !== "admin") {
    return (
      <p className="text-red-400 text-center mt-10">
        {t("unauthorized", "Unauthorized")}
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-white text-sm">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t("adminPanel", "Admin Panel")}
      </h1>

      {/* --- USER MANAGEMENT --- */}
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
        <thead className="bg-gray-700">
          <tr>
            <th className="p-2">{t("name")}</th>
            <th className="p-2">{t("email")}</th>
            <th className="p-2">{t("role")}</th>
            <th className="p-2">{t("banned")}</th>
            <th className="p-2">{t("lastLogin")}</th>
            <th className="p-2">{t("ip")}</th>
            <th className="p-2">{t("action")}</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(
              (u) =>
                u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((u) => (
              <tr key={u._id}>
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
            ))}
        </tbody>
      </table>

      {/* --- CONTACT INFO --- */}
      <div className="mt-10 border border-gray-700 bg-gray-800 p-6 rounded">
        <h2 className="text-xl font-bold mb-4">{t("contactInfo")}</h2>
        <input
          type="email"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          placeholder={t("publicEmail")}
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        {socials.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded"
              placeholder="Platform"
              value={s.platform}
              onChange={(e) => updateSocial(i, "platform", e.target.value)}
            />
            <input
              type="text"
              className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded"
              placeholder="URL"
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
          + {t("addsocial")}
        </button>

        <div className="flex justify-end mt-4 ltr">
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            onClick={handleSaveContactInfo}
          >
            {t("save")}
          </button>
        </div>
        {saveStatus && (
          <p className="mt-2 text-sm text-green-400">{saveStatus}</p>
        )}
      </div>

      {/* --- SKILLS MANAGEMENT --- */}
      <div className="mt-10 border border-gray-700 bg-gray-800 p-6 rounded">
        <h2 className="text-xl font-bold mb-4">{t("skills", "Skills")}</h2>

        {/* Skill input and category select */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder={t("skillname")}
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 p-2 bg-gray-700 rounded border border-gray-600"
          />
          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value)}
            className="p-2 bg-gray-700 rounded border border-gray-600"
          >
            <option value="frontend">🖥️ Frontend</option>
            <option value="backend">🧠 Backend</option>
            <option value="devops">⚙️ DevOps</option>
            <option value="database">🗄️ Database</option>
            <option value="mobile">📱 Mobile</option>
            <option value="tools">🛠️ Tools</option>
            <option value="other">🌀 Other</option>
          </select>
          <button
            onClick={handleAddSkill}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {t("add")}
          </button>
        </div>

        {skillsLoading ? (
          <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
        ) : (
          // Grouped skills by category
          Object.entries(groupSkills(skills)).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">
                {categoryEmojis[category] || "🔹"} {t(category)}
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {items.map((skill) => (
                  <li
                    key={skill._id || skill.name}
                    className="flex justify-between items-center"
                  >
                    {skill.name}
                    <button
                      onClick={() => handleDeleteSkill(skill._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
        {skillStatus && (
          <p className="text-sm text-green-400 mt-2">{skillStatus}</p>
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./components/AdminSideBar";
import UserManagement from "./components/UserManagement";
import ContactInfo from "./components/ContactInfo";
import SkillsSection from "./components/SkillsSection";
import Visitors from "./components/Visitors";
import Dashboard from "./components/Dashboard";
import ProjectAnalytics from "./components/ProjectAnalytics";
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
  lastLogin?: { date: string; ip: string };
  loginHistory: { date: string; ip: string }[];
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

interface Visitor {
  ip: string;
  visitCount: number;
  lastVisit: string;
}

export default function AdminPage() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [contactEmail, setContactEmail] = useState("");
  const [socials, setSocials] = useState<Social[]>([]);
  const [saveStatus, setSaveStatus] = useState("");

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("frontend");
  const [skillStatus, setSkillStatus] = useState("");

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorsLoading, setVisitorsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const [userRes, contactRes, skillsRes, visitorsRes] = await Promise.all(
          [
            axios.get("/api/admin/users", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("/api/admin/contact-info", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("/api/skills"),
            axios.get("/api/admin/visitors", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]
        );

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
        setVisitors(visitorsRes.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setSkillsLoading(false);
        setVisitorsLoading(false);
      }
    };

    fetchAll();

    // Listen for custom events from dashboard quick actions
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener("adminTabChange", handleTabChange as EventListener);

    return () => {
      window.removeEventListener(
        "adminTabChange",
        handleTabChange as EventListener
      );
    };
  }, [isMounted]);

  if (!isMounted) return null;
  if (!user || user.role !== "admin") {
    return (
      <p className="text-red-400 text-center mt-10">
        {t("unauthorized", "Unauthorized")}
      </p>
    );
  }

  const handleBanToggle = async (userId: string, isBanned: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/admin/users",
        { userId, isBanned: !isBanned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: !isBanned } : u))
      );
    } catch (err) {
      console.error("Failed to update user ban status", err);
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/contact-info",
        { email: contactEmail, socials },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaveStatus(t("contactUpdated", "✅ Contact info updated!"));
    } catch (err) {
      console.error(err);
      setSaveStatus(t("saveFailed", "Failed to save contact info"));
    }
  };

  const handleAddSkill = async () => {
    try {
      setSkillStatus("");
      const res = await axios.post("/api/skills", {
        name: newSkill.trim(),
        category: newSkillCategory,
      });
      setSkills((prev) => [...prev, res.data]);
      setNewSkill("");
      setSkillStatus("✅ Skill added!");
    } catch (err) {
      console.error("Failed to add skill:", err);
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

  return (
    <main className="min-h-screen text-white bg-gray-900">
      {/* Responsive Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSidebarToggle={setSidebarCollapsed}
      />

      {/* Main content area - positioned properly for desktop sidebar */}
      <section
        className={`transition-all duration-300 p-3 sm:p-6 pt-20 md:pt-4 ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
          {t("adminPanel", "Admin Panel")}
        </h1>

        {activeTab === "users" && (
          <UserManagement
            users={users.filter(
              (u) =>
                u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            onBanToggle={handleBanToggle}
          />
        )}

        {activeTab === "contact" && (
          <ContactInfo
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
            socials={socials}
            setSocials={setSocials}
            onSave={handleSaveContactInfo}
            saveStatus={saveStatus}
          />
        )}

        {activeTab === "skills" && (
          <SkillsSection
            skills={skills}
            skillsLoading={skillsLoading}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            newSkillCategory={newSkillCategory}
            setNewSkillCategory={setNewSkillCategory}
            onAddSkill={handleAddSkill}
            onDeleteSkill={handleDeleteSkill}
            status={skillStatus}
          />
        )}

        {activeTab === "visitors" && (
          <Visitors visitors={visitors} loading={visitorsLoading} />
        )}

        {activeTab === "project-analytics" && <ProjectAnalytics />}

        {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
      </section>
    </main>
  );
}

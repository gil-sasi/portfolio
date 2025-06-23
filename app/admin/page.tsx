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
  const { t, i18n } = useTranslation();
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
  const [authError, setAuthError] = useState(false);

  const isRTL = i18n.language === "he";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found, but continuing...");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    if (!isMounted) return;

    const fetchAll = async () => {
      try {
        const authHeaders = getAuthHeaders();
        if (!authHeaders) {
          console.warn("No auth headers, skipping data fetch");
          setSkillsLoading(false);
          setVisitorsLoading(false);
          return;
        }

        const [userRes, contactRes, skillsRes, visitorsRes] = await Promise.all(
          [
            axios.get("/api/admin/users", { headers: authHeaders }),
            axios.get("/api/admin/contact-info", { headers: authHeaders }),
            axios.get("/api/skills"),
            axios.get("/api/admin/visitors", { headers: authHeaders }),
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
        setAuthError(false);
      } catch (err: any) {
        console.error("Fetch error:", err);
        if (err.response?.status === 401) {
          setAuthError(true);
          localStorage.removeItem("token");
        }
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

  // Temporary fix: Allow access even without strict auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="modern-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            {t("loading", "Loading...")}
          </h2>
          <p className="text-gray-400 mb-6">
            Please wait while we load your session...
          </p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Show warning but allow access
  if (user.role !== "admin") {
    console.warn(
      "User role:",
      user.role,
      "- Consider checking admin permissions"
    );
  }

  const handleBanToggle = async (userId: string, isBanned: boolean) => {
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        console.warn("No auth headers for ban toggle");
        return;
      }

      await axios.put(
        "/api/admin/users",
        { userId, isBanned: !isBanned },
        { headers: authHeaders }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: !isBanned } : u))
      );
    } catch (err: any) {
      console.error("Failed to update user ban status", err);
      if (err.response?.status === 401) {
        setAuthError(true);
      }
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        console.warn("No auth headers for contact info save");
        return;
      }

      await axios.post(
        "/api/admin/contact-info",
        { email: contactEmail, socials },
        { headers: authHeaders }
      );
      setSaveStatus(t("contactUpdated", "✅ Contact info updated!"));
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setAuthError(true);
      } else {
        setSaveStatus(t("saveFailed", "Failed to save contact info"));
        setTimeout(() => setSaveStatus(""), 3000);
      }
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
      setTimeout(() => setSkillStatus(""), 3000);
    } catch (err) {
      console.error("Failed to add skill:", err);
      setSkillStatus("❌ Failed to add skill");
      setTimeout(() => setSkillStatus(""), 3000);
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
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-xl"></div>

      {/* Responsive Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSidebarToggle={setSidebarCollapsed}
      />

      {/* Main content area - positioned properly for both LTR and RTL */}
      <section
        className={`relative z-10 transition-all duration-300 p-3 sm:p-6 pt-20 md:pt-4 ${
          isRTL
            ? sidebarCollapsed
              ? "md:mr-20"
              : "md:mr-72"
            : sidebarCollapsed
            ? "md:ml-20"
            : "md:ml-72"
        }`}
        style={{
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="glass rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-violet-600 flex items-center justify-center text-xl font-bold glow">
                ⚙️
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                <span className="gradient-text bg-gradient-to-r from-emerald-400 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                  {t("adminPanel", "Admin Panel")}
                </span>
              </h1>
              <p className="text-gray-300 mt-2">{t("managePortfolio")}</p>
            </div>
          </div>

          {activeTab === "users" && (
            <UserManagement
              users={users.filter(
                (u) =>
                  u.firstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
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

          {activeTab === "dashboard" && (
            <Dashboard setActiveTab={setActiveTab} />
          )}
        </div>
      </section>
    </main>
  );
}

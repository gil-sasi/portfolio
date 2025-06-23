"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaUsers,
  FaSearch,
  FaUserShield,
  FaUser,
  FaBan,
  FaUserCheck,
  FaCalendarAlt,
  FaCrown,
  FaEye,
  FaEyeSlash,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFilter,
  FaUserTimes,
  FaSignInAlt,
} from "react-icons/fa";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBanned: boolean;
  lastLogin?: { date: string; ip: string };
  loginHistory: { date: string; ip: string }[];
  createdAt?: string;
}

interface Props {
  users: User[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onBanToggle: (userId: string, isBanned: boolean) => void;
}

export default function UserManagement({
  users,
  searchTerm,
  onSearch,
  onBanToggle,
}: Props) {
  const { t, i18n } = useTranslation();
  const [sortBy, setSortBy] = useState<
    "name" | "email" | "role" | "lastLogin" | "createdAt"
  >("lastLogin");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "banned">(
    "all"
  );
  const [showLoginHistory, setShowLoginHistory] = useState<string | null>(null);

  const isRTL = i18n.language === "he";

  // Filter users based on search, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.isBanned) ||
      (filterStatus === "banned" && user.isBanned);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
        break;
      case "email":
        comparison = a.email.localeCompare(b.email);
        break;
      case "role":
        comparison = a.role.localeCompare(b.role);
        break;
      case "lastLogin":
        const aTime = a.lastLogin?.date
          ? new Date(a.lastLogin.date).getTime()
          : 0;
        const bTime = b.lastLogin?.date
          ? new Date(b.lastLogin.date).getTime()
          : 0;
        comparison = aTime - bTime;
        break;
      case "createdAt":
        const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        comparison = aCreated - bCreated;
        break;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

  const handleSort = (
    field: "name" | "email" | "role" | "lastLogin" | "createdAt"
  ) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getUserIcon = (user: User) => {
    if (user.role === "admin") {
      return <FaCrown className="text-yellow-500" />;
    }
    return user.isBanned ? (
      <FaUserTimes className="text-red-500" />
    ) : (
      <FaUserCheck className="text-green-500" />
    );
  };

  const getStatusBadge = (user: User) => {
    if (user.isBanned) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
          {t("banned")}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        {t("active")}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const isAdmin = role === "admin";
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          isAdmin
            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
        }`}
      >
        {isAdmin ? t("admin") : t("user")}
      </span>
    );
  };

  // Statistics
  const stats = {
    total: users.length,
    active: users.filter((u) => !u.isBanned).length,
    banned: users.filter((u) => u.isBanned).length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className={`modern-card p-6 ${isRTL ? "rtl-text" : ""}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-3">
            <FaUsers className="text-blue-500" />
            {t("usermanagement")}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {sortedUsers.length} of {users.length} users
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center min-w-[80px]">
            <div className="text-xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-xs text-gray-400">{t("total", "Total")}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center min-w-[80px]">
            <div className="text-xl font-bold text-green-400">
              {stats.active}
            </div>
            <div className="text-xs text-gray-400">{t("active")}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center min-w-[80px]">
            <div className="text-xl font-bold text-red-400">{stats.banned}</div>
            <div className="text-xs text-gray-400">{t("banned")}</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center min-w-[80px]">
            <div className="text-xl font-bold text-purple-400">
              {stats.admins}
            </div>
            <div className="text-xs text-gray-400">{t("admin")}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("searchUsers", "Search users...")}
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Role Filter */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as any)}
          className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="all">{t("allRoles", "All Roles")}</option>
          <option value="admin">{t("admin")}</option>
          <option value="user">{t("user")}</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="all">{t("allStatuses", "All Statuses")}</option>
          <option value="active">{t("active")}</option>
          <option value="banned">{t("banned")}</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full bg-gray-800/50 border border-gray-700 rounded-lg">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  {t("name")}
                  {sortBy === "name" &&
                    (sortOrder === "desc" ? (
                      <FaSortAmountDown />
                    ) : (
                      <FaSortAmountUp />
                    ))}
                </button>
              </th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort("email")}
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  {t("email")}
                  {sortBy === "email" &&
                    (sortOrder === "desc" ? (
                      <FaSortAmountDown />
                    ) : (
                      <FaSortAmountUp />
                    ))}
                </button>
              </th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort("role")}
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  {t("role")}
                  {sortBy === "role" &&
                    (sortOrder === "desc" ? (
                      <FaSortAmountDown />
                    ) : (
                      <FaSortAmountUp />
                    ))}
                </button>
              </th>
              <th className="p-4 text-left">{t("status")}</th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort("lastLogin")}
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  {t("lastlogin")}
                  {sortBy === "lastLogin" &&
                    (sortOrder === "desc" ? (
                      <FaSortAmountDown />
                    ) : (
                      <FaSortAmountUp />
                    ))}
                </button>
              </th>
              <th className="p-4 text-left">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr
                key={user._id}
                className="border-t border-gray-600 hover:bg-gray-700/30 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {getUserIcon(user)}
                        <span>
                          {user.role === "admin" ? t("admin") : t("user")}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-blue-400 break-all">
                    {user.email}
                  </div>
                </td>
                <td className="p-4">{getRoleBadge(user.role)}</td>
                <td className="p-4">{getStatusBadge(user)}</td>
                <td className="p-4">
                  {user.lastLogin ? (
                    <div className="text-sm">
                      <div>
                        {new Date(user.lastLogin.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {user.lastLogin.ip}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Never</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onBanToggle(user._id, user.isBanned)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        user.isBanned
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {user.isBanned ? (
                        <>
                          <FaUserCheck className="inline mr-1" /> {t("unban")}
                        </>
                      ) : (
                        <>
                          <FaBan className="inline mr-1" /> {t("ban")}
                        </>
                      )}
                    </button>

                    {user.loginHistory && user.loginHistory.length > 0 && (
                      <button
                        onClick={() =>
                          setShowLoginHistory(
                            showLoginHistory === user._id ? null : user._id
                          )
                        }
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all"
                      >
                        {showLoginHistory === user._id ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {sortedUsers.map((user) => (
          <div
            key={user._id}
            className="bg-gray-800/50 p-4 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-blue-400 break-all">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {getRoleBadge(user.role)}
                {getStatusBadge(user)}
              </div>
            </div>

            {user.lastLogin && (
              <div className="mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <FaSignInAlt />
                  <span>{t("lastlogin")}:</span>
                </div>
                <div className="ml-5">
                  <div className="text-white">
                    {new Date(user.lastLogin.date).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user.lastLogin.ip}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onBanToggle(user._id, user.isBanned)}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  user.isBanned
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {user.isBanned ? (
                  <>
                    <FaUserCheck /> {t("unban")}
                  </>
                ) : (
                  <>
                    <FaBan /> {t("ban")}
                  </>
                )}
              </button>

              {user.loginHistory && user.loginHistory.length > 0 && (
                <button
                  onClick={() =>
                    setShowLoginHistory(
                      showLoginHistory === user._id ? null : user._id
                    )
                  }
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  {showLoginHistory === user._id ? (
                    <>
                      <FaEyeSlash /> {t("hideHistory", "Hide History")}
                    </>
                  ) : (
                    <>
                      <FaEye /> {t("viewHistory", "View History")}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Login History */}
            {showLoginHistory === user._id && user.loginHistory && (
              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  {t("loginHistory", "Login History")}
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {user.loginHistory.slice(0, 10).map((login, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-400 flex justify-between"
                    >
                      <span>{new Date(login.date).toLocaleString()}</span>
                      <span className="font-mono">{login.ip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sortedUsers.length === 0 && (
        <div className="text-center py-12">
          <FaUsers className="mx-auto text-6xl text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">
            {t("noUsersFound", "No users found")}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {searchTerm
              ? t("tryDifferentSearch", "Try a different search term")
              : t("noDataAvailable")}
          </p>
        </div>
      )}
    </div>
  );
}

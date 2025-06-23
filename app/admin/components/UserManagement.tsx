"use client";
import React from "react";
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
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 p-3 sm:p-6 rounded border border-gray-700">
      <h2 className="text-lg sm:text-xl font-bold mb-4">
        {t("usermanagement")}
      </h2>

      {/* Search Input - Mobile Optimized */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={t("searchusers", "Search users...")}
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full p-3 sm:p-2 bg-gray-700 rounded border border-gray-600 text-base sm:text-sm"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm bg-gray-900 border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left">{t("name")}</th>
              <th className="p-3 text-left">{t("email")}</th>
              <th className="p-3 text-left">{t("role")}</th>
              <th className="p-3 text-left">{t("status")}</th>
              <th className="p-3 text-left">{t("lastlogin")}</th>
              <th className="p-3 text-left">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-gray-600">
                <td className="p-3">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-3 break-all">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.role === "admin"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.isBanned
                        ? "bg-red-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {user.isBanned ? t("banned") : t("active")}
                  </span>
                </td>
                <td className="p-3 text-xs">
                  {user.lastLogin ? (
                    <div>
                      <div>
                        {new Date(user.lastLogin.date).toLocaleDateString()}
                      </div>
                      <div className="text-gray-400">{user.lastLogin.ip}</div>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onBanToggle(user._id, user.isBanned)}
                    className={`px-3 py-1 rounded text-xs transition ${
                      user.isBanned
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {user.isBanned ? t("unban") : t("ban")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-900 p-4 rounded border border-gray-600"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-blue-400 break-all">{user.email}</p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.role === "admin"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {user.role}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.isBanned
                      ? "bg-red-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {user.isBanned ? t("banned") : t("active")}
                </span>
              </div>
            </div>

            {user.lastLogin && (
              <div className="mb-3 text-sm text-gray-300">
                <div className="text-gray-400 text-xs">{t("lastlogin")}:</div>
                <div>{new Date(user.lastLogin.date).toLocaleDateString()}</div>
                <div className="text-gray-400 text-xs">{user.lastLogin.ip}</div>
              </div>
            )}

            <button
              onClick={() => onBanToggle(user._id, user.isBanned)}
              className={`w-full px-4 py-2 rounded transition font-medium ${
                user.isBanned
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {user.isBanned ? t("unban") : t("ban")}
            </button>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <p className="text-center text-gray-400 py-8">
          {t("nousers", "No users found")}
        </p>
      )}
    </div>
  );
}

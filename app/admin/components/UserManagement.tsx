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
  lastLogin?: {
    date?: string;
    ip?: string;
  };
}

interface UserManagementProps {
  users: User[];
  onSearch: (value: string) => void;
  searchTerm: string;
  onBanToggle: (id: string, isBanned: boolean) => void;
}

export default function UserManagement({
  users,
  onSearch,
  searchTerm,
  onBanToggle,
}: UserManagementProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
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
          {users.map((u) => (
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
                  onClick={() => onBanToggle(u._id, u.isBanned)}
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
    </div>
  );
}

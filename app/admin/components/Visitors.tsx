"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Visitor {
  ip: string;
  visitCount: number;
  lastVisit: string;
  firstVisit?: string;
  country?: string;
  userAgent?: string;
  referrer?: string;
  isValidVisitor?: boolean;
}

interface Props {
  visitors: Visitor[];
  loading: boolean;
}

// Helper function to extract browser name from user agent
const getBrowserName = (userAgent: string): string => {
  if (!userAgent) return "Unknown";

  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Opera")) return "Opera";

  return "Other";
};

// Helper function to get device type from user agent
const getDeviceType = (userAgent: string): string => {
  if (!userAgent) return "Unknown";

  if (
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )
  ) {
    return "Mobile";
  }

  return "Desktop";
};

export default function Visitors({ visitors, loading }: Props) {
  const { t } = useTranslation();
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  // Filter out invalid visitors for cleaner display
  const validVisitors = visitors.filter((v) => v.isValidVisitor !== false);
  const invalidCount = visitors.length - validVisitors.length;

  // Check if migration is needed (visitors with missing userAgent or firstVisit)
  const needsMigration = visitors.some((v) => !v.userAgent || !v.firstVisit);

  const handleMigration = async () => {
    if (
      !window.confirm(
        "This will update existing visitor records to include missing fields. Continue?"
      )
    ) {
      return;
    }

    setIsMigrating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/visitors?migrate=true", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Migration completed successfully!");
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        throw new Error("Migration failed");
      }
    } catch (error) {
      console.error("Migration error:", error);
      alert("Migration failed. Please try again.");
    } finally {
      setIsMigrating(false);
    }
  };

  const handleCleanup = async () => {
    if (
      !window.confirm(
        "Are you sure you want to remove all invalid visitor records? This cannot be undone."
      )
    ) {
      return;
    }

    setIsCleaningUp(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/visitors?cleanup=true", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Cleanup completed successfully!");
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        throw new Error("Cleanup failed");
      }
    } catch (error) {
      console.error("Cleanup error:", error);
      alert("Cleanup failed. Please try again.");
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="bg-gray-800 p-3 sm:p-6 rounded border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold">
          {t("visitors", "Visitors")}
        </h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            {validVisitors.length} / {visitors.length} valid
            {invalidCount > 0 && (
              <span className="text-red-400 ml-1">
                ({invalidCount} invalid)
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {needsMigration && (
              <button
                onClick={handleMigration}
                disabled={isMigrating}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-sm rounded transition-colors"
              >
                {isMigrating ? "Migrating..." : "Migrate Data"}
              </button>
            )}
            {invalidCount > 0 && (
              <button
                onClick={handleCleanup}
                disabled={isCleaningUp}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-sm rounded transition-colors"
              >
                {isCleaningUp ? "Cleaning..." : "Clean Up"}
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <table className="w-full text-sm bg-gray-900 border border-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-2 text-left">{t("ip")}</th>
                  <th className="p-2 text-center">{t("visits")}</th>
                  <th className="p-2 text-left">{t("country")}</th>
                  <th className="p-2 text-left">Browser</th>
                  <th className="p-2 text-left">Device</th>
                  <th className="p-2 text-left">{t("lastvisit")}</th>
                  <th className="p-2 text-left">First Visit</th>
                </tr>
              </thead>
              <tbody>
                {validVisitors.map((v, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-600 hover:bg-gray-800"
                  >
                    <td className="p-2 font-mono text-blue-400">{v.ip}</td>
                    <td className="p-2 text-center font-semibold">
                      {v.visitCount ?? "–"}
                    </td>
                    <td className="p-2">{v.country || "–"}</td>
                    <td className="p-2">{getBrowserName(v.userAgent || "")}</td>
                    <td className="p-2">{getDeviceType(v.userAgent || "")}</td>
                    <td className="p-2 text-xs">
                      {v.lastVisit
                        ? new Date(v.lastVisit).toLocaleString("en-GB", {
                            timeZone: "Asia/Jerusalem",
                          })
                        : "–"}
                    </td>
                    <td className="p-2 text-xs">
                      {v.firstVisit
                        ? new Date(v.firstVisit).toLocaleString("en-GB", {
                            timeZone: "Asia/Jerusalem",
                          })
                        : v.lastVisit
                        ? new Date(v.lastVisit).toLocaleString("en-GB", {
                            timeZone: "Asia/Jerusalem",
                          })
                        : "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-4">
            {validVisitors.map((v, i) => (
              <div
                key={i}
                className="bg-gray-900 p-4 rounded border border-gray-600"
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="col-span-2 border-b border-gray-700 pb-2 mb-2">
                    <span className="text-gray-400 text-xs">{t("ip")}:</span>
                    <div className="font-mono text-blue-400 break-all text-base">
                      {v.ip}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 text-xs">
                      {t("visits")}:
                    </span>
                    <div className="font-semibold text-green-400">
                      {v.visitCount ?? "–"}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 text-xs">
                      {t("country")}:
                    </span>
                    <div>{v.country || "–"}</div>
                  </div>

                  <div>
                    <span className="text-gray-400 text-xs">Browser:</span>
                    <div>{getBrowserName(v.userAgent || "")}</div>
                  </div>

                  <div>
                    <span className="text-gray-400 text-xs">Device:</span>
                    <div>{getDeviceType(v.userAgent || "")}</div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-gray-400 text-xs">
                      {t("lastvisit")}:
                    </span>
                    <div className="text-sm">
                      {v.lastVisit
                        ? new Date(v.lastVisit).toLocaleString("en-GB", {
                            timeZone: "Asia/Jerusalem",
                          })
                        : "–"}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-gray-400 text-xs">First Visit:</span>
                    <div className="text-sm">
                      {v.firstVisit
                        ? new Date(v.firstVisit).toLocaleString("en-GB", {
                            timeZone: "Asia/Jerusalem",
                          })
                        : v.lastVisit
                        ? new Date(v.lastVisit).toLocaleString("en-GB", {
                            timeZone: "Asia/Jerusalem",
                          })
                        : "–"}
                    </div>
                  </div>

                  {v.referrer && (
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs">Referrer:</span>
                      <div className="text-xs text-gray-300 break-all">
                        {v.referrer.length > 50
                          ? v.referrer.substring(0, 50) + "..."
                          : v.referrer}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {validVisitors.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No valid visitors found
            </div>
          )}
        </>
      )}
    </div>
  );
}

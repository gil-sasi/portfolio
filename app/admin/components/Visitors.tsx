"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaGlobe,
  FaDesktop,
  FaMobile,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaTrash,
  FaSync,
  FaDownload,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaEye,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

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
const getBrowserName = (userAgent: string, t: any): string => {
  if (!userAgent) return t("unknown", "Unknown");

  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Opera")) return "Opera";

  return t("other", "Other");
};

// Helper function to get browser icon
const getBrowserIcon = (userAgent: string) => {
  const browser = userAgent.includes("Chrome")
    ? "Chrome"
    : userAgent.includes("Firefox")
    ? "Firefox"
    : userAgent.includes("Safari") && !userAgent.includes("Chrome")
    ? "Safari"
    : userAgent.includes("Edge")
    ? "Edge"
    : "Other";
  switch (browser) {
    case "Chrome":
      return <FaChrome className="text-yellow-500" />;
    case "Firefox":
      return <FaFirefox className="text-orange-500" />;
    case "Safari":
      return <FaSafari className="text-blue-500" />;
    case "Edge":
      return <FaEdge className="text-blue-600" />;
    default:
      return <FaGlobe className="text-gray-500" />;
  }
};

// Helper function to get device type from user agent
const getDeviceType = (userAgent: string, t: any): string => {
  if (!userAgent) return t("unknown", "Unknown");

  if (
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )
  ) {
    return t("mobile", "Mobile");
  }

  return t("desktop", "Desktop");
};

// Helper function to get device icon
const getDeviceIcon = (userAgent: string) => {
  const deviceType =
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )
      ? "Mobile"
      : "Desktop";
  return deviceType === "Mobile" ? (
    <FaMobile className="text-green-500" />
  ) : (
    <FaDesktop className="text-blue-500" />
  );
};

export default function Visitors({ visitors, loading }: Props) {
  const { t, i18n } = useTranslation();
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [sortBy, setSortBy] = useState<"visits" | "lastVisit" | "country">(
    "visits"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterCountry, setFilterCountry] = useState("");
  const [showOnlyValid, setShowOnlyValid] = useState(true);

  const isRTL = i18n.language === "he";

  // Filter out invalid visitors for cleaner display
  const validVisitors = visitors.filter((v) => v.isValidVisitor !== false);
  const displayVisitors = showOnlyValid ? validVisitors : visitors;
  const invalidCount = visitors.length - validVisitors.length;

  // Filter by country if specified
  const filteredVisitors = displayVisitors.filter(
    (visitor) =>
      !filterCountry ||
      visitor.country?.toLowerCase().includes(filterCountry.toLowerCase())
  );

  // Sort visitors
  const sortedVisitors = [...filteredVisitors].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "visits":
        comparison = (a.visitCount || 0) - (b.visitCount || 0);
        break;
      case "lastVisit":
        comparison =
          new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime();
        break;
      case "country":
        comparison = (a.country || "").localeCompare(b.country || "");
        break;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

  // Get unique countries for filter dropdown
  const countries = Array.from(
    new Set(displayVisitors.map((v) => v.country).filter(Boolean))
  ).sort();

  // Check if migration is needed (visitors with missing userAgent or firstVisit)
  const needsMigration = visitors.some((v) => !v.userAgent || !v.firstVisit);

  const handleMigration = async () => {
    if (
      !window.confirm(
        t(
          "confirmMigration",
          "This will update existing visitor records to include missing fields. Continue?"
        )
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
        alert(t("migrationSuccess", "Migration completed successfully!"));
        window.location.reload();
      } else {
        throw new Error("Migration failed");
      }
    } catch (error) {
      console.error("Migration error:", error);
      alert(t("migrationFailed", "Migration failed. Please try again."));
    } finally {
      setIsMigrating(false);
    }
  };

  const handleCleanup = async () => {
    if (
      !window.confirm(
        t(
          "confirmCleanup",
          "Are you sure you want to remove all invalid visitor records? This cannot be undone."
        )
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
        alert(t("cleanupSuccess", "Cleanup completed successfully!"));
        window.location.reload();
      } else {
        throw new Error("Cleanup failed");
      }
    } catch (error) {
      console.error("Cleanup error:", error);
      alert(t("cleanupFailed", "Cleanup failed. Please try again."));
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleSort = (field: "visits" | "lastVisit" | "country") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className={`modern-card p-6 ${isRTL ? "rtl-text" : ""}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-3">
            <FaEye className="text-green-500" />
            {t("visitors")}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {sortedVisitors.length} / {visitors.length} visitors
            {invalidCount > 0 && (
              <span className="text-red-400 ml-2">
                ({invalidCount} invalid)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowOnlyValid(!showOnlyValid)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showOnlyValid
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
          >
            <FaFilter className="inline mr-2" />
            {showOnlyValid
              ? t("showAll", "Show All")
              : t("validOnly", "Valid Only")}
          </button>

          {/* Action Buttons */}
          {needsMigration && (
            <button
              onClick={handleMigration}
              disabled={isMigrating}
              className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaSync className={isMigrating ? "animate-spin" : ""} />
              {isMigrating
                ? t("migrating", "Migrating...")
                : t("migrateData", "Migrate Data")}
            </button>
          )}

          {invalidCount > 0 && (
            <button
              onClick={handleCleanup}
              disabled={isCleaningUp}
              className="btn-danger px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaTrash className={isCleaningUp ? "animate-spin" : ""} />
              {isCleaningUp
                ? t("cleaning", "Cleaning...")
                : t("cleanup", "Clean Up")}
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder={t("filterByCountry", "Filter by country...")}
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            setSortBy(field as any);
            setSortOrder(order as "asc" | "desc");
          }}
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="visits-desc">
            {t("sortByVisitsDesc", "Most Visits")}
          </option>
          <option value="visits-asc">
            {t("sortByVisitsAsc", "Least Visits")}
          </option>
          <option value="lastVisit-desc">
            {t("sortByDateDesc", "Most Recent")}
          </option>
          <option value="lastVisit-asc">{t("sortByDateAsc", "Oldest")}</option>
          <option value="country-asc">
            {t("sortByCountry", "Country A-Z")}
          </option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-b-blue-500 rounded-full animate-spin animate-reverse" />
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full bg-gray-800/50 border border-gray-700 rounded-lg">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="p-4 text-left">
                    <button
                      onClick={() => handleSort("visits")}
                      className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                    >
                      IP / {t("visits")}
                      {sortBy === "visits" &&
                        (sortOrder === "desc" ? (
                          <FaSortAmountDown />
                        ) : (
                          <FaSortAmountUp />
                        ))}
                    </button>
                  </th>
                  <th className="p-4 text-left">
                    <button
                      onClick={() => handleSort("country")}
                      className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                    >
                      <FaMapMarkerAlt /> {t("country")}
                      {sortBy === "country" &&
                        (sortOrder === "desc" ? (
                          <FaSortAmountDown />
                        ) : (
                          <FaSortAmountUp />
                        ))}
                    </button>
                  </th>
                  <th className="p-4 text-left">
                    {t("browserDevice", "Browser/Device")}
                  </th>
                  <th className="p-4 text-left">
                    <button
                      onClick={() => handleSort("lastVisit")}
                      className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                    >
                      <FaCalendarAlt /> {t("lastvisit")}
                      {sortBy === "lastVisit" &&
                        (sortOrder === "desc" ? (
                          <FaSortAmountDown />
                        ) : (
                          <FaSortAmountUp />
                        ))}
                    </button>
                  </th>
                  <th className="p-4 text-left">
                    {t("firstVisit", "First Visit")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedVisitors.map((visitor, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-600 hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {visitor.visitCount || "?"}
                        </div>
                        <div>
                          <div className="font-mono text-blue-400 text-sm">
                            {visitor.ip}
                          </div>
                          <div className="text-xs text-gray-400">
                            {visitor.visitCount || 0} {t("visits", "visits")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FaGlobe className="text-gray-400" />
                        <span>{visitor.country || "–"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getBrowserIcon(visitor.userAgent || "")}
                          <span className="text-sm">
                            {getBrowserName(visitor.userAgent || "", t)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(visitor.userAgent || "")}
                          <span className="text-sm">
                            {getDeviceType(visitor.userAgent || "", t)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {visitor.lastVisit ? (
                        <div>
                          <div>
                            {new Date(visitor.lastVisit).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(visitor.lastVisit).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {visitor.firstVisit
                        ? new Date(visitor.firstVisit).toLocaleDateString()
                        : "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {sortedVisitors.map((visitor, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-4 rounded-xl border border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {visitor.visitCount || "?"}
                    </div>
                    <div>
                      <div className="font-mono text-blue-400 text-sm">
                        {visitor.ip}
                      </div>
                      <div className="text-xs text-gray-400">
                        {visitor.visitCount || 0} {t("visits", "visits")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{visitor.country || "–"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    {getBrowserIcon(visitor.userAgent || "")}
                    <span className="text-sm">
                      {getBrowserName(visitor.userAgent || "", t)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(visitor.userAgent || "")}
                    <span className="text-sm">
                      {getDeviceType(visitor.userAgent || "", t)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
                  <div>
                    <span className="font-medium">{t("lastvisit")}:</span>
                    <div>
                      {visitor.lastVisit
                        ? new Date(visitor.lastVisit).toLocaleString()
                        : "–"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("firstVisit", "First Visit")}:
                    </span>
                    <div>
                      {visitor.firstVisit
                        ? new Date(visitor.firstVisit).toLocaleDateString()
                        : "–"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedVisitors.length === 0 && (
            <div className="text-center py-12">
              <FaEye className="mx-auto text-6xl text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                {t("noVisitorsFound", "No visitors found")}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {filterCountry
                  ? t("tryDifferentFilter", "Try a different filter")
                  : t("noDataAvailable")}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

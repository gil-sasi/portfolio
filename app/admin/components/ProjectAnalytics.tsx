"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FaChartBar,
  FaEye,
  FaUsers,
  FaGlobe,
  FaDesktop,
  FaMobile,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaSearch,
  FaSpinner,
  FaProjectDiagram,
  FaChartLine,
  FaMapMarkerAlt,
  FaUserFriends,
  FaMousePointer,
  FaClock,
  FaExternalLinkAlt,
  FaTrophy,
  FaFire,
} from "react-icons/fa";

interface ProjectStat {
  projectId: string;
  projectName: string;
  totalVisits: number;
  uniqueVisitors: number;
  lastVisit: string | null;
  countriesCount: number;
  topCountries: string[];
  averageVisitsPerUser?: number;
  bounceRate?: number;
  averageTimeOnPage?: number;
}

interface ProjectVisitor {
  ip: string;
  visitCount: number;
  lastVisit: string | null;
  firstVisit: string | null;
  country: string;
  userAgent: string;
  referrer: string;
  timeOnPage?: number;
  deviceType?: string;
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
  if (userAgent.includes("Brave")) return "Brave";

  return "Other";
};

const getBrowserIcon = (browser: string) => {
  switch (browser) {
    case "Chrome":
      return <FaChrome className="text-yellow-400" />;
    case "Firefox":
      return <FaFirefox className="text-orange-500" />;
    case "Safari":
      return <FaSafari className="text-blue-500" />;
    case "Edge":
      return <FaEdge className="text-blue-600" />;
    default:
      return <FaDesktop className="text-gray-400" />;
  }
};

const getDeviceType = (userAgent: string): string => {
  if (
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
};

export default function ProjectAnalytics() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [projectStats, setProjectStats] = useState<ProjectStat[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectVisitors, setProjectVisitors] = useState<ProjectVisitor[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [browserFilter, setBrowserFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"visits" | "lastVisit" | "country">(
    "visits"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

  const isRTL = i18n.language === "he";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchProjectStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `/api/admin/project-visitors?summary=true&timeRange=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProjectStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch project stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchProjectStats();
  }, [mounted, timeRange]);

  const fetchProjectVisitors = async (projectId: string) => {
    setLoadingVisitors(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/project-visitors?projectId=${projectId}&timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProjectVisitors(data);
      }
    } catch (error) {
      console.error("Failed to fetch project visitors:", error);
    } finally {
      setLoadingVisitors(false);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    if (selectedProject === projectId) {
      setSelectedProject(null);
      setProjectVisitors([]);
    } else {
      setSelectedProject(projectId);
      fetchProjectVisitors(projectId);
    }
  };

  // Filter and sort visitors
  const filteredAndSortedVisitors = useMemo(() => {
    const filtered = projectVisitors.filter((visitor) => {
      const matchesSearch =
        visitor.ip.includes(searchTerm) ||
        visitor.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry =
        countryFilter === "all" || visitor.country === countryFilter;
      const matchesBrowser =
        browserFilter === "all" ||
        getBrowserName(visitor.userAgent) === browserFilter;

      return matchesSearch && matchesCountry && matchesBrowser;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "visits":
          comparison = a.visitCount - b.visitCount;
          break;
        case "lastVisit":
          const aDate = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
          const bDate = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
          comparison = aDate - bDate;
          break;
        case "country":
          comparison = a.country.localeCompare(b.country);
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [
    projectVisitors,
    searchTerm,
    countryFilter,
    browserFilter,
    sortBy,
    sortOrder,
  ]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalVisits = projectStats.reduce((sum, p) => sum + p.totalVisits, 0);
    const totalUniqueVisitors = projectStats.reduce(
      (sum, p) => sum + p.uniqueVisitors,
      0
    );
    const totalCountries = new Set(projectStats.flatMap((p) => p.topCountries))
      .size;
    const mostPopularProject =
      projectStats.length > 0
        ? projectStats.reduce((max, p) =>
            p.totalVisits > max.totalVisits ? p : max
          )
        : null;

    const browsers = projectVisitors.reduce((acc, visitor) => {
      const browser = getBrowserName(visitor.userAgent);
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const countries = projectVisitors.reduce((acc, visitor) => {
      acc[visitor.country] = (acc[visitor.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const devices = projectVisitors.reduce((acc, visitor) => {
      const device = getDeviceType(visitor.userAgent);
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalVisits,
      totalUniqueVisitors,
      totalCountries,
      mostPopularProject,
      browsers: Object.entries(browsers).sort(([, a], [, b]) => b - a),
      countries: Object.entries(countries).sort(([, a], [, b]) => b - a),
      devices: Object.entries(devices).sort(([, a], [, b]) => b - a),
    };
  }, [projectStats, projectVisitors]);

  if (!mounted) return null;

  return (
    <div className={`modern-card p-6 ${isRTL ? "rtl-text" : ""}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-3">
            <FaChartBar className="text-indigo-500" />
            {t("projectanalytics", "Project Analytics")}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {t(
              "projectAnalyticsDesc",
              "Monitor project performance and visitor insights"
            )}
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as "7d" | "30d" | "all")
            }
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="7d">{t("last7Days", "Last 7 Days")}</option>
            <option value="30d">{t("last30Days", "Last 30 Days")}</option>
            <option value="all">{t("allTime", "All Time")}</option>
          </select>
          <div className="flex border border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("overview")}
              className={`px-4 py-2 transition-colors ${
                viewMode === "overview"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <FaChartLine />
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              className={`px-4 py-2 transition-colors ${
                viewMode === "detailed"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <FaUsers />
            </button>
          </div>
        </div>
      </div>

      {/* Global Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">
                {t("totalVisits", "Total Visits")}
              </p>
              <p className="text-2xl font-bold text-white">
                {analytics.totalVisits.toLocaleString()}
              </p>
            </div>
            <FaEye className="text-3xl text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">
                {t("uniquevisitors", "Unique Visitors")}
              </p>
              <p className="text-2xl font-bold text-white">
                {analytics.totalUniqueVisitors.toLocaleString()}
              </p>
            </div>
            <FaUserFriends className="text-3xl text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">
                {t("countries", "Countries")}
              </p>
              <p className="text-2xl font-bold text-white">
                {analytics.totalCountries}
              </p>
            </div>
            <FaGlobe className="text-3xl text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">
                {t("projects", "Projects")}
              </p>
              <p className="text-2xl font-bold text-white">
                {projectStats.length}
              </p>
            </div>
            <FaProjectDiagram className="text-3xl text-orange-500" />
          </div>
        </div>
      </div>

      {loadingStats ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-b-purple-500 rounded-full animate-spin animate-reverse" />
          </div>
        </div>
      ) : (
        <>
          {/* Project Statistics */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaProjectDiagram className="text-indigo-500" />
              <h3 className="text-lg font-semibold">
                {t("projectoverview", "Project Overview")}
              </h3>
              {analytics.mostPopularProject && (
                <span className="ml-auto flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  <FaTrophy className="text-xs" />
                  {t("mostPopular", "Most Popular")}:{" "}
                  {analytics.mostPopularProject.projectName}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectStats.map((stat) => (
                <div
                  key={stat.projectId}
                  className={`relative p-5 rounded-xl border cursor-pointer transition-all group ${
                    selectedProject === stat.projectId
                      ? "border-indigo-500 bg-indigo-500/10 transform scale-105"
                      : "border-gray-600 hover:border-gray-500 bg-gray-700/30 hover:bg-gray-700/50"
                  }`}
                  onClick={() => handleProjectSelect(stat.projectId)}
                >
                  {/* Popular Badge */}
                  {stat === analytics.mostPopularProject && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <FaFire className="text-xs" />
                      {t("hot", "Hot")}
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors truncate">
                      {stat.projectName}
                    </h4>
                    <FaExternalLinkAlt className="text-gray-400 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <FaMousePointer className="text-green-400" />
                      <div>
                        <div className="text-gray-400 text-xs">
                          {t("totalvisits", "Total Visits")}
                        </div>
                        <div className="font-semibold text-green-400">
                          {stat.totalVisits.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-blue-400" />
                      <div>
                        <div className="text-gray-400 text-xs">
                          {t("uniquevisitors", "Unique")}
                        </div>
                        <div className="font-semibold text-blue-400">
                          {stat.uniqueVisitors.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGlobe className="text-purple-400" />
                      <div>
                        <div className="text-gray-400 text-xs">
                          {t("countries", "Countries")}
                        </div>
                        <div className="font-semibold text-purple-400">
                          {stat.countriesCount}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-orange-400" />
                      <div>
                        <div className="text-gray-400 text-xs">
                          {t("lastVisitLabel", "Last Visit")}
                        </div>
                        <div className="text-xs text-orange-400">
                          {stat.lastVisit
                            ? new Date(stat.lastVisit).toLocaleDateString()
                            : t("never", "Never")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {stat.topCountries.length > 0 && (
                    <div className="pt-3 border-t border-gray-600">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                        <span className="text-gray-400 text-xs">
                          {t("topcountries", "Top Countries")}:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {stat.topCountries.slice(0, 3).map((country, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-gray-600/50 rounded-full text-gray-300"
                          >
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Insights */}
          {viewMode === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Top Browsers */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FaDesktop className="text-blue-500" />
                  {t("topBrowsers", "Top Browsers")}
                </h4>
                <div className="space-y-3">
                  {analytics.browsers.slice(0, 5).map(([browser, count]) => (
                    <div
                      key={browser}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {getBrowserIcon(browser)}
                        <span className="text-sm text-gray-300">{browser}</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-400">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Countries */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FaGlobe className="text-green-500" />
                  {t("topCountries", "Top Countries")}
                </h4>
                <div className="space-y-3">
                  {analytics.countries.slice(0, 5).map(([country, count]) => (
                    <div
                      key={country}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-300">{country}</span>
                      <span className="text-sm font-semibold text-green-400">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Types */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FaMobile className="text-purple-500" />
                  {t("deviceTypes", "Device Types")}
                </h4>
                <div className="space-y-3">
                  {analytics.devices.map(([device, count]) => (
                    <div
                      key={device}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {device === "Mobile" ? (
                          <FaMobile className="text-purple-400" />
                        ) : (
                          <FaDesktop className="text-blue-400" />
                        )}
                        <span className="text-sm text-gray-300">{device}</span>
                      </div>
                      <span className="text-sm font-semibold text-purple-400">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selected Project Visitors */}
          {selectedProject && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaUsers className="text-indigo-500" />
                  {t("visitorsfor", "Visitors for")}{" "}
                  <span className="text-indigo-400">
                    {
                      projectStats.find((p) => p.projectId === selectedProject)
                        ?.projectName
                    }
                  </span>
                </h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t(
                      "searchVisitors",
                      "Search by IP or country..."
                    )}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="all">
                    {t("allCountries", "All Countries")}
                  </option>
                  {Array.from(
                    new Set(projectVisitors.map((v) => v.country))
                  ).map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>

                <select
                  value={browserFilter}
                  onChange={(e) => setBrowserFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="all">
                    {t("allBrowsers", "All Browsers")}
                  </option>
                  {Array.from(
                    new Set(
                      projectVisitors.map((v) => getBrowserName(v.userAgent))
                    )
                  ).map((browser) => (
                    <option key={browser} value={browser}>
                      {browser}
                    </option>
                  ))}
                </select>

                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field as "visits" | "lastVisit" | "country");
                    setSortOrder(order as "asc" | "desc");
                  }}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="visits-desc">
                    {t("mostVisits", "Most Visits")}
                  </option>
                  <option value="lastVisit-desc">
                    {t("recentVisits", "Recent Visits")}
                  </option>
                  <option value="country-asc">
                    {t("countryAZ", "Country A-Z")}
                  </option>
                </select>
              </div>

              {loadingVisitors ? (
                <div className="flex justify-center items-center py-20">
                  <FaSpinner className="animate-spin text-4xl text-indigo-500" />
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-700/50">
                        <tr>
                          <th className="p-4 text-left">
                            {t("ipAddress", "IP Address")}
                          </th>
                          <th className="p-4 text-center">
                            {t("visits", "Visits")}
                          </th>
                          <th className="p-4 text-left">
                            {t("country", "Country")}
                          </th>
                          <th className="p-4 text-left">
                            {t("browser", "Browser")}
                          </th>
                          <th className="p-4 text-left">
                            {t("device", "Device")}
                          </th>
                          <th className="p-4 text-left">
                            {t("lastVisitLabel", "Last Visit")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedVisitors.map((visitor, i) => (
                          <tr
                            key={i}
                            className="border-t border-gray-600 hover:bg-gray-700/30 transition-colors"
                          >
                            <td className="p-4">
                              <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                                {visitor.ip}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="font-semibold px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                                {visitor.visitCount}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-purple-400" />
                                {visitor.country}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {getBrowserIcon(
                                  getBrowserName(visitor.userAgent)
                                )}
                                {getBrowserName(visitor.userAgent)}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {getDeviceType(visitor.userAgent) ===
                                "Mobile" ? (
                                  <FaMobile className="text-purple-400" />
                                ) : (
                                  <FaDesktop className="text-blue-400" />
                                )}
                                {getDeviceType(visitor.userAgent)}
                              </div>
                            </td>
                            <td className="p-4 text-xs text-gray-400">
                              {visitor.lastVisit
                                ? new Date(visitor.lastVisit).toLocaleString(
                                    i18n.language === "he" ? "he-IL" : "en-GB"
                                  )
                                : "–"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-4">
                    {filteredAndSortedVisitors.map((visitor, i) => (
                      <div
                        key={i}
                        className="bg-gray-700/50 p-4 rounded-xl border border-gray-600 hover:border-gray-500 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded text-sm">
                            {visitor.ip}
                          </span>
                          <span className="font-semibold px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            {visitor.visitCount} {t("visits", "visits")}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-purple-400" />
                            <span className="text-gray-300">
                              {visitor.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getBrowserIcon(getBrowserName(visitor.userAgent))}
                            <span className="text-gray-300">
                              {getBrowserName(visitor.userAgent)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getDeviceType(visitor.userAgent) === "Mobile" ? (
                              <FaMobile className="text-purple-400" />
                            ) : (
                              <FaDesktop className="text-blue-400" />
                            )}
                            <span className="text-gray-300">
                              {getDeviceType(visitor.userAgent)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className="text-orange-400" />
                            <span className="text-xs text-gray-400">
                              {visitor.lastVisit
                                ? new Date(
                                    visitor.lastVisit
                                  ).toLocaleDateString()
                                : "–"}
                            </span>
                          </div>
                        </div>

                        {visitor.referrer && (
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            <div className="flex items-center gap-2 mb-1">
                              <FaExternalLinkAlt className="text-gray-400 text-xs" />
                              <span className="text-gray-400 text-xs">
                                {t("referrer", "Referrer")}:
                              </span>
                            </div>
                            <div className="text-xs text-gray-300 break-all bg-gray-600/30 p-2 rounded">
                              {visitor.referrer.length > 80
                                ? visitor.referrer.substring(0, 80) + "..."
                                : visitor.referrer}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {filteredAndSortedVisitors.length === 0 && (
                    <div className="text-center py-12">
                      <FaUsers className="mx-auto text-6xl text-gray-600 mb-4" />
                      <p className="text-gray-400 text-lg">
                        {searchTerm ||
                        countryFilter !== "all" ||
                        browserFilter !== "all"
                          ? t(
                              "noMatchingVisitors",
                              "No visitors match your filters"
                            )
                          : t("noprojectvisitors", "No visitors yet")}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        {searchTerm ||
                        countryFilter !== "all" ||
                        browserFilter !== "all"
                          ? t("adjustFilters", "Try adjusting your filters")
                          : t(
                              "visitorsWillAppear",
                              "Visitors will appear here once they visit this project"
                            )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {projectStats.length === 0 && !loadingStats && (
            <div className="text-center py-12">
              <FaProjectDiagram className="mx-auto text-6xl text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-2">
                {t("noprojectvisits", "No project visits yet")}
              </p>
              <p className="text-gray-500 text-sm">
                {t(
                  "projectVisitsWillAppear",
                  "Project visits will appear here once visitors start exploring your portfolio"
                )}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

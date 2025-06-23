"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ProjectStat {
  projectId: string;
  projectName: string;
  totalVisits: number;
  uniqueVisitors: number;
  lastVisit: string | null;
  countriesCount: number;
  topCountries: string[];
}

interface ProjectVisitor {
  ip: string;
  visitCount: number;
  lastVisit: string | null;
  firstVisit: string | null;
  country: string;
  userAgent: string;
  referrer: string;
}

interface Props {
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

export default function ProjectAnalytics({ loading }: Props) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [projectStats, setProjectStats] = useState<ProjectStat[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectVisitors, setProjectVisitors] = useState<ProjectVisitor[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingVisitors, setLoadingVisitors] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchProjectStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "/api/admin/project-visitors?summary=true",
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
  }, [mounted]);

  const fetchProjectVisitors = async (projectId: string) => {
    setLoadingVisitors(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/project-visitors?projectId=${projectId}`,
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

  if (!mounted) return null;

  return (
    <div className="bg-gray-800 p-3 sm:p-6 rounded border border-gray-700">
      <h2 className="text-lg sm:text-xl font-bold mb-4">
        {t("projectanalytics")}
      </h2>

      {loadingStats ? (
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      ) : (
        <>
          {/* Project Statistics */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3">
              {t("projectoverview")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectStats.map((stat) => (
                <div
                  key={stat.projectId}
                  className={`bg-gray-900 p-4 rounded border cursor-pointer transition-colors ${
                    selectedProject === stat.projectId
                      ? "border-blue-500 bg-gray-700"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                  onClick={() => handleProjectSelect(stat.projectId)}
                >
                  <h4 className="font-semibold text-blue-400 mb-2 truncate">
                    {stat.projectName}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">{t("totalvisits")}:</span>
                      <div className="font-semibold text-green-400">
                        {stat.totalVisits}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">
                        {t("uniquevisitors")}:
                      </span>
                      <div className="font-semibold text-blue-400">
                        {stat.uniqueVisitors}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Countries:</span>
                      <div className="font-semibold">{stat.countriesCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Visit:</span>
                      <div className="text-xs">
                        {stat.lastVisit
                          ? new Date(stat.lastVisit).toLocaleDateString()
                          : "Never"}
                      </div>
                    </div>
                  </div>
                  {stat.topCountries.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <span className="text-gray-400 text-xs">
                        {t("topcountries")}:
                      </span>
                      <div className="text-xs text-gray-300">
                        {stat.topCountries.slice(0, 3).join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Project Visitors */}
          {selectedProject && (
            <div>
              <h3 className="text-md font-semibold mb-3">
                {t("visitorsfor")}{" "}
                {
                  projectStats.find((p) => p.projectId === selectedProject)
                    ?.projectName
                }
              </h3>

              {loadingVisitors ? (
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block">
                    <table className="w-full text-sm bg-gray-900 border border-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="p-2 text-left">IP</th>
                          <th className="p-2 text-center">Visits</th>
                          <th className="p-2 text-left">Country</th>
                          <th className="p-2 text-left">Browser</th>
                          <th className="p-2 text-left">Last Visit</th>
                          <th className="p-2 text-left">First Visit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectVisitors.map((visitor, i) => (
                          <tr
                            key={i}
                            className="border-t border-gray-600 hover:bg-gray-800"
                          >
                            <td className="p-2 font-mono text-blue-400">
                              {visitor.ip}
                            </td>
                            <td className="p-2 text-center font-semibold">
                              {visitor.visitCount}
                            </td>
                            <td className="p-2">{visitor.country}</td>
                            <td className="p-2">
                              {getBrowserName(visitor.userAgent)}
                            </td>
                            <td className="p-2 text-xs">
                              {visitor.lastVisit
                                ? new Date(visitor.lastVisit).toLocaleString(
                                    "en-GB",
                                    {
                                      timeZone: "Asia/Jerusalem",
                                    }
                                  )
                                : "–"}
                            </td>
                            <td className="p-2 text-xs">
                              {visitor.firstVisit
                                ? new Date(visitor.firstVisit).toLocaleString(
                                    "en-GB",
                                    {
                                      timeZone: "Asia/Jerusalem",
                                    }
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
                    {projectVisitors.map((visitor, i) => (
                      <div
                        key={i}
                        className="bg-gray-900 p-4 rounded border border-gray-600"
                      >
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="col-span-2 border-b border-gray-700 pb-2 mb-2">
                            <span className="text-gray-400 text-xs">IP:</span>
                            <div className="font-mono text-blue-400 break-all text-base">
                              {visitor.ip}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400 text-xs">
                              Visits:
                            </span>
                            <div className="font-semibold text-green-400">
                              {visitor.visitCount}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400 text-xs">
                              Country:
                            </span>
                            <div>{visitor.country}</div>
                          </div>

                          <div>
                            <span className="text-gray-400 text-xs">
                              Browser:
                            </span>
                            <div>{getBrowserName(visitor.userAgent)}</div>
                          </div>

                          <div>
                            <span className="text-gray-400 text-xs">
                              Last Visit:
                            </span>
                            <div className="text-xs">
                              {visitor.lastVisit
                                ? new Date(visitor.lastVisit).toLocaleString(
                                    "en-GB",
                                    {
                                      timeZone: "Asia/Jerusalem",
                                    }
                                  )
                                : "–"}
                            </div>
                          </div>

                          {visitor.referrer && (
                            <div className="col-span-2">
                              <span className="text-gray-400 text-xs">
                                Referrer:
                              </span>
                              <div className="text-xs text-gray-300 break-all">
                                {visitor.referrer.length > 50
                                  ? visitor.referrer.substring(0, 50) + "..."
                                  : visitor.referrer}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {projectVisitors.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      {t("noprojectvisitors")}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {projectStats.length === 0 && !loadingStats && (
            <div className="text-center py-8 text-gray-400">
              {t("noprojectvisits")}
            </div>
          )}
        </>
      )}
    </div>
  );
}

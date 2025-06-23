"use client";
import React from "react";
import { useTranslation } from "react-i18next";

interface Visitor {
  ip: string;
  visitCount: number;
  lastVisit: string;
  country?: string;
}

interface Props {
  visitors: Visitor[];
  loading: boolean;
}

export default function Visitors({ visitors, loading }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 p-3 sm:p-6 rounded border border-gray-700">
      <h2 className="text-lg sm:text-xl font-bold mb-4">
        {t("visitors", "Visitors")}
      </h2>

      {loading ? (
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-sm bg-gray-900 border border-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-2">{t("ip")}</th>
                  <th className="p-2">{t("visits")}</th>
                  <th className="p-2">{t("lastvisit")}</th>
                  <th className="p-2">{t("country")}</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v, i) => (
                  <tr key={i} className="border-t border-gray-600">
                    <td className="p-2 font-mono">{v.ip}</td>
                    <td className="p-2 text-center">{v.visitCount ?? "–"}</td>
                    <td className="p-2">
                      {v.lastVisit
                        ? new Date(v.lastVisit).toLocaleString("en-GB", {
                            timeZone: "Asia/Jerusalem",
                          })
                        : "–"}
                    </td>
                    <td className="p-2">{v.country || "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {visitors.map((v, i) => (
              <div
                key={i}
                className="bg-gray-900 p-4 rounded border border-gray-600"
              >
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400 text-xs">{t("ip")}:</span>
                    <div className="font-mono text-blue-400 break-all">
                      {v.ip}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">
                      {t("visits")}:
                    </span>
                    <div className="font-semibold">{v.visitCount ?? "–"}</div>
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
                  <div>
                    <span className="text-gray-400 text-xs">
                      {t("country")}:
                    </span>
                    <div>{v.country || "–"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

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
    <div className="bg-gray-800 p-6 rounded border border-gray-700">
      <h2 className="text-xl font-bold mb-4">{t("visitors", "Visitors")}</h2>

      {loading ? (
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      ) : (
        <table className="w-full text-sm bg-gray-900 border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2">{t("ip", "IP Address")}</th>
              <th className="p-2">{t("visits", "Visits")}</th>
              <th className="p-2">{t("lastVisit", "Last Visit")}</th>
              <th className="p-2">{t("country", "Country")}</th> {/*  */}
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
                <td className="p-2">{v.country || "–"}</td> {/*  */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

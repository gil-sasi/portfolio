"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
export default function LinkShortenerPage() {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortCode("");
    setCopied(false);

    try {
      if (!/^https?:\/\/.+\..+/.test(url)) {
        setError(t("invalidurl"));
        setLoading(false);
        return;
      }

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setShortCode(`${window.location.origin}/r/${data.shortCode}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || t("shortenerror"));
      } else {
        setError(t("shortenerror"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <Link
        href="/projects"
        className="text-blue-400 hover:underline mb-6 inline-block"
      >
        ← {t("BacktoProjects")}
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-center">
        {t("linkshortener")}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="url"
          placeholder={t("enterurl")}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-4 py-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-sm"
        >
          {loading ? t("shortening") : t("shortenurl")}
        </button>
      </form>

      {shortCode && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <p className="text-green-400">{t("shortenedlink")}:</p>
          <a
            href={shortCode}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400 break-all"
          >
            {shortCode}
          </a>
          <button
            onClick={handleCopy}
            className="text-sm bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      )}

      {error && <p className="text-red-400 mt-4">⚠️ {error}</p>}
    </div>
  );
}

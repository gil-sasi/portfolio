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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("backToProjects")}
          </Link>

          {/* Header */}
          <div className="text-center">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center text-3xl font-bold glow">
                🔗
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  {t("linkshortener")}
                </span>
              </h1>
              <p className="text-gray-300">{t("linkshortenerdesc")}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* URL Shortener Form */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                <span className="gradient-text">{t("shortenurl")}</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t("enterurl")}:
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t("shortening")}
                    </div>
                  ) : (
                    <>{t("shortenurl")} ✨</>
                  )}
                </button>
              </form>
            </div>

            {/* Result Display */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                <span className="gradient-text">{t("shortenedlink")}</span>
              </h2>

              {shortCode ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-green-400 font-medium mb-2">
                      ✅ {t("shortenedlink")}:
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href={shortCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-blue-400 hover:text-blue-300 font-mono text-sm break-all transition-colors duration-300"
                      >
                        {shortCode}
                      </a>
                      <button
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          copied
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                        }`}
                      >
                        {copied ? t("copied") + " ✓" : t("copy")}
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <a
                      href={shortCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:scale-105 transition-all duration-300"
                    >
                      {t("testLink")} 🚀
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center text-2xl">
                    🔗
                  </div>
                  <p className="text-gray-400">{t("enterUrlToStart")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="modern-card p-6">
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  ⚠️
                </div>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text">Features</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl">
                  ⚡
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-400">
                  Instant URL shortening with optimized performance
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-xl">
                  🔒
                </div>
                <h3 className="font-semibold mb-2">Secure</h3>
                <p className="text-sm text-gray-400">
                  Safe and reliable URL shortening service
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                  📊
                </div>
                <h3 className="font-semibold mb-2">Analytics Ready</h3>
                <p className="text-sm text-gray-400">
                  Built-in tracking for click analytics
                </p>
              </div>
            </div>
          </div>

          {/* How to Use Section */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                ✨ {t("keyFeatures")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-500/20 flex items-center justify-center text-xl">
                  ⚡
                </div>
                <h3 className="font-semibold text-yellow-400 mb-2">
                  {t("lightningFast")}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("instantUrlShortening")}
                </p>
              </div>
              <div className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center text-xl">
                  🔒
                </div>
                <h3 className="font-semibold text-green-400 mb-2">
                  {t("secure")}
                </h3>
                <p className="text-sm text-gray-400">{t("safeAndReliable")}</p>
              </div>
              <div className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">
                  📊
                </div>
                <h3 className="font-semibold text-blue-400 mb-2">
                  {t("analyticsReady")}
                </h3>
                <p className="text-sm text-gray-400">{t("builtInTracking")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

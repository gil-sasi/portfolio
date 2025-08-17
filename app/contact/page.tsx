"use client";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

// Spinner component while loading contact info
const Spinner = () => (
  <div className="flex justify-center py-10">
    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

interface ContactInfo {
  email: string;
  socials: { platform: string; url: string }[];
}

const platformIcons: Record<string, React.ReactElement> = {
  github: <FaGithub className="w-5 h-5" />,
  linkedin: <FaLinkedin className="w-5 h-5" />,
  whatsapp: <FaWhatsapp className="w-5 h-5" />,
};

export default function ContactPage() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [status, setStatus] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get("/api/contact-info");
        setContactInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch contact info", err);
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchInfo();

    if (user) {
      setName(`${user.firstName} ${user.lastName}`);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setStatus(t("allFieldsRequired", "All fields are required"));
      return;
    }

    if (!privacyConsent) {
      setStatus(t("privacyConsentRequired", "You must agree to the privacy policy to continue"));
      return;
    }

    try {
      await axios.post("/api/contact", { name, email, message });
      setStatus(t("messageSent", "✅ Message sent successfully!"));
      setMessage("");
      setPrivacyConsent(false);
    } catch (err) {
      console.error("Send error", err);
      setStatus(t("sendFailed", "Failed to send message. Try again."));
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          {/* Header */}
          <div className="text-center">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold glow">
                💬
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {t("contactMe")}
                </span>
              </h1>
              <p className="text-gray-300">{t("letsConnect")}</p>
            </div>
          </div>

          {/* Contact info section */}
          {loadingInfo ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            contactInfo && (
              <div className="modern-card p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
                  <span className="gradient-text">{t("getInTouch")}</span>
                </h2>

                {/* Email */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    📧
                  </div>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-blue-400 hover:text-blue-300 font-semibold text-lg transition-colors duration-300 break-all"
                  >
                    {contactInfo.email}
                  </a>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contactInfo.socials.map((s, i) => {
                    const platformKey = s.platform.toLowerCase();
                    const icon = platformIcons[platformKey] ?? null;
                    const href =
                      platformKey === "whatsapp"
                        ? `https://wa.me/${s.url.replace(/\D/g, "")}`
                        : s.url;

                    const gradients = [
                      "from-purple-500 to-pink-500",
                      "from-blue-500 to-cyan-500",
                      "from-green-500 to-emerald-500",
                      "from-orange-500 to-yellow-500",
                    ];

                    return (
                      <a
                        key={i}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass p-4 rounded-xl hover:scale-105 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                              gradients[i % gradients.length]
                            } flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            {icon || "🔗"}
                          </div>
                          <span className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                            {s.platform}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* Contact form */}
          <div className="modern-card p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
              <span className="gradient-text">{t("sendAMessage")}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!user && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      {t("yourName")}:
                    </label>
                    <input
                      type="text"
                      placeholder={t("yourName")}
                      className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      {t("yourEmail")}:
                    </label>
                    <input
                      type="email"
                      placeholder={t("yourEmail")}
                      className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {t("yourMessage")}:
                </label>
                <textarea
                  placeholder={t("yourMessage")}
                  className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 h-32 resize-none focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Privacy Policy Consent */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy-consent"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800/50 text-cyan-400 focus:ring-cyan-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-gray-900 transition-all duration-300"
                  />
                  <label htmlFor="privacy-consent" className="text-sm text-gray-300 leading-relaxed">
                    <span className="text-gray-400">
                      {t("privacyConsentText", "I have read and agree to the")}
                    </span>{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-300"
                    >
                      {t("privacyPolicy", "Privacy Policy")}
                    </a>
                    <span className="text-gray-400">
                      {t("privacyConsentSuffix", " and consent to the collection and processing of my personal data for the purpose of responding to my inquiry.")}
                    </span>
                  </label>
                </div>
                {!privacyConsent && status && status.includes("privacy") && (
                  <div className="text-red-400 text-sm ml-8">
                    {t("privacyConsentRequired", "You must agree to the privacy policy to continue")}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-4 text-lg font-semibold rounded-xl"
              >
                {t("sendMessage")} 🚀
              </button>

              {status && (
                <div
                  className={`p-4 rounded-xl text-center font-medium ${
                    status.includes("✅")
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

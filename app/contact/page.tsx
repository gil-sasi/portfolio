"use client";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";

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

    try {
      await axios.post("/api/contact", { name, email, message });
      setStatus(t("messageSent", "✅ Message sent successfully!"));
      setMessage("");
    } catch (err) {
      console.error("Send error", err);
      setStatus(t("sendFailed", "Failed to send message. Try again."));
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto text-white p-4 sm:p-6 space-y-8 sm:space-y-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          {t("contactMe")}
        </h1>

        {/* Contact info section */}
        {loadingInfo ? (
          <Spinner />
        ) : (
          contactInfo && (
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-600 shadow-md text-center">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                {t("contactInfo")}
              </h2>

              {/* Email */}
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-3">
                <svg
                  className="w-5 h-5 text-blue-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 5.25v13.5A2.25 2.25 0 0119.5 21H4.5A2.25 2.25 0 012.25 18.75V5.25A2.25 2.25 0 014.5 3h15a2.25 2.25 0 012.25 2.25z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 5.25l-9.75 6.75L2.25 5.25"
                  />
                </svg>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-blue-400 hover:underline break-all"
                >
                  {contactInfo.email}
                </a>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:justify-center gap-3 sm:gap-4 lg:gap-6">
                {contactInfo.socials.map((s, i) => {
                  const platformKey = s.platform.toLowerCase();
                  const icon = platformIcons[platformKey] ?? null;
                  const href =
                    platformKey === "whatsapp"
                      ? `https://wa.me/${s.url.replace(/\D/g, "")}`
                      : s.url;

                  return (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-blue-400 hover:underline p-3 sm:p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700/80 transition touch-manipulation"
                    >
                      {icon}
                      <span className="font-medium">{s.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )
        )}

        {/* Contact form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-800 p-4 sm:p-6 rounded border border-gray-600"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
            {t("sendMessage", "Send a Message")}
          </h2>

          {!user && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("yourName")}:
                </label>
                <input
                  type="text"
                  placeholder={t("yourName")}
                  className="w-full p-3 sm:p-3 rounded bg-gray-700 border border-gray-600 text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("yourEmail")}:
                </label>
                <input
                  type="email"
                  placeholder={t("yourEmail")}
                  className="w-full p-3 sm:p-3 rounded bg-gray-700 border border-gray-600 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("yourMessage")}:
            </label>
            <textarea
              placeholder={t("yourMessage")}
              className="w-full p-3 sm:p-3 rounded bg-gray-700 border border-gray-600 h-32 resize-none text-base"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-2 rounded font-medium text-base touch-manipulation"
          >
            {t("sendMessage")}
          </button>
          {status && (
            <p
              className={`text-sm text-center mt-2 px-2 py-1 rounded ${
                status.includes("✅")
                  ? "text-green-400 bg-green-900/20"
                  : "text-red-400 bg-red-900/20"
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";

interface ContactInfo {
  email: string;
  socials: { platform: string; url: string }[];
}

export default function ContactPage() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get("/api/contact-info");
        setContactInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch contact info", err);
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

  return (
    <div className="max-w-4xl mx-auto text-white p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center">
        {t("contactMe", "צור קשר")}
      </h1>

      {/* Contact Info Section */}
      {contactInfo && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">
            {t("contactInfo", "Contact Information")}
          </h2>

          {/* Email */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-blue-400"
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
              className="text-blue-400 hover:underline"
            >
              {contactInfo.email}
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            {contactInfo.socials.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:underline"
              >
                {s.platform === "LinkedIn" && (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 24h4V7h-4v17zM8.5 7H4.5v17h4V15c0-1.93 2.57-2.09 2.57 0v9h4V13.5c0-4.11-4.5-3.96-5.07-1.94V7z" />
                  </svg>
                )}
                {s.platform === "GitHub" && (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .5C5.373.5 0 5.873 0 12.5c0 5.292 3.438 9.787 8.205 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.042-3.338.726-4.042-1.61-4.042-1.61-.547-1.387-1.336-1.756-1.336-1.756-1.092-.746.082-.73.082-.73 1.21.084 1.846 1.243 1.846 1.243 1.072 1.836 2.81 1.306 3.495.997.108-.777.42-1.307.76-1.607-2.665-.303-5.466-1.334-5.466-5.932 0-1.31.47-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.44 11.44 0 013.003-.404c1.02.005 2.048.138 3.003.404 2.29-1.553 3.297-1.23 3.297-1.23.654 1.653.242 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.805 5.625-5.476 5.92.43.37.813 1.096.813 2.21 0 1.595-.015 2.88-.015 3.27 0 .32.217.694.825.576C20.565 22.285 24 17.79 24 12.5 24 5.873 18.627.5 12 .5z" />
                  </svg>
                )}
                {s.platform}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Message Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-800 p-6 rounded border border-gray-600"
      >
        {!user && (
          <>
            <input
              type="text"
              placeholder={t("yourName", "Your Name")}
              className="w-full p-3 rounded bg-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder={t("yourEmail", "Your Email")}
              className="w-full p-3 rounded bg-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}
        <textarea
          placeholder={t("yourMessage", "Your Message")}
          className="w-full p-3 rounded bg-gray-700 h-32 resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {t("sendMessage", "Send Message")}
        </button>
        {status && (
          <p className="text-sm text-center mt-2 text-green-400">{status}</p>
        )}
      </form>
    </div>
  );
}

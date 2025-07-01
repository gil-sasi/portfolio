"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { DecodedToken } from "../../redux/slices/authSlice";
import {
  FaBell,
  FaEnvelope,
  FaUser,
  FaClock,
  FaCheck,
  FaArrowRight,
  FaInbox,
  FaTimes,
} from "react-icons/fa";

type Message = {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  message: string;
};

interface NotificationDropdownProps {
  user: DecodedToken | null;
}

export default function NotificationDropdown({
  user,
}: NotificationDropdownProps) {
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/messages/unread-count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  }, []);

  // Fetch recent messages
  const fetchRecentMessages = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/messages/recent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecentMessages(data);
    } catch (err) {
      console.error("Failed to fetch recent messages", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data when admin is logged in
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    fetchUnreadCount();
    fetchRecentMessages();

    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchRecentMessages();
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [user, fetchUnreadCount, fetchRecentMessages]);

  // Listen for broadcasted unread count updates
  useEffect(() => {
    const handler = (e: CustomEvent<number>) => setUnreadCount(e.detail);
    const listener = (e: Event) => {
      if (e instanceof CustomEvent) handler(e);
    };
    window.addEventListener("unreadCountUpdate", listener);
    return () => window.removeEventListener("unreadCountUpdate", listener);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Handle notification toggle
  const handleNotificationToggle = () => {
    if (!dropdownOpen) {
      fetchUnreadCount();
      fetchRecentMessages();
    }
    setDropdownOpen(!dropdownOpen);
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const messageDate = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return t("justNow", "Just now");
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleNotificationToggle}
        className={`relative p-3 rounded-xl transition-all duration-300 group ${
          dropdownOpen
            ? "bg-blue-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10"
            : "hover:bg-gray-700/50 border border-transparent"
        }`}
        title={t("notifications", "Notifications")}
      >
        <FaBell
          className={`w-5 h-5 transition-all duration-300 ${
            dropdownOpen
              ? "text-blue-400 scale-110"
              : "text-gray-300 group-hover:text-white group-hover:scale-105"
          } ${unreadCount > 0 ? "animate-pulse" : ""}`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse shadow-lg shadow-red-500/30">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        {dropdownOpen && (
          <div className="absolute inset-0 bg-blue-500/20 rounded-xl animate-ping" />
        )}
      </button>

      {/* Enhanced Dropdown */}
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className={`absolute ${
            i18n.language === "he" ? "left-0" : "right-0"
          } mt-3 w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-[60] transform transition-all duration-300 animate-in slide-in-from-top-2 fade-in`}
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <FaInbox className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {t("notifications", "Notifications")}
                </h3>
                <p className="text-xs text-gray-400">
                  {unreadCount > 0
                    ? `${unreadCount} ${t("unread", "unread")}`
                    : t("allCaughtUp", "All caught up!")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDropdownOpen(false)}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <FaTimes className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">{t("loading")}</p>
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="font-medium text-gray-300 mb-2">
                  {t("nonewmessages", "No new messages")}
                </h4>
                <p className="text-sm text-gray-500">
                  {t(
                    "noMessagesDesc",
                    "You're all caught up! New messages will appear here."
                  )}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {recentMessages.map((msg, index) => (
                  <div
                    key={msg._id}
                    className={`group p-4 hover:bg-gray-800/50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-700/50 ${
                      index !== recentMessages.length - 1
                        ? "border-b border-gray-800/50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        <FaUser className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white text-sm truncate">
                            {msg.name || "Guest"}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <FaClock className="w-3 h-3" />
                            {formatTimeAgo(msg.createdAt)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-2 truncate">
                          <FaEnvelope className="w-3 h-3 inline mr-1" />
                          {msg.email}
                        </p>
                        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                          {msg.message}
                        </p>
                      </div>

                      {/* Indicator */}
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/50 bg-gray-800/30">
            <Link
              href="/admin/messages"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center justify-between w-full p-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-xl transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FaInbox className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-blue-400 text-sm">
                    {t("viewallmessages", "View all messages")}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t("manageInbox", "Manage your inbox")}
                  </p>
                </div>
              </div>
              <FaArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

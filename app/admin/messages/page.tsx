"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaTrash,
  FaEnvelopeOpen,
  FaEnvelope,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaCalendarAlt,
  FaUser,
  FaReply,
  FaArchive,
  FaSync,
} from "react-icons/fa";

type Message = {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  read: boolean;
  message: string;
};

export default function AdminMessagesPage() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [authError, setAuthError] = useState(false);

  const isRTL = i18n.language === "he";

  // Fix hydration by ensuring component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found for messages");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchMessages = async () => {
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;

      const res = await fetch("/api/messages/all", {
        headers: authHeaders,
      });

      if (res.status === 401) {
        setAuthError(true);
        localStorage.removeItem("token");
        return;
      }

      const data = await res.json();
      setMessages(data);
      setAuthError(false);
    } catch (err: any) {
      console.error("Failed to fetch messages", err);
      if (err.response?.status === 401) {
        setAuthError(true);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;

      await fetch("/api/messages/mark-read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ messageId: id }),
      });
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleBulkMarkAsRead = async () => {
    for (const id of selectedMessages) {
      await handleMarkAsRead(id);
    }
    setSelectedMessages([]);
  };

  const handleDelete = async (id: string) => {
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;

      await fetch("/api/messages/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ messageId: id }),
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      setSelectedMessages((prev) => prev.filter((msgId) => msgId !== id));
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedMessages) {
      await handleDelete(id);
    }
    setSelectedMessages([]);
  };

  const toggleMessageSelection = (id: string) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const selectAllMessages = () => {
    const visibleMessageIds = filteredAndSortedMessages.map((msg) => msg._id);
    setSelectedMessages(
      selectedMessages.length === visibleMessageIds.length
        ? []
        : visibleMessageIds
    );
  };

  useEffect(() => {
    if (!mounted) return;
    fetchMessages();
  }, [mounted]);

  // Filter and sort messages
  const filteredAndSortedMessages = messages
    .filter((msg) => {
      const matchesSearch =
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "read" && msg.read) ||
        (filterStatus === "unread" && !msg.read);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        comparison = a.name.localeCompare(b.name);
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

  // Statistics
  const stats = {
    total: messages.length,
    unread: messages.filter((m) => !m.read).length,
    read: messages.filter((m) => m.read).length,
    selected: selectedMessages.length,
  };

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="modern-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            {t("unauthorized", "Unauthorized")}
          </h2>
          <p className="text-gray-400 mb-6">
            {t(
              "sessionExpired",
              "Your session has expired. Please log in again."
            )}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="btn-primary px-6 py-3 rounded-lg font-medium"
          >
            {t("goToLogin", "Go to Login")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 ${
        isRTL ? "rtl-text" : ""
      }`}
    >
      {/* Header */}
      <div className="modern-card p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-3">
              <FaEnvelope className="text-blue-500" />
              {t("inbox", "Inbox")}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {t("manageMessages", "Manage contact messages from visitors")}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center min-w-[80px]">
              <div className="text-xl font-bold text-blue-400">
                {stats.total}
              </div>
              <div className="text-xs text-gray-400">{t("total", "Total")}</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center min-w-[80px]">
              <div className="text-xl font-bold text-orange-400">
                {stats.unread}
              </div>
              <div className="text-xs text-gray-400">
                {t("unread", "Unread")}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <FaSync className={refreshing ? "animate-spin" : ""} />
              {refreshing ? t("loading") : t("refresh", "Refresh")}
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="modern-card p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t(
                "searchMessages",
                "Search messages, names, or emails..."
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">{t("allMessages", "All Messages")}</option>
            <option value="unread">{t("unreadOnly", "Unread Only")}</option>
            <option value="read">{t("readOnly", "Read Only")}</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field as any);
              setSortOrder(order as "asc" | "desc");
            }}
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="date-desc">
              {t("newestFirst", "Newest First")}
            </option>
            <option value="date-asc">{t("oldestFirst", "Oldest First")}</option>
            <option value="name-asc">{t("nameAZ", "Name A-Z")}</option>
            <option value="name-desc">{t("nameZA", "Name Z-A")}</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedMessages.length > 0 && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-blue-400 font-medium">
                {selectedMessages.length}{" "}
                {t("messagesSelected", "messages selected")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkMarkAsRead}
                  className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <FaEnvelopeOpen />
                  {t("markAllRead", "Mark as Read")}
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                >
                  <FaTrash />
                  {t("deleteSelected", "Delete Selected")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-b-purple-500 rounded-full animate-spin animate-reverse" />
          </div>
        </div>
      ) : filteredAndSortedMessages.length === 0 ? (
        <div className="modern-card p-12 text-center">
          <FaEnvelope className="mx-auto text-6xl text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm || filterStatus !== "all"
              ? t("noMatchingMessages", "No messages match your filters")
              : t("nomessagesfound", "No messages found")}
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== "all"
              ? t(
                  "adjustMessageFilters",
                  "Try adjusting your search or filters"
                )
              : t(
                  "messagesWillAppear",
                  "Messages from visitors will appear here"
                )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select All Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={selectAllMessages}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {selectedMessages.length === filteredAndSortedMessages.length
                ? t("deselectAll", "Deselect All")
                : t("selectAll", "Select All")}
            </button>
            <span className="text-sm text-gray-400">
              {filteredAndSortedMessages.length} {t("messages", "messages")}
            </span>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {filteredAndSortedMessages.map((msg) => (
              <div
                key={msg._id}
                className={`modern-card p-6 transition-all duration-200 ${
                  msg.read
                    ? "opacity-75"
                    : "border-blue-500/30 shadow-blue-500/10 shadow-lg"
                } ${
                  selectedMessages.includes(msg._id)
                    ? "ring-2 ring-blue-500/50 bg-blue-500/5"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(msg._id)}
                    onChange={() => toggleMessageSelection(msg._id)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            msg.read ? "bg-gray-700" : "bg-blue-500/20"
                          }`}
                        >
                          <FaUser
                            className={`text-sm ${
                              msg.read ? "text-gray-400" : "text-blue-400"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {msg.name || t("guest", "Guest")}
                          </h3>
                          <p className="text-sm text-gray-400 break-all">
                            {msg.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!msg.read && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full animate-pulse">
                            {t("new", "New")}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <FaCalendarAlt />
                          {new Date(msg.createdAt).toLocaleString(
                            isRTL ? "he-IL" : "en-US"
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-4">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {!msg.read && (
                        <button
                          onClick={() => handleMarkAsRead(msg._id)}
                          className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                          <FaEnvelopeOpen />
                          {t("markasread", "Mark as Read")}
                        </button>
                      )}
                      <button
                        onClick={() =>
                          (window.location.href = `mailto:${msg.email}?subject=Re: Your message&body=Hi ${msg.name},%0D%0A%0D%0AThank you for your message.%0D%0A%0D%0ABest regards`)
                        }
                        className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <FaReply />
                        {t("reply", "Reply")}
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                      >
                        <FaTrash />
                        {t("delete", "Delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

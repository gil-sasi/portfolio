"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, MailOpen } from "lucide-react";

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
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fix hydration by ensuring component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/messages/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch("/api/messages/mark-read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch("/api/messages/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messageId: id }),
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    fetchMessages();
  }, [mounted]);

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-white">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-white border-b pb-2">
        📬 {t("inbox", "Inbox")}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {t("nomessagesfound", "No messages found")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`rounded-xl p-4 sm:p-5 transition border shadow-md ${
                msg.read
                  ? "bg-gray-800 border-gray-700 text-gray-400"
                  : "bg-gray-900 border-blue-500 shadow-blue-500/30"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div className="text-sm">
                  <p className="font-semibold text-white">
                    {msg.name || "Guest"}{" "}
                    <span className="text-gray-400 text-xs break-all">
                      &lt;{msg.email}&gt;
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                {!msg.read && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full animate-pulse self-start sm:self-center">
                    {t("new", "New")}
                  </span>
                )}
              </div>

              <div className="bg-gray-700/30 text-sm text-white px-3 sm:px-4 py-3 rounded-lg border border-gray-600 break-words">
                {msg.message}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                {!msg.read && (
                  <button
                    onClick={() => handleMarkAsRead(msg._id)}
                    className="inline-flex items-center justify-center gap-1 px-4 py-2 sm:py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition touch-manipulation"
                  >
                    <MailOpen className="w-4 h-4" />
                    {t("markasread", "Mark as Read")}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="inline-flex items-center justify-center gap-1 px-4 py-2 sm:py-1.5 rounded bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition touch-manipulation"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("delete", "Delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, Trash2, MailOpen } from "lucide-react";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchMessages();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-white">
      <h1 className="text-3xl font-extrabold mb-6 text-white border-b pb-2">
        📬 {t("inbox")}
      </h1>
      {loading ? (
        <p className="text-gray-400">{t("loadingmessage")}...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400">{t("nomessagesfound")}</p>
      ) : (
        <div className="grid gap-5">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`rounded-xl p-5 transition border shadow-md ${
                msg.read
                  ? "bg-gray-800 border-gray-700 text-gray-400"
                  : "bg-gray-900 border-blue-500 shadow-blue-500/30"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  <p className="font-semibold text-white">
                    {msg.name || "Guest"}{" "}
                    <span className="text-gray-400 text-xs">
                      &lt;{msg.email}&gt;
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                {!msg.read && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full animate-pulse">
                    {t("new")}
                  </span>
                )}
              </div>

              <div className="bg-gray-700/30 text-sm text-white px-4 py-3 rounded-lg border border-gray-600">
                {msg.message}
              </div>

              <div className="mt-4 flex gap-3">
                {!msg.read && (
                  <button
                    onClick={() => handleMarkAsRead(msg._id)}
                    className="inline-flex items-center gap-1 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition"
                  >
                    <MailOpen className="w-4 h-4" />
                    {t("markasread")}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

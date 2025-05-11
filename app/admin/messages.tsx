"use client";

import { useEffect, useState } from "react";

type Message = {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  read: boolean;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchMessages = async () => {
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

  const markAsRead = async (id: string) => {
    if (!token) return;

    try {
      const res = await fetch(`/api/messages/mark-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
        );
      } else {
        const text = await res.text();
        console.error("Failed to mark as read:", text);
      }
    } catch (err) {
      console.error("Mark as read error", err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!token) return;

    try {
      const res = await fetch(`/api/messages/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
      } else {
        const text = await res.text();
        console.error("Failed to delete message:", text);
      }
    } catch (err) {
      console.error("Delete message error", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`border rounded p-4 shadow-sm ${
                msg.read ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  {msg.name || "Guest"} &lt;{msg.email}&gt;
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-gray-800">{msg.content}</p>

              <div className="mt-3 flex gap-3 text-sm">
                {!msg.read && (
                  <button
                    onClick={() => markAsRead(msg._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(msg._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

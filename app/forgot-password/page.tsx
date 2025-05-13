"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For page navigation
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message);

      // Redirect to reset-password page
      router.push("/reset-password");
    } catch (error) {
      setError("Error sending reset email");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-2xl mb-4 text-center">Forgot Password</h2>
      {message && <p className="text-green-400">{message}</p>}
      {error && <p className="text-red-400">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Send Reset Code
        </button>
      </form>
    </div>
  );
}

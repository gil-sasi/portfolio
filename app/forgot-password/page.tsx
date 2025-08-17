"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message);
      setError("");

      // Add redirect after delay
      setTimeout(() => {
        router.push("/reset-password");
      }, 1500); // 1.5 seconds delay
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          t("resetemailerror", "Something went wrong. Please try again.")
        );
      }
      setMessage("");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6">
          {t("forgotpassword")}
        </h2>

        {message && (
          <p className="text-center text-green-400 text-sm mb-4">{message}</p>
        )}
        {error && (
          <p className="text-center text-red-400 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder={t("enteremail")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold py-3 rounded-xl"
          >
            {t("sendresetcode")}
          </button>
        </form>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

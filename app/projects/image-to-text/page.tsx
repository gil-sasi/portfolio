"use client";

import { useState, useRef, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

export default function OCRPage() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [ocrLang, setOcrLang] = useState("eng");
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const item = e.clipboardData?.items[0];
      if (item && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          handleFileSelect(file);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFileSelect = (file: File) => {
    setImage(file);
    setText("");
    setCopied(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOCR = async () => {
    if (!image) return;

    setLoading(true);
    setText("");
    setCopied(false);

    const worker = await createWorker(ocrLang);
    const {
      data: { text: extractedText },
    } = await worker.recognize(image);

    await worker.terminate();
    setText(extractedText);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-green-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-green-500 rounded-full opacity-20 float-animation"></div>
      <div
        className="absolute top-40 right-10 w-12 h-12 bg-emerald-500 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors duration-300 group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("backToProjects")}
          </Link>

          {/* Header */}
          <div className="text-center">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl font-bold glow">
                🖼️
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                  {t("ocrtitle")}
                </span>
              </h1>
              <p className="text-gray-300">{t("ocrdesc")}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                <span className="gradient-text bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Upload Image
                </span>
              </h2>

              {/* Language Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t("selectocr")}:
                </label>
                <select
                  value={ocrLang}
                  onChange={(e) => setOcrLang(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                >
                  <option value="eng">{t("english")}</option>
                  <option value="heb">{t("hebrew")}</option>
                  <option value="kor">{t("korean")}</option>
                  <option value="chi_sim">{t("chinese")}</option>
                  <option value="spa">{t("spanish")}</option>
                </select>
              </div>

              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleUploadClick}
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 transition-all duration-300 bg-gray-800/20"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">
                  📸
                </div>
                <p className="text-gray-300 mb-2">{t("dropimage")}</p>
                <p className="text-sm text-gray-400">{t("orclickpaste")}</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />

              {/* Image Preview */}
              {image && (
                <div className="mt-6">
                  <div className="glass p-4 rounded-xl">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Selected"
                      width={500}
                      height={256}
                      className="w-full max-h-64 object-contain rounded-lg"
                    />
                    <div className="mt-4 text-center">
                      <button
                        onClick={handleOCR}
                        disabled={loading}
                        className="btn-primary px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            {t("pleasewait")}
                          </div>
                        ) : (
                          <>{t("extracttext")} ✨</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Text Output Section */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                <span className="gradient-text bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  Extracted Text
                </span>
              </h2>

              {text ? (
                <div className="space-y-4">
                  <div className="glass p-6 rounded-xl max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed">
                      {text}
                    </pre>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={handleCopy}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        copied
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "btn-secondary hover:scale-105"
                      }`}
                    >
                      {copied ? t("copied") + " ✓" : t("copy")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center text-2xl">
                    📄
                  </div>
                  <p className="text-gray-400">{t("uploadImageToExtract")}</p>
                </div>
              )}
            </div>
          </div>

          {/* How to Use Section */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                {t("howToUse")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center text-xl">
                  📁
                </div>
                <h3 className="font-semibold text-green-400 mb-2">
                  1. {t("upload")}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("selectImageOrDrag")}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl">
                  🔍
                </div>
                <h3 className="font-semibold text-emerald-400 mb-2">
                  2. {t("extract")}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("chooseLanguageAndProcess")}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center text-xl">
                  📋
                </div>
                <h3 className="font-semibold text-green-400 mb-2">
                  3. {t("copy")}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("copyExtractedText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

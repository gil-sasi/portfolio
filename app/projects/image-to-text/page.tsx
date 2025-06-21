"use client";

import { useState, useRef, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { useTranslation } from "react-i18next";
import Link from "next/link";
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
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("ocrtitle")}</h1>
      <Link
        href="/projects"
        className="text-blue-400 hover:underline mb-6 inline-block"
      >
        ← {t("BacktoProjects")}
      </Link>
      {/* OCR Language Selector */}
      <div className="mb-4">
        <label className="block text-sm mb-1">{t("selectocr")}</label>
        <select
          value={ocrLang}
          onChange={(e) => setOcrLang(e.target.value)}
          className="bg-transparent text-white border border-gray-600 rounded px-4 py-2 text-sm focus:outline-none appearance-none"
        >
          <option className="bg-gray-800 text-white">{t("english")}</option>
          <option className="bg-gray-800 text-white">{t("hebrew")}</option>
          <option className="bg-gray-800 text-white">{t("korean")}</option>
          <option className="bg-gray-800 text-white">{t("chinese")}</option>
          <option className="bg-gray-800 text-white">{t("spanish")}</option>
        </select>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleUploadClick}
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition mb-4"
      >
        <p className="text-sm text-gray-400">{t("dropimage")}</p>
        <p className="text-xs mt-1 text-gray-500">{t("orclickpaste")}</p>
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

      {image && (
        <button
          onClick={handleOCR}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-sm mb-4"
        >
          {loading ? t("pleasewait") : t("extracttext")}
        </button>
      )}

      {loading && (
        <p className="text-sm text-gray-400 mb-4">{t("pleasewait")}</p>
      )}

      {text && (
        <>
          <div className="bg-gray-800 p-4 rounded mb-4 whitespace-pre-wrap text-sm border border-gray-700">
            {text}
          </div>
          <button
            onClick={handleCopy}
            className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </>
      )}
    </div>
  );
}

"use client";
import React from "react";
import { useTranslation } from "react-i18next";

type Social = {
  platform: string;
  url: string;
};

type ContactInfoProps = {
  contactEmail: string;
  socials: Social[];
  setContactEmail: (email: string) => void;
  setSocials: (socials: Social[]) => void;
  onSave: () => void;
  saveStatus?: string;
};

export default function ContactInfo({
  contactEmail,
  socials,
  setContactEmail,
  setSocials,
  onSave,
  saveStatus,
}: ContactInfoProps) {
  const { t } = useTranslation();

  const updateSocial = (
    i: number,
    field: "platform" | "url",
    value: string
  ) => {
    const updated = [...socials];
    updated[i] = { ...updated[i], [field]: value };
    setSocials(updated);
  };

  const removeSocial = (i: number) => {
    setSocials(socials.filter((_, idx) => idx !== i));
  };

  return (
    <div className="mt-10 border border-gray-700 bg-gray-800 p-6 rounded">
      <h2 className="text-xl font-bold mb-4">{t("contactInfo")}</h2>
      <input
        type="email"
        className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        placeholder={t("publicEmail")}
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
      />
      {socials.map((s, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded"
            placeholder="Platform"
            value={s.platform}
            onChange={(e) => updateSocial(i, "platform", e.target.value)}
          />
          <input
            type="text"
            className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded"
            placeholder="URL"
            value={s.url}
            onChange={(e) => updateSocial(i, "url", e.target.value)}
          />
          <button
            className="text-red-400 hover:text-red-600"
            onClick={() => removeSocial(i)}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        className="text-blue-400 hover:underline text-sm mt-2"
        onClick={() => setSocials([...socials, { platform: "", url: "" }])}
      >
        + {t("addsocial")}
      </button>

      <div className="flex justify-end mt-4 ltr">
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          onClick={onSave}
        >
          {t("save")}
        </button>
      </div>
      {saveStatus && (
        <p className="mt-2 text-sm text-green-400">{saveStatus}</p>
      )}
    </div>
  );
}

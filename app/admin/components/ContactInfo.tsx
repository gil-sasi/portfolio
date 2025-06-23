"use client";
import React from "react";
import { useTranslation } from "react-i18next";

// Track click to /api/track-contact
const trackClick = async (platform: string) => {
  try {
    await fetch("/api/track-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform }),
    });
  } catch (err) {
    console.error("Tracking failed:", err);
  }
};

interface Social {
  platform: string;
  url: string;
}

interface Props {
  contactEmail: string;
  socials: Social[];
  setContactEmail: (email: string) => void;
  setSocials: (socials: Social[]) => void;
  onSave: () => void;
  saveStatus: string;
}

export default function ContactInfo({
  contactEmail,
  socials,
  setContactEmail,
  setSocials,
  onSave,
  saveStatus,
}: Props) {
  const { t } = useTranslation();

  const handleSocialChange = (
    index: number,
    field: keyof Social,
    value: string
  ) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    setSocials(updated);
  };

  const addSocial = () => {
    setSocials([...socials, { platform: "", url: "" }]);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-800 p-3 sm:p-6 rounded border border-gray-700">
      <h2 className="text-lg sm:text-xl font-bold mb-4">{t("contactinfo")}</h2>

      {/* Email Input - Mobile Optimized */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">{t("email")}:</label>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full p-3 sm:p-2 bg-gray-700 rounded border border-gray-600 text-base sm:text-sm"
          placeholder="your@email.com"
        />
      </div>

      {/* Social Links Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-0">
            {t("sociallinks", "Social Links")}
          </h3>
          <button
            onClick={addSocial}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm w-full sm:w-auto"
          >
            + {t("addsocial", "Add Social")}
          </button>
        </div>

        {/* Social Links List */}
        <div className="space-y-4">
          {socials.map((social, index) => (
            <div
              key={index}
              className="bg-gray-900 p-4 rounded border border-gray-600"
            >
              {/* Mobile: Stack vertically, Desktop: Side by side */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    {t("platform")}:
                  </label>
                  <input
                    type="text"
                    value={social.platform}
                    onChange={(e) =>
                      handleSocialChange(index, "platform", e.target.value)
                    }
                    className="w-full p-3 sm:p-2 bg-gray-700 rounded border border-gray-600 text-base sm:text-sm"
                    placeholder="e.g., GitHub, LinkedIn, Twitter"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    {t("url")}:
                  </label>
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) =>
                      handleSocialChange(index, "url", e.target.value)
                    }
                    className="w-full p-3 sm:p-2 bg-gray-700 rounded border border-gray-600 text-base sm:text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex sm:flex-col justify-end sm:justify-center">
                  <button
                    onClick={() => removeSocial(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium w-full sm:w-auto mt-2 sm:mt-0"
                    title="Remove social link"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {socials.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="mb-2">
              {t("nosocials", "No social links added yet")}
            </p>
            <p className="text-sm">
              {t("clickadd", "Click 'Add Social' to get started")}
            </p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:py-2 rounded font-medium text-base sm:text-sm w-full sm:w-auto"
        >
          {t("savechanges", "Save Changes")}
        </button>

        {saveStatus && (
          <p className="text-sm text-green-400 text-center sm:text-left">
            {saveStatus}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaPlus,
  FaTrash,
  FaSave,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTelegram,
  FaWhatsapp,
  FaLink,
  FaCopy,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEdit,
  FaEye,
} from "react-icons/fa";

// Track click to /api/track-contact
// const trackClick = async (platform: string) => {
//   try {
//     await fetch("/api/track-contact", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ platform }),
//     });
//   } catch (err) {
//     console.error("Tracking failed:", err);
//   }
// };

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

const SOCIAL_PLATFORMS = [
  {
    name: "GitHub",
    icon: FaGithub,
    color: "text-gray-400",
    placeholder: "https://github.com/username",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    color: "text-blue-500",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    name: "Twitter",
    icon: FaTwitter,
    color: "text-blue-400",
    placeholder: "https://twitter.com/username",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    color: "text-pink-500",
    placeholder: "https://instagram.com/username",
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    color: "text-blue-600",
    placeholder: "https://facebook.com/username",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    color: "text-red-500",
    placeholder: "https://youtube.com/@username",
  },
  {
    name: "Telegram",
    icon: FaTelegram,
    color: "text-blue-400",
    placeholder: "https://t.me/username",
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    color: "text-green-500",
    placeholder: "https://wa.me/1234567890",
  },
];

export default function ContactInfo({
  contactEmail,
  socials,
  setContactEmail,
  setSocials,
  onSave,
  saveStatus,
}: Props) {
  const { t, i18n } = useTranslation();
  const [emailError, setEmailError] = useState("");
  const [urlErrors, setUrlErrors] = useState<{ [key: number]: string }>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isRTL = i18n.language === "he";

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError(t("emailRequired", "Email is required"));
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t("invalidEmail", "Invalid email format"));
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateUrl = (url: string, index: number) => {
    try {
      new URL(url);
      setUrlErrors((prev) => ({ ...prev, [index]: "" }));
      return true;
    } catch {
      setUrlErrors((prev) => ({
        ...prev,
        [index]: t("invalidUrl", "Invalid URL format"),
      }));
      return false;
    }
  };

  const getPlatformIcon = (platform: string) => {
    const social = SOCIAL_PLATFORMS.find(
      (s) => s.name.toLowerCase() === platform.toLowerCase()
    );
    if (social) {
      const IconComponent = social.icon;
      return <IconComponent className={`text-lg ${social.color}`} />;
    }
    return <FaLink className="text-gray-400 text-lg" />;
  };

  const getPlatformPlaceholder = (platform: string) => {
    const social = SOCIAL_PLATFORMS.find(
      (s) => s.name.toLowerCase() === platform.toLowerCase()
    );
    return social?.placeholder || "https://example.com/username";
  };

  const handleSocialChange = (
    index: number,
    field: keyof Social,
    value: string
  ) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    setSocials(updated);

    if (field === "url" && value) {
      validateUrl(value, index);
    }
  };

  const addSocial = (platform?: string) => {
    setSocials([...socials, { platform: platform || "", url: "" }]);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
    setUrlErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSave = () => {
    const isEmailValid = validateEmail(contactEmail);
    const areUrlsValid = socials.every(
      (social, index) => !social.url || validateUrl(social.url, index)
    );

    if (isEmailValid && areUrlsValid) {
      onSave();
    }
  };

  const getUsedPlatforms = () => {
    return socials.map((s) => s.platform.toLowerCase()).filter(Boolean);
  };

  const getAvailablePlatforms = () => {
    const used = getUsedPlatforms();
    return SOCIAL_PLATFORMS.filter((p) => !used.includes(p.name.toLowerCase()));
  };

  return (
    <div className={`modern-card p-6 ${isRTL ? "rtl-text" : ""}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-3">
            <FaEnvelope className="text-blue-500" />
            {t("contactinfo")}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {t(
              "manageContactDetails",
              "Manage your public contact information"
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              isPreviewMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isPreviewMode ? <FaEdit /> : <FaEye />}
            {isPreviewMode ? t("editMode") : t("previewMode", "Preview")}
          </button>
        </div>
      </div>

      {isPreviewMode ? (
        /* Preview Mode */
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              {t("contactPreview", "Contact Preview")}
            </h3>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <FaEnvelope className="text-blue-500" />
                <span className="font-medium">{t("email")}</span>
              </div>
              <a
                href={`mailto:${contactEmail}`}
                className="text-blue-400 hover:text-blue-300 transition-colors break-all"
              >
                {contactEmail || t("noEmailSet", "No email set")}
              </a>
            </div>

            <div>
              <h4 className="font-medium mb-3">
                {t("socialLinks", "Social Links")}
              </h4>
              {socials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socials.map(
                    (social, index) =>
                      social.platform &&
                      social.url && (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors group"
                        >
                          {getPlatformIcon(social.platform)}
                          <span className="flex-1">{social.platform}</span>
                          <FaExternalLinkAlt className="text-xs text-gray-400 group-hover:text-white transition-colors" />
                        </a>
                      )
                  )}
                </div>
              ) : (
                <p className="text-gray-400">
                  {t("noSocialLinks", "No social links added")}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Email Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FaEnvelope className="text-blue-500" />
              <h3 className="text-lg font-semibold">
                {t("publicEmail", "Public Email")}
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {t(
                "publicEmailDesc",
                "This email will be visible to visitors of your portfolio"
              )}
            </p>

            <div className="relative">
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => {
                  setContactEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  emailError
                    ? "border-red-500 focus:border-red-400"
                    : "border-gray-600 focus:border-blue-500"
                }`}
                placeholder="your@email.com"
              />
              {emailError && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <FaExclamationTriangle />
                  <span>{emailError}</span>
                </div>
              )}
              {contactEmail && !emailError && (
                <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
                  <FaCheckCircle />
                  <span>{t("validEmail", "Valid email format")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaLink className="text-green-500" />
                  <h3 className="text-lg font-semibold">
                    {t("sociallinks", "Social Links")}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  {t(
                    "socialLinksDesc",
                    "Add links to your social media profiles"
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {getAvailablePlatforms()
                  .slice(0, 3)
                  .map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => addSocial(platform.name)}
                      className="btn-secondary px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
                    >
                      <platform.icon className={platform.color} />
                      {platform.name}
                    </button>
                  ))}
                <button
                  onClick={() => addSocial()}
                  className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <FaPlus />
                  {t("addCustom", "Custom")}
                </button>
              </div>
            </div>

            {/* Social Links List */}
            {socials.length > 0 ? (
              <div className="space-y-4">
                {socials.map((social, index) => (
                  <div
                    key={index}
                    className="bg-gray-700/50 p-4 rounded-xl border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Platform Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t("platform")}
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            {getPlatformIcon(social.platform)}
                          </div>
                          <input
                            type="text"
                            value={social.platform}
                            onChange={(e) =>
                              handleSocialChange(
                                index,
                                "platform",
                                e.target.value
                              )
                            }
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="e.g., GitHub, LinkedIn, Twitter"
                          />
                        </div>
                      </div>

                      {/* URL Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t("url")} URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={social.url}
                            onChange={(e) =>
                              handleSocialChange(index, "url", e.target.value)
                            }
                            className={`flex-1 px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                              urlErrors[index]
                                ? "border-red-500 focus:border-red-400"
                                : "border-gray-600 focus:border-blue-500"
                            }`}
                            placeholder={getPlatformPlaceholder(
                              social.platform
                            )}
                          />
                          {social.url && (
                            <button
                              onClick={() => copyToClipboard(social.url, index)}
                              className="px-3 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                              title={t("copyUrl", "Copy URL")}
                            >
                              {copiedIndex === index ? (
                                <FaCheckCircle className="text-green-400" />
                              ) : (
                                <FaCopy />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => removeSocial(index)}
                            className="px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            title={t("removeSocial", "Remove social link")}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        {urlErrors[index] && (
                          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                            <FaExclamationTriangle />
                            <span>{urlErrors[index]}</span>
                          </div>
                        )}
                        {social.url && !urlErrors[index] && (
                          <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
                            <FaCheckCircle />
                            <span>{t("validUrl", "Valid URL format")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaLink className="mx-auto text-6xl text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg mb-2">
                  {t("noSocialLinks", "No social links added yet")}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {t(
                    "addSocialLinksDesc",
                    "Add links to your social media profiles to connect with visitors"
                  )}
                </p>
                <button
                  onClick={() => addSocial()}
                  className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                >
                  <FaPlus />
                  {t("addFirstSocial", "Add Your First Social Link")}
                </button>
              </div>
            )}
          </div>

          {/* Save Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3">
              {saveStatus && (
                <>
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-green-400 font-medium">
                    {saveStatus}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={handleSave}
              className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center gap-2 min-w-[140px] justify-center"
            >
              <FaSave />
              {t("saveChanges", "Save Changes")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

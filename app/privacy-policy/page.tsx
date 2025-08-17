"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";
import { siteConfig } from "../../lib/siteConfig";

export default function PrivacyPolicyPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  return (
    <div className={`min-h-screen relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>

      <div className={`relative z-10 px-4 sm:px-6 py-8 sm:py-10 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold glow">
                🔒
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {t("privacyPolicy", "Privacy Policy")}
                </span>
              </h1>
              <p className="text-gray-300">
                {t("privacyPolicySubtitle", "Last updated: January 2025")}
              </p>
            </div>
          </div>

          {/* Privacy Policy Content */}
          <div className={`modern-card p-6 sm:p-8 space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Introduction */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 text-cyan-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("privacyIntroduction", "Introduction")}
              </h2>
              <p className={`text-gray-300 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {t(
                  "privacyIntroductionText",
                  "This Privacy Policy describes how we collect, use, and protect your personal information when you visit our website and use our services. We are committed to protecting your privacy and ensuring the security of your personal data in accordance with Israeli Privacy Protection Law and other applicable regulations."
                )}
              </p>
            </section>

            {/* Data Controller */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 text-cyan-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("dataController", "Data Controller")}
              </h2>
              <div className={`bg-gray-800/30 rounded-lg p-4 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-gray-300">
                  <strong className="text-white">
                    {t("portfolioOwner", "Portfolio Owner")}:
                  </strong>{" "}
                  {siteConfig.portfolio.name}
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">
                    {t("contactEmail", "Contact Email")}:
                  </strong>{" "}
                  <a
                    href={`mailto:${siteConfig.portfolio.email}`}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    {siteConfig.portfolio.email}
                  </a>
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">
                    {t("location", "Location")}:
                  </strong>{" "}
                  {siteConfig.portfolio.location}
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("informationCollected", "Information We Collect")}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {t("personalInformation", "Personal Information")}
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                    <li>
                      {t(
                        "nameEmail",
                        "Name and email address (when you contact us)"
                      )}
                    </li>
                    <li>
                      {t(
                        "contactDetails",
                        "Contact details provided through forms"
                      )}
                    </li>
                    <li>
                      {t(
                        "communicationHistory",
                        "Communication history and messages"
                      )}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {t("technicalInformation", "Technical Information")}
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                    <li>
                      {t("ipAddress", "IP address and device information")}
                    </li>
                    <li>{t("browserData", "Browser type and version")}</li>
                    <li>
                      {t("usageData", "Website usage data and analytics")}
                    </li>
                    <li>{t("cookies", "Cookies and similar technologies")}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("howWeUse", "How We Use Your Information")}
              </h2>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>
                    {t(
                      "respondInquiries",
                      "To respond to your inquiries and provide customer support"
                    )}
                  </li>
                  <li>
                    {t(
                      "improveServices",
                      "To improve our website and services"
                    )}
                  </li>
                  <li>
                    {t("analytics", "To analyze website usage and performance")}
                  </li>
                  <li>
                    {t("legalCompliance", "To comply with legal obligations")}
                  </li>
                  <li>
                    {t(
                      "security",
                      "To ensure the security and integrity of our services"
                    )}
                  </li>
                </ul>
              </div>
            </section>

            {/* Legal Basis */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("legalBasis", "Legal Basis for Processing")}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {t(
                  "legalBasisText",
                  "We process your personal information based on your consent, legitimate interests, and legal obligations. You have the right to withdraw your consent at any time."
                )}
              </p>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("dataSharing", "Data Sharing and Third Parties")}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t(
                  "dataSharingText",
                  "We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:"
                )}
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>
                  {t(
                    "serviceProviders",
                    "With trusted service providers who assist in operating our website"
                  )}
                </li>
                <li>
                  {t(
                    "legalRequirements",
                    "When required by law or to protect our rights"
                  )}
                </li>
                <li>{t("withConsent", "With your explicit consent")}</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("dataRetention", "Data Retention")}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {t(
                  "dataRetentionText",
                  "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law."
                )}
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("yourRights", "Your Rights")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {t("accessRights", "Access Rights")}
                  </h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>
                      •{" "}
                      {t("rightToAccess", "Right to access your personal data")}
                    </li>
                    <li>
                      •{" "}
                      {t("rightToRectify", "Right to rectify inaccurate data")}
                    </li>
                    <li>• {t("rightToDelete", "Right to delete your data")}</li>
                  </ul>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {t("controlRights", "Control Rights")}
                  </h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>
                      • {t("rightToWithdraw", "Right to withdraw consent")}
                    </li>
                    <li>
                      • {t("rightToPortability", "Right to data portability")}
                    </li>
                    <li>
                      • {t("rightToObject", "Right to object to processing")}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("cookies", "Cookies and Tracking Technologies")}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t(
                  "cookiesText",
                  "We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from."
                )}
              </p>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {t("cookieTypes", "Types of Cookies We Use")}
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  <li>
                    {t(
                      "essentialCookies",
                      "Essential cookies for website functionality"
                    )}
                  </li>
                  <li>
                    {t(
                      "analyticsCookies",
                      "Analytics cookies to understand usage"
                    )}
                  </li>
                  <li>
                    {t(
                      "preferenceCookies",
                      "Preference cookies to remember your settings"
                    )}
                  </li>
                </ul>
              </div>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("dataSecurity", "Data Security")}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t(
                  "securityText",
                  "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
                )}
              </p>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  <li>
                    {t("sslEncryption", "SSL encryption for data transmission")}
                  </li>
                  <li>
                    {t(
                      "accessControls",
                      "Strict access controls and authentication"
                    )}
                  </li>
                  <li>
                    {t(
                      "regularUpdates",
                      "Regular security updates and monitoring"
                    )}
                  </li>
                  <li>
                    {t(
                      "employeeTraining",
                      "Employee training on data protection"
                    )}
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("contactUs", "Contact Us")}
              </h2>
              <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                <p className="text-gray-300">
                  {t(
                    "privacyQuestions",
                    "If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:"
                  )}
                </p>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <strong className="text-white">{t("email")}:</strong>{" "}
                    <a
                      href={`mailto:${siteConfig.portfolio.email}`}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {siteConfig.portfolio.email}
                    </a>
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">
                      {t("location", "Location")}:
                    </strong>{" "}
                    {siteConfig.portfolio.location}
                  </p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("policyUpdates", "Updates to This Policy")}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {t(
                  "updatesText",
                  "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date."
                )}
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

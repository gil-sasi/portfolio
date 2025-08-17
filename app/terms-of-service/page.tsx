"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";
import { siteConfig } from "../../lib/siteConfig";

export default function TermsOfServicePage() {
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
                📋
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {t("termsOfService", "Terms of Service")}
                </span>
              </h1>
              <p className="text-gray-300">
                {t("termsLastUpdated", "Last updated: January 2025")}
              </p>
            </div>
          </div>

          {/* Terms of Service Content */}
          <div className={`modern-card p-6 sm:p-8 space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Introduction */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 text-cyan-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("termsIntroduction", "Introduction")}
              </h2>
              <p className={`text-gray-300 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("termsIntroductionText", "These Terms of Service govern your use of this portfolio website. By accessing and using this site, you accept and agree to be bound by these terms and conditions.")}
              </p>
            </section>

            {/* Portfolio Owner */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 text-cyan-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("portfolioOwner", "Portfolio Owner")}
              </h2>
              <div className={`bg-gray-800/30 rounded-lg p-4 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-gray-300">
                  <strong className="text-white">{t("ownerName", "Owner")}:</strong> {siteConfig.portfolio.name}
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">{t("contactEmail", "Contact Email")}:</strong>{" "}
                  <a href={`mailto:${siteConfig.portfolio.email}`} className="text-cyan-400 hover:text-cyan-300">
                    {siteConfig.portfolio.email}
                  </a>
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">{t("location", "Location")}:</strong> {siteConfig.portfolio.location}
                </p>
              </div>
            </section>

            {/* Use of Website */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 text-cyan-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("useOfWebsite", "Use of Website")}
              </h2>
              <div className="space-y-4">
                <p className={`text-gray-300 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("useOfWebsiteText", "This portfolio website is provided for informational and portfolio showcase purposes. You may view, download, and interact with the content for personal, non-commercial use.")}
                </p>
                <div className={`bg-gray-800/30 rounded-lg p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h3 className={`text-lg font-semibold mb-2 text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t("permittedUses", "Permitted Uses")}
                  </h3>
                  <ul className={`list-disc list-inside text-gray-300 space-y-1 ml-4 ${isRTL ? 'mr-4 ml-0' : 'ml-4 mr-0'}`}>
                    <li>{t("viewContent", "Viewing portfolio content and projects")}</li>
                    <li>{t("contactOwner", "Contacting the portfolio owner")}</li>
                    <li>{t("personalReference", "Personal reference and inspiration")}</li>
                    <li>{t("portfolioReview", "Reviewing skills and experience")}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 text-cyan-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("intellectualProperty", "Intellectual Property")}
              </h2>
              <p className={`text-gray-300 leading-relaxed mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("intellectualPropertyText", "All content on this website, including but not limited to text, graphics, images, code, and design, is the property of the portfolio owner and is protected by copyright laws.")}
              </p>
              <div className={`bg-gray-800/30 rounded-lg p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  <li>{t("copyrightNotice", "All content is copyright protected")}</li>
                  <li>{t("noReproduction", "No reproduction without permission")}</li>
                  <li>{t("portfolioProjects", "Portfolio projects remain owner's property")}</li>
                  <li>{t("codeSamples", "Code samples are for demonstration only")}</li>
                </ul>
              </div>
            </section>

            {/* Prohibited Uses */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("prohibitedUses", "Prohibited Uses")}
              </h2>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>{t("commercialUse", "Commercial use without permission")}</li>
                  <li>{t("redistribution", "Redistribution or resale of content")}</li>
                  <li>{t("modification", "Modification of portfolio content")}</li>
                  <li>{t("misrepresentation", "Misrepresentation of ownership")}</li>
                  <li>{t("harmfulUse", "Use for harmful or illegal purposes")}</li>
                </ul>
              </div>
            </section>

            {/* Contact and Communication */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("contactAndCommunication", "Contact and Communication")}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t("contactAndCommunicationText", "When contacting the portfolio owner through this website, you agree to provide accurate information and use the contact form for appropriate purposes only.")}
              </p>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  <li>{t("accurateInformation", "Provide accurate contact information")}</li>
                  <li>{t("appropriateUse", "Use contact form for appropriate purposes")}</li>
                  <li>{t("professionalCommunication", "Maintain professional communication")}</li>
                  <li>{t("noSpam", "No spam or unsolicited messages")}</li>
                </ul>
              </div>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("privacyAndData", "Privacy and Data")}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {t("privacyAndDataText", "Your privacy is important. Please review our Privacy Policy to understand how we collect, use, and protect your information when you use this website.")}
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("limitationOfLiability", "Limitation of Liability")}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {t("limitationOfLiabilityText", "The portfolio owner shall not be liable for any damages arising from the use or inability to use this website, including but not limited to direct, indirect, incidental, or consequential damages.")}
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("changesToTerms", "Changes to Terms")}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {t("changesToTermsText", "The portfolio owner reserves the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the website constitutes acceptance of modified terms.")}
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("governingLaw", "Governing Law")}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {t("governingLawText", "These terms shall be governed by and construed in accordance with the laws of Israel. Any disputes shall be subject to the exclusive jurisdiction of the courts in Israel.")}
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                {t("contactUs", "Contact Us")}
              </h2>
              <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                <p className="text-gray-300">
                  {t("termsQuestions", "If you have any questions about these Terms of Service, please contact us:")}
                </p>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <strong className="text-white">{t("email")}:</strong>{" "}
                    <a href={`mailto:${siteConfig.portfolio.email}`} className="text-cyan-400 hover:text-cyan-300">
                      {siteConfig.portfolio.email}
                    </a>
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">{t("location")}:</strong> {siteConfig.portfolio.location}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

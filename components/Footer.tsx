"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { siteConfig } from "../lib/siteConfig";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const isRTL = i18n.language === "he";

  return (
    <footer
      className={`border-t border-white/10 mt-20 relative z-10 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main footer content in a clean row layout */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Portfolio Info Section */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-3">
              {t("portfolioTitle")}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("portfolioDescription")}
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex-1 text-center">
            <h3 className="text-lg font-semibold text-white mb-3">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm block"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm block"
                >
                  {t("projects")}
                </Link>
              </li>
              <li>
                <Link
                  href="/skills"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm block"
                >
                  {t("skills")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm block"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact Section */}
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-lg font-semibold text-white mb-3">
              {t("legal")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm block"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm block"
                >
                  {t("termsOfService")}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.portfolio.email}`}
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm block"
                >
                  {siteConfig.portfolio.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {siteConfig.portfolio.name}.{" "}
            {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}

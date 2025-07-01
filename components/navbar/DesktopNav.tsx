"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

interface DesktopNavProps {
  user: any;
}

export default function DesktopNav({ user }: DesktopNavProps) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:flex items-center gap-4">
      <Link href="/skills">{t("skills")}</Link>
      <Link href="/projects">{t("projects")}</Link>
      <Link href="/contact">{t("contact")}</Link>
      <Link href="/about">{t("about")}</Link>
      {user?.role === "admin" && <Link href="/admin">{t("adminPanel")}</Link>}
      <Link href="/">{t("home")}</Link>
    </div>
  );
}

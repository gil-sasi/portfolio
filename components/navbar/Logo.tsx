"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Logo() {
  const { t } = useTranslation();

  return (
    <Link href="/" className="text-xl font-bold whitespace-nowrap">
      {t("myname")}
    </Link>
  );
}

"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface EmptyJumbotronProps {
  title?: string;
  message?: string;
  icon?: string;
  code?: string;
}

const EmptyJumbotron: React.FC<EmptyJumbotronProps> = ({
  title,
  message,
  icon = "/img/empty-box.png",
  code,
}) => {
  const t = useTranslations("Dashboard.shared.emptyJumbotron");

  const resolvedTitle = title ?? t("default.title");
  const resolvedMessage = message ?? t("default.message");

  return (
    <div className="w-full py-16 px-6 bg-[var(--bg-2)] rounded-2xl text-center border border-dashed border-gray-300 shadow-inner">
      {code == "ERR_NETWORK" ? (
        <div>
          <div className="flex flex-col items-center justify-center gap-4">
            <Image src="/img/database.png" alt="database" width={80} height={80} className="opacity-60" />
            <h2 className="text-2xl font-semibold text-red-800">{t("network.title")}</h2>
            <p className="text-red-800">{t("network.message")}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <Image src={icon} alt="Empty" width={80} height={80} className="opacity-60" />
          <h2 className="text-2xl font-semibold text-gray-800">{resolvedTitle}</h2>
          <p className="text-gray-600">{resolvedMessage}</p>
        </div>
      )}

    </div>
  );
};

export default EmptyJumbotron;

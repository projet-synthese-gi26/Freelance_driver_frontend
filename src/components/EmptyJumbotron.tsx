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
<<<<<<< HEAD
            <Image src="/img/database.png" alt="database" width={80} height={80} className="opacity-60 w-20 h-20" />
            <h2 className="text-2xl font-semibold text-red-800">Network Error</h2>
            <p className="text-red-800">A network error occurred. Please check your internet connection and try again.</p>
=======
            <Image src="/img/database.png" alt="database" width={80} height={80} className="opacity-60" />
            <h2 className="text-2xl font-semibold text-red-800">{t("network.title")}</h2>
            <p className="text-red-800">{t("network.message")}</p>
>>>>>>> 8f18b3c78874340355c40ebe213831a7e1513d02
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
<<<<<<< HEAD
          <Image src={icon} alt="Empty" width={80} height={80} className="opacity-60 w-20 h-20" />
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600">{message}</p>
=======
          <Image src={icon} alt="Empty" width={80} height={80} className="opacity-60" />
          <h2 className="text-2xl font-semibold text-gray-800">{resolvedTitle}</h2>
          <p className="text-gray-600">{resolvedMessage}</p>
>>>>>>> 8f18b3c78874340355c40ebe213831a7e1513d02
        </div>
      )}

    </div>
  );
};

export default EmptyJumbotron;

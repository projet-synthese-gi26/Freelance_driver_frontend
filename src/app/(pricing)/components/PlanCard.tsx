"use client";

import React from "react";

type Props = {
  label: string;
  price: number;
  currency?: string;
  periodLabel: string;
  description: string[];
  highlighted?: boolean;
  active?: boolean;
  disabled?: boolean;
  buttonLabel: string;
  onSelect: () => void;
  onCardClick?: () => void;
};

const PlanCard: React.FC<Props> = ({
  label,
  price,
  currency = "FCFA",
  periodLabel,
  description,
  highlighted,
  active,
  disabled,
  buttonLabel,
  onSelect,
  onCardClick,
}) => {
  const containerClass = highlighted
    ? "bg-primary text-white"
    : "bg-white text-[var(--neutral-700)]";

  const titleClass = highlighted ? "text-white" : "text-primary";
  const dividerClass = highlighted ? "border-white/40" : "border-neutral-200";
  const checkClass = highlighted ? "text-white" : "text-primary";

  const buttonClass = highlighted
    ? "btn-outline bg-white hover:bg-white hover:text-primary text-primary"
    : "btn-outline transition-colors duration-500 bg-primary text-white hover:bg-[#575fa0]";

  return (
    <div
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (!onCardClick) return;
        if (e.key === "Enter" || e.key === " ") onCardClick();
      }}
      className={`rounded-2xl p-6 h-full shadow-sm border border-neutral-100 ${containerClass} ${onCardClick ? "cursor-pointer" : ""}`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <p className={`mb-0 font-medium ${titleClass}`}>{label}</p>
          {active ? (
            <span className="text-xs px-2 py-1 rounded-full bg-black/10">Current</span>
          ) : null}
        </div>

        <div className={`border border-dashed mt-3 mb-3 ${dividerClass}`}></div>

        <h2 className={`h2 mb-2 text ${highlighted ? "text-white" : "clr-primary-400"}`}>
          {price} {currency}
          <span className={`text-base font-normal ${highlighted ? "text-white/80" : "text-neutral-600"}`}>
            {" "}/ {periodLabel}
          </span>
        </h2>

        <div className={`border border-dashed mt-3 mb-4 ${dividerClass}`}></div>

        <ul className="flex flex-col gap-3 max-text-30 mx-auto mb-5">
          {description.map((d, idx) => (
            <li className="flex items-start text-base gap-2" key={idx}>
              <i className={`las la-check-circle ${checkClass}`}></i>
              <p className={`mb-0 text-start ${highlighted ? "text-white" : "text"}`}>{d}</p>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          disabled={Boolean(disabled)}
          className={`${buttonClass} w-full rounded-lg justify-center font-semibold disabled:opacity-60`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;

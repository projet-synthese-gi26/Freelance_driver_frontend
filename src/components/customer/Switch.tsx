"use client";
import React, { useState } from "react";
import { Switch } from "@headlessui/react";

interface CustomSwitchProps {
  enabled?: boolean;
  setEnabled?: (value: boolean) => void;
  title?: string;
  description?: string;
  newable?: boolean;
}

const CustomSwitch = ({
                        enabled: initialEnabled = false,
                        setEnabled: externalSetEnabled,
                        title = "Default Title",
                        description = "Default description",
                        newable = false
                      }: CustomSwitchProps) => {
  const [internalEnabled, setInternalEnabled] = useState(initialEnabled);

  const handleChange = (value: boolean) => {
    setInternalEnabled(value);
    if (externalSetEnabled) {
      externalSetEnabled(value);
    }
  };

  const currentEnabled = externalSetEnabled ? initialEnabled : internalEnabled;

  return (
      <div className="flex flex-wrap flex-sm-nowrap gap-4 items-center">
        <div className="shrink-0">
          <Switch
              checked={currentEnabled}
              onChange={handleChange}
              className={`${currentEnabled ? "bg-primary" : "bg-[#ECECFD]"}
    relative inline-flex h-[30px] w-[70px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 scale-75 lg:scale-90 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}>
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={`${currentEnabled ? "translate-x-9" : "translate-x-0"}
    pointer-events-none inline-block h-[28px] w-[30px] bg-white transform rounded-full shadow-lg ring-0 transition duration-300 ease-in-out`}
            />
          </Switch>
        </div>
        <div className="flex-grow">
          <div className="flex items-center flex-wrap gap-6 mb-1">
            <h5 className="font-semibold mb-0">
              {" "}
              {title}{" "}
            </h5>
            {newable && (
                <span className="inline-flex justify-center py-2 px-4 text-center text-xs bg-[#37D27A] text-[var(--neutral-700)] rounded font-semibold">
              New
            </span>
            )}
          </div>
          <p className="mb-0 clr-neutral-500">
            {description}
          </p>
        </div>
      </div>
  );
};

export default CustomSwitch;
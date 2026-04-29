"use client"
import React from "react";

type linkProps = {
    title?: string | JSX.Element;
    reference: string;
    items?: any;
};

const NavVer = ({ title, reference, items }: linkProps) => {
    const url = items?.url ?? `#${reference}`;
    const isExternal = String(url).startsWith('http');

    return (
        <li className="group">
            {items?.action ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  items.action?.();
                }}
                className={`text font-bold text-[#243757] w-full text-left`}
              >
                {title}
              </button>
            ) : isExternal ? (
              <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text font-bold text-[#243757] block w-full`}
              >
                  {title}
              </a>
            ) : (
              <a
                  href={url}
                  className={`text font-bold text-[#243757] block w-full`}
              >
                  {title}
              </a>
            )}
        </li>
    );
};

export default NavVer;
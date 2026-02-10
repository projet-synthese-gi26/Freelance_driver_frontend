"use client"
import React, { useState, useEffect } from "react";
import { IoCaretUpOutline } from "react-icons/io5";

type linkProps = {
    title?: string | JSX.Element;
    reference: string;
    items?: any;
};

const NavHor = ({ title, reference, items }: linkProps) => {
    return (
        <li className="group  ">
            {items?.action ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  items.action?.();
                }}
                className={`text font-bold text-[#243757]`}
              >
                {title}
              </button>
            ) : (
              <a
                  href={`#${reference}`}
                  className={`text font-bold text-[#243757]`}
              >
                  {title}
              </a>
            )}
        </li>
    );
};

export default NavHor;
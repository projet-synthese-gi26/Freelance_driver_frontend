"use client"
import React, { useState, useEffect } from "react";
import { IoCaretUpOutline } from "react-icons/io5";

type linkProps = {
    title?: string;
    reference: string;
};

const NavHor = ({ title, reference }: linkProps) => {
    return (
        <li className="group  ">
            <a
                href={`#${reference}`}
                className={`text font-bold text-[#243757]`}
            >
                {title}
            </a>
        </li>
    );
};

export default NavHor;
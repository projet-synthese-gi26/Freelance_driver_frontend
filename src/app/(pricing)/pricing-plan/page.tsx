/* eslint-disable react/no-unescaped-entities */
"use client";
import DropDownButton from "../components/tests/DropDownButton";
import Link from "next/link";

import profiles from "@/app/(pricing)/components/datas/profiles";
// Import Swiper styles
import SubHeadingBtn from "../components/SubHeadingBtn";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function MyPage() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const myprofiles = profiles
    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="justify-center items-center px-6 text">
            <div className="p-2 " >
                <h1 className="text-center title text-[var(--neutral-700)] font-bold leading-tight tracking-tight font-inter">
                    ALL PROFILES
                </h1>
            </div>

            <div className="flex justify-center items-center">
                <SubHeadingBtn text="Select your profile" classes="bg-white" />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                {myprofiles.map(
                    (profile)=>(
                        <div className="m-4 justify-center md:mb-[8rem]"  key = {profile.id}>
                            <DropDownButton label={profile.url.replaceAll('-', ' ')} >
                                <div className="p-4 relative">
                                    <p className="w-full min-h-[100px] m-2 p-4 bg-primary-light">
                                        {profile.description}
                                    </p>
                                    <Link href={"/pricing-plan/"+ profile.id } className="rounded-full  m-4 p-2 border-2 border-primary-500 hover:bg-primary hover:text-white"> Explore...                <i className="las la-long-arrow-alt-right text-xs"></i>
                                    </Link>
                                </div>
                            </DropDownButton>
                        </div>

                    )
                )  }
            </div>



        </div>
    );
}
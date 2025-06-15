"use client"
import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
dayjs.locale('en');
import Home from '@/components/freelance/planning/main';
import ContextWrapper from '@/components/freelance/planning/context/ContextWrapper';


const Page = () => {
    return (
        <div className="flex flex-col">
            <ContextWrapper>
                <div className=' p-4'>
                    <Home />
                </div>
            </ContextWrapper>
        </div>
    );
}

export default Page;

"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchButton = () => {
    const router = useRouter();

    const handleSearch = () => {
        router.push('/searchpage');
    };

    return (
        <div className="flex items-center">

            <button
                onClick={handleSearch}
                className="flex items-center justify-center px-6 py-3 rounded-xl bg-[#2D3A96] text-white text-base cursor-pointer hover:bg-blue-500 transition duration-300 ease-in-out whitespace-nowrap"
            > <MagnifyingGlassIcon className="w-8 h-8  text-white " />
                <span className="mr-2">Search an announce</span>

            </button>

        </div>
    );
};

export default SearchButton;
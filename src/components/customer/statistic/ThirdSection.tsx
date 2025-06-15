import React, { useMemo, useState } from 'react'
import {
    ArrowRightIcon,
    PencilSquareIcon,
    PlusCircleIcon,
    TrashIcon, 
  } from "@heroicons/react/24/outline";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/20/solid";
import { adminRecentListings } from "@public/data/adminrecentlisting";
import HeadlessList from "@/components/customer/ListBox";

const ThirdSection = () => {
  return (
    <section className="bg-white text px-3 lg:px-6 pb-4 lg:pb-6 mt-4 lg:mt-6">
      <div className="p-3 sm:p-4 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white">
        <div className="flex flex-wrap gap-2 justify-between mb-7">
          <h3 className="title font-bold">Récents voyages</h3>
          <Link
            href="/"
            className="text-primary font-semibold flex items-center gap-2"
          >
            tout visiter <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text text-left bg-[var(--bg-1)] border-b border-dashed">
                <th className="py-3 pl-3">Nom voyage</th>
                <th className="py-3">Lieu départ</th>
                <th className="py-3">Conducteurs</th>
                <th className="py-3">Date</th>
                <th className="py-3">Status</th>
                <th className="py-3">Avis</th>
              </tr>
            </thead>
            <tbody>
              {adminRecentListings.map(
                ({ id, agent, date, location, name, review, status }) => (
                  <tr
                    key={id}
                    className="border-b text border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 sm:text-left text-center">{name}</td>
                    <td className="py-3 text-primary sm:text-left text-center">
                      {location}
                    </td>
                    <td className="py-3 sm:text-left text-center">{agent}</td>
                    <td className="py-3 sm:text-left text-center">{date}</td>
                    <td className={`py-3 sm:text-left text-center`}>
                      <div className={`w-32 mx-auto`}>
                        <HeadlessList initialValue={status} />
                      </div>
                    </td>
                    <td className="py-3 sm:text-left text-center">
                      <span className="flex gap-1 items-center justify-center">
                        <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                        {review}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ThirdSection
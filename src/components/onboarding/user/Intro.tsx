import React, { useState } from 'react'
import {motion} from "framer-motion"
import { STAGGER_CHILD_VARIANTS } from "@/app/lib/constant";
import { useRouter } from "next/router";
import Link from 'next/link';

//<motion.div></motion.div>

const Intro = () => {
    const [additionalInfo, setAdditionalInfo] = useState('')
  return (
    <motion.div
      className="z-10"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.5,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="mx-5 flex flex-col items-center space-y-3 mt-10 text-center sm:mx-auto"
      >
        <motion.h1
          className="font-display bigtitle font-bold text-foreground transition-colors"
          variants={STAGGER_CHILD_VARIANTS}
        >
          Welcome to{" "}
          <span className="font-bold tracking-tighter">LetsGo</span>
        </motion.h1>
        <motion.p
          className="max-w-md text text-accent-foreground/80 transition-colors"
          variants={STAGGER_CHILD_VARIANTS}
        >
          For your first login, we need some additional information to design a customized dashboard for you
        </motion.p>
        <motion.div
          variants={STAGGER_CHILD_VARIANTS}
          className="rounded  px-2 py-2 mt-5 flex font-medium border border-primary-500 transition-colors hover:text-white hover:bg-primary"
        >
          <Link href="/customer-dashboard">
            <button
              className="px-2 text-base font-medium w-full h-full cursor-pointer"
            >
              Get Started
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Intro
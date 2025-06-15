// "use client";
//
// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import ResidenceInfo from '@/components/registration/ResidenceInfo';
// import RoleInfo from '@/components/registration/RoleInfo';
// import AvatarInfo from '@/components/registration/AvatarInfo';
// import DescriptionInfo from '@/components/registration/DescriptionInfo';
// import IdentityInfo from '@/components/registration/IdentityInfo';
// import PersonalIdentityInfo from "@/components/registration/PersonalInfo";
//
// const formVariants = {
//     enter: (direction) => {
//         return {
//             x: direction > 0 ? 1000 : -1000,
//             opacity: 0
//         };
//     },
//     center: {
//         zIndex: 1,
//         x: 0,
//         opacity: 1
//     },
//     exit: (direction) => {
//         return {
//             zIndex: 0,
//             x: direction < 0 ? 1000 : -1000,
//             opacity: 0
//         };
//     }
// };
//
// export default function CompleteRegistration() {
//     const [step, setStep] = useState(1);
//     const [formData, setFormData] = useState({});
//     const [direction, setDirection] = useState(0);
//
//     const nextStep = () => {
//         setDirection(1);
//         setStep(step + 1);
//     };
//     const prevStep = () => {
//         setDirection(-1);
//         setStep(step - 1);
//     };
//
//     const handleChange = (name, value) => {
//         setFormData(prevData => ({ ...prevData, [name]: value }));
//     };
//
//     const handleSubmit = async () => {
//         console.log(formData);
//         // Handle form submission
//     };
//
//     const renderStep = () => {
//         const props = { formData, handleChange, nextStep, prevStep };
//         const steps = [
//             <PersonalIdentityInfo key="personal" {...props} />,
//             <ResidenceInfo key="residence" {...props} />,
//             <RoleInfo key="role" {...props} />,
//             <AvatarInfo key="avatar" {...props} />,
//             <DescriptionInfo key="description" {...props} />
//         ];
//
//         return (
//             <AnimatePresence initial={false} custom={direction}>
//                 <motion.div
//                     key={step}
//                     custom={direction}
//                     variants={formVariants}
//                     initial="enter"
//                     animate="center"
//                     exit="exit"
//                     transition={{
//                         x: { type: "spring", stiffness: 300, damping: 30 },
//                         opacity: { duration: 0.2 }
//                     }}
//                 >
//                     {steps[step - 1]}
//                 </motion.div>
//             </AnimatePresence>
//         );
//     };
//
//     return (
//         <div className="container mx-auto p-4 max-w-2xl">
//             <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Complete Your Registration</h1>
//             <div className="bg-white shadow-lg rounded-lg p-6">
//                 {renderStep()}
//                 <div className="mt-6 flex justify-between">
//                     <div className="text-sm text-gray-500">Step {step} of 5</div>
//                     <div className="space-x-2">
//                         {step > 1 && (
//                             <button onClick={prevStep} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200">
//                                 Previous
//                             </button>
//                         )}
//                         {step < 5 ? (
//                             <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
//                                 Next
//                             </button>
//                         ) : (
//                             <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">
//                                 Submit
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ResidenceInfo from '@/components/registration/ResidenceInfo';
import RoleInfo from '@/components/registration/RoleInfo';
import AvatarInfo from '@/components/registration/AvatarInfo';
import DescriptionInfo from '@/components/registration/DescriptionInfo';
import IdentityInfo from '@/components/registration/IdentityInfo';
import PersonalIdentityInfo from "@/components/registration/PersonalInfo";

const formVariants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        scale: 0.8
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
        scale: 0.8
    })
};

const pageTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
};

const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    }
};

const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } }
};

export default function CompleteRegistration() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [direction, setDirection] = useState(0);

    const nextStep = () => {
        setDirection(1);
        setStep(step + 1);
    };
    const prevStep = () => {
        setDirection(-1);
        setStep(step - 1);
    };

    const handleChange = (name, value) => {
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        console.log(formData);
        // Handle form submission
    };

    const renderStep = () => {
        const props = { formData, handleChange, nextStep, prevStep };
        const steps = [
            <PersonalIdentityInfo key="personal" {...props} />,
            <ResidenceInfo key="residence" {...props} />,
            <RoleInfo key="role" {...props} />,
            <AvatarInfo key="avatar" {...props} />,
            <DescriptionInfo key="description" {...props} />
        ];

        return (
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={step}
                    custom={direction}
                    variants={formVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={pageTransition}
                    className="absolute w-full"
                >
                    {steps[step - 1]}
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <motion.div
            className="min-h-screen bg-gray-100 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto p-4 max-w-6xl">
                <motion.div
                    className="bg-white shadow-lg rounded-lg overflow-hidden flex"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="w-1/2 p-8">
                        <motion.div
                            className="flex justify-center mb-8"
                            variants={logoVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <Image src="/auth/mi-logo5.png" alt="Logo" width={80} height={80} />
                        </motion.div>
                        <motion.h1
                            className="text-3xl font-bold mb-8 text-center text-blue-600"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            Complete Your Registration
                        </motion.h1>
                        <div className="relative" style={{height: '400px'}}>
                            {renderStep()}
                        </div>
                        <div className="mt-6 flex justify-between">
                            <motion.div
                                className="text-sm text-gray-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                Step {step} of 5
                            </motion.div>
                            <div className="space-x-2">
                                {step > 1 && (
                                    <motion.button
                                        onClick={prevStep}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        Previous
                                    </motion.button>
                                )}
                                {step < 5 ? (
                                    <motion.button
                                        onClick={nextStep}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        Next
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        Submit
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 bg-indigo-100">
                        <motion.div
                            className="h-full bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: "url('/auth/mi-auth.png')" }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        ></motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
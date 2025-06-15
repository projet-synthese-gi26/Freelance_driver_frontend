"use client"
import React, { useState, useEffect } from 'react'
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { toast } from 'react-hot-toast';
import { languageOptions } from "@/data/Structure";
import { DriverDTO, driverDTO} from '@/app/(dashboard)/freelance-dashboard/FreelanceDTO';
import { auth,db } from '@/app/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface OnboardingStep {
field: keyof typeof driverDTO;
title: string;
description: string;
optional?: boolean;
}

const Page= () => {
const [editable, setEditable] = useState<boolean>(false)
const [onboarded, setOnboarded] = useState<boolean>(false)
const [onboardingStep, setOnboardingStep] = useState<number>(0)
const [formData, setFormData] = useState<typeof driverDTO>(driverDTO)
const [errors, setErrors] = useState<Partial<Record<keyof DriverDTO, string>>>({});

const user = auth.currentUser;

const isAtLeast18YearsOld = (birthDate: string): boolean => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    
    return age >= 18;
}
const onboardingSteps: OnboardingStep[] = [
    { field: 'first_name', title: 'First Name', description: 'Please enter your first name.' },
    { field: 'last_name', title: 'Last Name', description: 'Now, please enter your last name.' },
    { field: 'friendly_name', title: 'Nickname', description: 'If you have a nickname, you can enter it here. This is optional.', optional: true },
    { field: 'date_of_birth', title: 'Date of Birth', description: 'Please enter your date of birth.' },
    { field: 'driver_email', title: 'Email', description: 'Please enter your email address.' },
    { field: 'driver_phone_number', title: 'Phone Number', description: 'Please enter your phone number.' },
    { field: 'driver_gender', title: 'Gender', description: 'Please select your gender.' },
    { field: 'driver_language', title: 'Language', description: 'Please select your preferred language.' },
    { field: 'driver_bio', title: 'Bio', description: 'Finally, you can write a short bio about yourself. This is optional.', optional: true }];

    useEffect(() => {
        const requiredFields = onboardingSteps.filter(step => !step.optional).map(step => step.field);
        if (requiredFields.every(field => formData[field] !== '')) {
            setOnboardingStep(onboardingSteps.length)
        }
    }, [formData])

    const handleInputChange = (field: keyof DriverDTO, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Validation spécifique pour la date de naissance
        if (field === 'date_of_birth') {
            if (!isAtLeast18YearsOld(value)) {
                setErrors(prev => ({ ...prev, [field]: "You must be at least 18 years old to register." }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        }
    };
    
    const handleNextStep = () => {
      if (onboardingStep < onboardingSteps.length - 1) {
          let nextStep = onboardingStep + 1;
          while (nextStep < onboardingSteps.length && onboardingSteps[nextStep].optional) {
              nextStep++;
          }
          setOnboardingStep(nextStep);
      } else {
          setOnboardingStep(onboardingSteps.length)
          toast.success('Onboarding completed successfully!')
      }
    }

    const handleSave = () => {
        toast.success('Changes Saved Successfully');
        setEditable(false)
    };
    
    const fetcher = async () => {
        if (user && user.email) { // Vérifiez que user.email n'est pas null
            try {
                const userDocRef = doc(db, 'users', user.email); // Utilisez user.email ici
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    if (userDoc.data()?.has_completed_onboarding) {
                        setOnboarded(true);
                    } else {
                        setOnboarded(false);
                    }
                } else {
                    console.error("Document does not exist");
                    setOnboarded(false);
                }
            } catch (error) {
                console.error("Error fetching document: ", error);
            }
        } else {
            console.warn("User is not authenticated or email is null");
        }
    };

    useEffect(()=>{
        fetcher()
    },[user])

    if (!onboarded && onboardingStep < onboardingSteps.length) {
        console.log("not completed");
        
        const currentStep = onboardingSteps[onboardingStep]
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4">{currentStep.title}</h2>
                    <p className="mb-4">{currentStep.description}</p>
                    {currentStep.field === 'driver_gender' ? (
                        <div className="mb-4">
                            <label className="block mb-2">Gender:</label>
                            <select 
                                className="w-full p-2 border rounded"
                                value={formData.driver_gender}
                                onChange={(e) => handleInputChange('driver_gender', e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    ) : currentStep.field === 'driver_language' ? (
                        <div className="mb-4">
                            <label className="block mb-2">Language:</label>
                            <select 
                                className="w-full p-2 border rounded"
                                value={formData.driver_language}
                                onChange={(e) => handleInputChange('driver_language', e.target.value)}
                            >
                                <option value="">Select Language</option>
                                {languageOptions.map((option, key) => (
                                    <option key={key} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <input 
                            type={currentStep.field === 'date_of_birth' ? 'date' : 'text'}
                            className="w-full p-2 border rounded mb-4"
                            value={formData[currentStep.field]}
                            onChange={(e) => handleInputChange(currentStep.field, e.target.value)}
                        />
                    )}
                    <button 
                        className="bg-primary text-white p-2 rounded"
                        onClick={handleNextStep}
                    >
                        {onboardingStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        )
    }
    
    return (
        <div className="p-4">
            <h1 className="title font-bold">Personal Information</h1>
            <div>
                <form action="#" className="text mb-5 space-y-5 p-4 rounded-md">
                    <PencilSquareIcon className={`ml-[80%] w-5 h-5 hover:cursor-pointer ${editable ? 'hidden' : ''}`} onClick={() => { setEditable(true) }} />
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                        {onboardingSteps.map((step) => (
                            <div key={step.field} className={step.field === 'driver_bio' ? 'lg:col-span-3 md:col-span-2 col-span-1' : ''}>
                                <label className="font-medium">
                                    {step.title}{step.optional ? ' (Optional)' : ''} :
                                </label>
                                {editable ? (
                                <>
                                  step.field === 'driver_gender' ? (
                                      <select 
                                          className="w-full p-2 border rounded"
                                          value={formData[step.field]}
                                          onChange={(e) => handleInputChange(step.field, e.target.value)}
                                      >
                                          <option value="">Select Gender</option>
                                          <option value="male">Male</option>
                                          <option value="female">Female</option>
                                          <option value="other">Other</option>
                                      </select>
                                  ) : step.field === 'driver_language' ? (
                                      <select 
                                          className="w-full p-2 border rounded"
                                          value={formData[step.field]}
                                          onChange={(e) => handleInputChange(step.field, e.target.value)}
                                      >
                                          <option value="">Select Language</option>
                                          {languageOptions.map((option, key) => (
                                              <option key={key} value={option.value}>{option.label}</option>
                                          ))}
                                      </select>
                                  ) : step.field === 'driver_bio' ? (
                                      <textarea
                                          id="profile"
                                          name="profile"
                                          rows={4}
                                          value={formData.driver_bio}
                                          onChange={(e) => handleInputChange('driver_bio', e.target.value)}
                                          className="border w-full focus:outline-none py-3 px-6 rounded-2xl"
                                      >
                                      </textarea>
                                  ) : (
                                      <input
                                          type={step.field === 'date_of_birth' ? 'date' : 'text'}
                                          className={`w-full p-2 border rounded ${errors[step.field] ? 'border-red-500' : ''}`}
                                          value={formData[step.field]}
                                          onChange={(e) => handleInputChange(step.field, e.target.value)}
                                          max={step.field === 'date_of_birth' ? new Date().toISOString().split('T')[0] : undefined}
                                      />)
                                        {errors[step.field] && <p className="text-red-500 text-sm mt-1">{errors[step.field]}</p>}
                                    </>
                                ) : (
                                  <p className='opacity-[80%]'>
                                      {formData[step.field] || (step.optional ? 'Not provided' : driverDTO[step.field])}
                                  </p>
                              )}
                          </div>
                      ))}
                  </div>
              </form>
              <div className="flex items-center gap-6 flex-wrap">
                    {editable && (
                        <div className="flex gap-3">
                            <button
                                className="link cursor-pointer font-medium bg-primary p-2 text-white rounded-md"
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>
                            <button
                                className="border border-primary-500 p-2 rounded-md text-primary hover:text-primary font-medium" 
                                onClick={() => { setEditable(false); setErrors({}); }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
          </div>
      </div>
    )
}

export default Page
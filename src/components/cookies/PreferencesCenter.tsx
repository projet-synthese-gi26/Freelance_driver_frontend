import React, {useEffect, useState} from 'react';
import { Switch } from '@headlessui/react';

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

interface CookiePreferencesProps {
    cookiePreferences: CookieCategory[];
    // updateCookiePreference: (category: string, enabled: boolean, subCategory?: string) => void;
    onSave: (categories: CookieCategory[]) => void;
    onClose: () => void;
}


interface SubCategory {
    name: string;
    description: string;
    enabled: boolean;
}

interface CookieCategory {
    name: string;
    description: string;
    required?: boolean;
    enabled: boolean;
    subCategories?: SubCategory[];
}

export default function CookiePreferences({  cookiePreferences,  onClose ,onSave }: CookiePreferencesProps) {
    const [categories, setCategories] = useState(cookiePreferences);

    const handleSave = () => {
        localStorage.setItem('cookiePreferences', JSON.stringify(categories));
        onSave(categories);
        onClose();
    };

    useEffect(() => {
        const savedPreferences = localStorage.getItem('cookiePreferences');
        if (savedPreferences) {
            setCategories(JSON.parse(savedPreferences));
        }
    }, []);


    const handleCategoryChange = (index: number) => {
        const newCategories = [...categories];
        newCategories[index].enabled = !newCategories[index].enabled;
        if (newCategories[index].subCategories) {
            newCategories[index].subCategories = newCategories[index].subCategories?.map(sub => ({
                ...sub,
                enabled: newCategories[index].enabled,
            }));
        }
        setCategories(newCategories);
    };

    const handleSubCategoryChange = (categoryIndex: number, subIndex: number) => {
        const newCategories = [...categories];
        newCategories[categoryIndex].subCategories![subIndex].enabled = !newCategories[categoryIndex].subCategories![subIndex].enabled;
        setCategories(newCategories);
    };

    const handleAcceptAll = () => {
        const newCategories = categories.map(category => ({
            ...category,
            enabled: true,
            subCategories: category.subCategories ? category.subCategories.map(sub => ({ ...sub, enabled: true })) : undefined
        }));
        setCategories(newCategories);
    };

    const handleRefuseAll = () => {
        const newCategories = categories.map(category => ({
            ...category,
            enabled: category.required ? true : false,
            subCategories: category.subCategories ? category.subCategories.map(sub => ({ ...sub, enabled: false })) : undefined
        }));
        setCategories(newCategories);
    };

    return (
        // <div className="max-w-full mx-auto py-12 px-2 sm:px-2 lg:px-8 relative text-justify">
        <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center  text-justify p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

                <div className="p-6 sm:p-8">


                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-2">
                            Cookie Preferences
                        </h2>

                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>

                    </div>

                    <div className="mt-8 text-sm text-gray-600">
                        <p>Our partners and we store cookies and use non-sensitive information from your device to
                            improve our products and display personalized ads and content. You can accept or refuse
                            these various operations. To learn more about cookies, the data we use, the processing we
                            carry out, and the partners we work with, you can consult our privacy policy and cookie
                            policy.</p>
                    </div>


                    <div className="mt-8 space-y-8">
                        {categories.map((category, index) => (
                            // <div key={category.name} className="border border-gray-200 rounded-lg p-6">
                            <div key={category.name} className="p-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {category.name} {category.required &&
                                        <span className="text-red-600 font-bold">(Required)</span>}
                                    </h3>
                                    {!category.required && (
                                        <Switch
                                            checked={category.enabled}
                                            onChange={() => handleCategoryChange(index)}
                                            className={classNames(
                                                category.enabled ? 'bg-blue-600' : 'bg-gray-200',
                                                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                            )}
                                        >
                                            <span className="sr-only">Use setting</span>
                                            <span
                                                className={classNames(
                                                    category.enabled ? 'translate-x-5' : 'translate-x-0',
                                                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                                )}
                                            >
                                        <span
                                            className={classNames(
                                                category.enabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
                                                'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                            )}
                                            aria-hidden="true"
                                        >
                                            <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                                <path
                                                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span
                                            className={classNames(
                                                category.enabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
                                                'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                            )}
                                            aria-hidden="true"
                                        >
                                            <svg className="h-3 w-3 text-indigo-600" fill="currentColor"
                                                 viewBox="0 0 12 12">
                                                <path
                                                    d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"/>
                                            </svg>
                                        </span>
                                    </span>
                                        </Switch>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-gray-500">{category.description}</p>
                                {category.subCategories && (
                                    <div className="mt-4 space-y-4">
                                        {category.subCategories.map((subCategory, subIndex) => (
                                            <div key={subCategory.name} className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <Switch
                                                        checked={subCategory.enabled}
                                                        onChange={() => handleSubCategoryChange(index, subIndex)}
                                                        className={classNames(
                                                            subCategory.enabled ? 'bg-blue-600' : 'bg-gray-200',
                                                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                                        )}
                                                    >
                                                        <span className="sr-only">Use setting</span>
                                                        <span
                                                            className={classNames(
                                                                subCategory.enabled ? 'translate-x-5' : 'translate-x-0',
                                                                'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                                            )}
                                                        >

                                                </span>
                                                    </Switch>
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor={`category-${index}-subcategory-${subIndex}`}
                                                           className="font-medium text-gray-700">
                                                        {subCategory.name}
                                                    </label>
                                                    <p className="text-gray-500">{subCategory.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="mt-2 text-sm text-gray-600">
                            <p>This site and its partners may also carry out the following data processing activities:
                                Ensuring security, preventing and detecting fraud, and correcting errors, Recording and
                                communicating privacy choices, Providing and presenting ads and content, Identifying
                                devices based on automatically transmitted information, Matching and combining data from
                                other data sources, and Linking different devices.</p>
                        </div>

                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Cancel
                        </button>
                        <button onClick={handleRefuseAll}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                            Refuse All
                        </button>
                        <button onClick={handleAcceptAll}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                            Accept All
                        </button>
                        <button onClick={handleSave}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                            Save Preferences
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
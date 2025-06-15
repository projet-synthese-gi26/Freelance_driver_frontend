import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Experience {
  company: string;
  startDate: string;
  endDate: string;
  currentJob: boolean;
  referent: string;
}

const ProfessionalExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([
    { company: '', startDate: '', endDate: '', currentJob: false, referent: '' }
  ]);

  const handleInputChange = (index: number, field: keyof Experience, value: string | boolean) => {
    const newExperiences = [...experiences];
    if (field === 'currentJob') {
      newExperiences[index][field] = value as boolean;
      if (value) {
        newExperiences[index].endDate = '';
      }
    } else {
      newExperiences[index][field] = value as string;
    }
    setExperiences(newExperiences);
  };

  const addExperience = () => {
    setExperiences([...experiences, { company: '', startDate: '', endDate: '', currentJob: false, referent: '' }]);
  };

  const removeExperience = (index: number) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
  };

  return (
    <motion.div 
      className="col-span-12"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <label className="font-semibold block mb-2">Professional Experience</label>
      {experiences.map((exp, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                id={`company-${index}`}
                value={exp.company}
                onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor={`referent-${index}`} className="block text-sm font-medium text-gray-700">Referent (if any)</label>
              <input
                type="text"
                id={`referent-${index}`}
                value={exp.referent}
                onChange={(e) => handleInputChange(index, 'referent', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                id={`startDate-${index}`}
                value={exp.startDate}
                onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                id={`endDate-${index}`}
                value={exp.endDate}
                onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                disabled={exp.currentJob}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-100"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={exp.currentJob}
                onChange={(e) => handleInputChange(index, 'currentJob', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">I currently work here</span>
            </label>
          </div>
          {experiences.length > 1 && (
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="mt-2 px-2 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addExperience}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Another Experience
      </button>
    </motion.div>
  );
};

export default ProfessionalExperience;
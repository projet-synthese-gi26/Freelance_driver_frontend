"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Experience } from '@/type/experience';
import { experienceService } from '@/service/experienceService';
import { sessionService } from '@/service/sessionService';

export default function ProfessionalExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await experienceService.getAllExperiences();
      setExperiences(data);
    } catch (error) {
      toast.error("Unable to load experiences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentExp.company) {
        toast.error("Company name is required.");
        return;
    }

    setIsSubmitting(true);
    try {
        const userContext = await sessionService.getUserContext();
        const driverId = userContext?.id;
        
        if (!driverId) {
            toast.error("Session error.");
            return;
        }

        if (currentExp.id) {
            await experienceService.updateExperience(currentExp.id, currentExp, driverId);
            toast.success("Experience updated!");
        } else {
            // @ts-ignore : Partial cast for creation
            await experienceService.createExperience(currentExp, driverId);
            toast.success("Experience added!");
        }
        
        setShowModal(false);
        loadData();
    } catch (error) {
        console.error(error);
        toast.error("Error while saving.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (exp: Experience) => {
      if(!confirm(`Delete experience at ${exp.company}?`)) return;
      try {
          await experienceService.deleteExperience(exp.id);
          setExperiences(prev => prev.filter(e => e.id !== exp.id));
          toast.success("Experience deleted.");
      } catch (error) {
          toast.error("Error deleting experience.");
      }
  };

  const openModal = (exp?: Experience) => {
      setCurrentExp(exp || { company: '', referent: '', currentlyWorking: false });
      setShowModal(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Professional Experience</h2>
        <button 
            onClick={() => openModal()}
            className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"
        >
            <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg">
            No experience added yet.
        </div>
      ) : (
        <div className="space-y-4">
            {experiences.map(exp => (
                <div key={exp.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div>
                        <h3 className="font-bold text-gray-900">{exp.company}</h3>
                        <p className="text-sm text-gray-600">
                            {exp.startDate || 'N/A'} - {exp.currentlyWorking ? "Present" : (exp.endDate || 'N/A')}
                        </p>
                        {exp.referent && <p className="text-xs text-gray-500 mt-1 italic">Ref: {exp.referent}</p>}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => openModal(exp)} className="p-1.5 text-blue-500 hover:bg-blue-100 rounded">
                            <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(exp)} className="p-1.5 text-red-500 hover:bg-red-100 rounded">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
                <button 
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                <h3 className="text-lg font-bold mb-4">{currentExp.id ? 'Edit' : 'Add'} Experience</h3>
                
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input 
                            value={currentExp.company}
                            onChange={e => setCurrentExp({...currentExp, company: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Company Name"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Referent</label>
                        <input 
                            value={currentExp.referent}
                            onChange={e => setCurrentExp({...currentExp, referent: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Referent Name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input 
                                type="date"
                                value={currentExp.startDate}
                                onChange={e => setCurrentExp({...currentExp, startDate: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input 
                                type="date"
                                value={currentExp.endDate}
                                onChange={e => setCurrentExp({...currentExp, endDate: e.target.value})}
                                disabled={currentExp.currentlyWorking}
                                className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox"
                            id="currentJob"
                            checked={currentExp.currentlyWorking}
                            onChange={e => setCurrentExp({...currentExp, currentlyWorking: e.target.checked})}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label htmlFor="currentJob" className="text-sm text-gray-700">I currently work here</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
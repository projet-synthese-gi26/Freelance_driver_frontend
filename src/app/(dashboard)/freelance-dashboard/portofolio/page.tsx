"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CloudArrowUpIcon, DocumentTextIcon, CameraIcon } from '@heroicons/react/24/outline';
import Image from "next/image";

// SERVICES & TYPES
import { experienceService } from '@/service/experienceService';
import { mediaService } from '@/service/mediaService';
import { sessionService } from '@/service/sessionService';
import { DriverLicense, CV } from '@/type/experience';

// COMPONENTS
import ProfessionalExperience from '@/components/freelance/portofolio/Experience';
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
  const [license, setLicense] = useState<DriverLicense | null>(null);
  const [cv, setCv] = useState<CV | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState<{license: boolean, cv: boolean}>({ license: false, cv: false });

  // Load documents
  useEffect(() => {
    const fetchDocs = async () => {
        try {
            const [fetchedLicense, fetchedCv] = await Promise.all([
                experienceService.getDocument<DriverLicense>("f1c2b3d4-e5f6-7890-1234-567890abcdef"), // License Category ID
                experienceService.getDocument<CV>("a1b2c3d4-e5f6-7890-1234-567890fedcba"), // CV Category ID
            ]);
            setLicense(fetchedLicense);
            setCv(fetchedCv);
        } catch (error) {
            console.error("Error loading documents", error);
        } finally {
            setLoadingDocs(false);
        }
    };
    fetchDocs();
  }, []);

  // Handle License Upload (Image)
  const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setUploading(prev => ({...prev, license: true}));
          
          try {
            const userContext = await sessionService.getUserContext();
            const driverId = userContext?.id;
            if(!driverId) throw new Error("Invalid session");

            const resourceId = license?.id || uuidv4();
            // 1. Upload file
            const response = await mediaService.uploadFileAndGetResponse(file, 'documents', resourceId);
            
            // 2. Save metadata
            await experienceService.saveDocument(
                license?.id || null, // null if creation
                response.url, 
                "driver-license.jpg", 
                "f1c2b3d4-e5f6-7890-1234-567890abcdef", 
                driverId
            );
            
            // 3. Update UI
            setLicense({ id: resourceId, photoUrl: response.url });
            toast.success("License updated!");
          } catch (error) {
              console.error(error);
              toast.error("Failed to upload license.");
          } finally {
              setUploading(prev => ({...prev, license: false}));
          }
      }
  };

  // Handle CV Upload (PDF)
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (file.type !== 'application/pdf') {
              toast.error("Please select a PDF file.");
              return;
          }
          setUploading(prev => ({...prev, cv: true}));
          
          try {
            const userContext = await sessionService.getUserContext();
            const driverId = userContext?.id;
            if(!driverId) throw new Error("Invalid session");

            const resourceId = cv?.id || uuidv4();
            const response = await mediaService.uploadFileAndGetResponse(file, 'documents', resourceId);
            
            await experienceService.saveDocument(
                cv?.id || null,
                response.url, 
                file.name, 
                "a1b2c3d4-e5f6-7890-1234-567890fedcba", 
                driverId
            );
            
            setCv({ id: resourceId, fileUrl: response.url, fileName: file.name });
            toast.success("CV updated!");
          } catch (error) {
              console.error(error);
              toast.error("Failed to upload CV.");
          } finally {
              setUploading(prev => ({...prev, cv: false}));
          }
      }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Professional Portfolio</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driving License Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Driving License</h3>
                <div className="relative w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden group">
                    {uploading.license ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    ) : license?.photoUrl ? (
                        <>
                            <Image src={license.photoUrl} alt="License" fill className="object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                                    Change
                                    <input type="file" className="hidden" accept="image/*" onChange={handleLicenseUpload} />
                                </label>
                            </div>
                        </>
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center p-4 w-full h-full justify-center hover:bg-gray-100 transition">
                            <CameraIcon className="w-10 h-10 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Add a photo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleLicenseUpload} />
                        </label>
                    )}
                </div>
            </div>

            {/* CV Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Curriculum Vitae (CV)</h3>
                <div className="relative w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center group">
                    {uploading.cv ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    ) : cv?.fileUrl ? (
                        <div className="text-center p-4">
                            <DocumentTextIcon className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{cv.fileName}</p>
                            <div className="flex gap-2 justify-center mt-4">
                                <a href={cv.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">View</a>
                                <label className="cursor-pointer text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300">
                                    Replace
                                    <input type="file" className="hidden" accept="application/pdf" onChange={handleCvUpload} />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center p-4 w-full h-full justify-center hover:bg-gray-100 transition">
                            <CloudArrowUpIcon className="w-10 h-10 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Import PDF</span>
                            <input type="file" className="hidden" accept="application/pdf" onChange={handleCvUpload} />
                        </label>
                    )}
                </div>
            </div>
        </div>

        {/* Experience List */}
        <ProfessionalExperience />
    </div>
  );
};

export default Page;
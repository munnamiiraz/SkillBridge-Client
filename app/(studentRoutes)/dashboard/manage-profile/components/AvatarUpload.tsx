"use client"
import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentImage, 
  onImageChange, 
  isUploading, 
  setIsUploading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, we'll use a local preview. In a real app, upload to Cloudinary/S3
    setIsUploading(true);
    try {
      // Simulating upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
      toast.success('Image selected! Don\'t forget to save changes.');
    } catch (error) {
      toast.error('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-indigo-50 dark:ring-indigo-900/30 group-hover:ring-indigo-500 transition-all duration-300">
            <img 
              src={currentImage} 
              alt="Profile" 
              className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`}
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"
            disabled={isUploading}
          >
            <Camera size={18} />
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Change Avatar</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-xs mx-auto sm:mx-0">
            Upload a profile picture to help teachers and peers identify you in sessions.
          </p>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition-colors text-sm"
          >
            {isUploading ? 'Processing...' : 'Select Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

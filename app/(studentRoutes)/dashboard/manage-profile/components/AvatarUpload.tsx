"use client"
import React from 'react';
import { ImageUpload } from '@/components/common/ImageUpload';

interface AvatarUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentImage, 
  onImageChange, 
  setIsUploading 
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
      <ImageUpload 
        label="Profile Picture" 
        defaultValue={currentImage} 
        onUploadSuccess={(url) => {
          onImageChange(url);
          // Optional: You can also call setIsUploading(false) if needed, 
          // but ImageUpload handles its own internal loading state.
        }} 
      />
      <div className="mt-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
          Upload a profile picture to help teachers and peers identify you in sessions. Your photo will be stored securely on Cloudinary.
        </p>
      </div>
    </div>
  );
};

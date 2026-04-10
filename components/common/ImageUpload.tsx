'use client';

import React, { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  defaultValue?: string;
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUploadSuccess, 
  defaultValue, 
  label = "Profile Picture",
  className = "" 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultValue || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Create a local blob URL for immediate preview
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPreview(result.data.url);
        onUploadSuccess(result.data.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUploadSuccess('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>}
      
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden flex items-center justify-center transition-all group-hover:border-indigo-500 shadow-inner">
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                {!uploading && (
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </>
            ) : (
              <div className="text-center p-4">
                <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">No Image</p>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <input
            type="file"
            id="profile-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label
            htmlFor="profile-upload"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 text-gray-700 dark:text-white font-bold rounded-xl cursor-pointer transition-all active:scale-95 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="w-4 h-4" />
            {preview ? 'Change Image' : 'Upload Image'}
          </label>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG or WebP. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );
};

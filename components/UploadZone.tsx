import React, { useRef, useState } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  t: any;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, selectedFile, t }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(t.upload.errorType);
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold font-brand text-slate-800 mb-3">{t.upload.label}</label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative w-full h-80 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-[#FF6B3D] bg-orange-50/50 scale-[1.01]' 
            : 'border-slate-200 hover:border-[#FF6B3D]/50 hover:bg-slate-50/50 bg-white/40'}
          ${selectedFile ? 'border-solid border-[#FF6B3D]/20' : ''}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
        />
        
        {selectedFile ? (
          <div className="relative w-full h-full p-4 group">
            <img 
              src={URL.createObjectURL(selectedFile)} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-sm">
              <span className="text-white font-bold bg-white/20 px-6 py-2 rounded-full backdrop-blur-md border border-white/30">{t.upload.replace}</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
              <svg className="w-8 h-8 text-[#FF6B3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-900 font-bold font-brand text-xl mb-1">{t.upload.title}</p>
            <p className="text-slate-500 font-medium">{t.upload.subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';

interface ResultViewProps {
  originalImage: File | null;
  generatedImage: string | null;
  onDownload: () => void;
  onReset: () => void;
  t: any;
}

export const ResultView: React.FC<ResultViewProps> = ({ originalImage, generatedImage, onDownload, onReset, t }) => {
  if (!generatedImage) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-panel p-2 rounded-3xl orange-shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Original */}
          <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden group">
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur font-brand text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full z-10">{t.result.original}</div>
            {originalImage && (
               <img 
                 src={URL.createObjectURL(originalImage)} 
                 alt="Original" 
                 className="w-full h-full object-contain p-8 mix-blend-multiply opacity-80"
               />
            )}
          </div>
          
          {/* Generated */}
          <div className="relative aspect-square bg-slate-900 rounded-2xl overflow-hidden group">
            <div className="absolute top-4 left-4 bg-[#FF6B3D] text-white font-brand text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg shadow-orange-500/40">{t.result.generated}</div>
            <img 
              src={generatedImage} 
              alt="Generated Context" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onReset}
          className="flex-1 py-4 px-6 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold font-brand hover:border-slate-300 hover:bg-slate-50 transition-colors"
        >
          {t.result.restart}
        </button>
        <button
          onClick={onDownload}
          className="flex-1 py-4 px-6 bg-slate-900 text-white font-bold font-brand rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>{t.result.download}</span>
        </button>
      </div>
    </div>
  );
};
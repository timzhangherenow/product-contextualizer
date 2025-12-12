import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
  t: any;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected, t }) => {
  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      onKeySelected();
    } else {
      alert("AI Studio environment not detected.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-10 text-center animate-fade-in-up border border-white/50">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-[#FF6B3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 19.336 9.53 19.88 7.88 18.23l.717-3.483 5.105-5.105a6 6 0 014.298-2.652zM5 20l5.105-5.105" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold font-brand text-slate-900 mb-4">{t.apiKey.title}</h2>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
          {t.apiKey.desc}
        </p>
        
        <button
          onClick={handleSelectKey}
          className="w-full py-4 px-6 bg-[#FF6B3D] hover:bg-[#E55A2B] text-white font-bold font-brand text-lg rounded-2xl shadow-lg shadow-orange-500/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t.apiKey.button}
        </button>

        <p className="mt-8 text-xs text-slate-400 font-medium">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6B3D] transition-colors underline decoration-slate-300 hover:decoration-[#FF6B3D]">
            {t.apiKey.billing}
          </a>
        </p>
      </div>
    </div>
  );
};
import React from 'react';
import { ProductConfig } from '../types';

interface ControlsProps {
  config: ProductConfig;
  onChange: (newConfig: ProductConfig) => void;
  disabled: boolean;
  onGenerate: () => void;
  t: any;
}

export const Controls: React.FC<ControlsProps> = ({ config, onChange, disabled, onGenerate, t }) => {
  
  const handleChange = (field: keyof ProductConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  const isReady = config.scenario.trim().length > 0;

  const resolutionOptions = [
    { value: '1K', label: '1K', speed: t.controls.speeds.fast },
    { value: '2K', label: '2K', speed: t.controls.speeds.medium },
    { value: '4K', label: '4K', speed: t.controls.speeds.slow },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Region Input */}
        <div className="space-y-3">
          <label className="block text-sm font-bold font-brand text-slate-800">
            {t.controls.regionLabel} <span className="text-slate-400 font-medium ml-1 text-xs uppercase tracking-wider">{t.controls.optional}</span>
          </label>
          <input
            type="text"
            value={config.region}
            onChange={(e) => handleChange('region', e.target.value)}
            placeholder={t.controls.regionPlaceholder}
            className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-[#FF6B3D] focus:ring-4 focus:ring-[#FF6B3D]/10 transition-all outline-none placeholder:text-slate-300 font-medium text-slate-700"
            disabled={disabled}
          />
        </div>

        {/* Resolution Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-bold font-brand text-slate-800">{t.controls.resolutionLabel}</label>
          <div className="grid grid-cols-3 gap-3">
            {resolutionOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange('resolution', opt.value)}
                disabled={disabled}
                className={`
                  py-3 px-2 rounded-2xl transition-all duration-200 flex flex-col items-center justify-center gap-0.5
                  ${config.resolution === opt.value
                    ? 'bg-[#FF6B3D] text-white shadow-lg shadow-orange-500/30 translate-y-[-2px]'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-[#FF6B3D]/30 hover:bg-orange-50/30'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <span className="text-sm font-bold font-brand">{opt.label}</span>
                <span className={`text-[11px] font-medium ${config.resolution === opt.value ? 'text-orange-100' : 'text-slate-400'}`}>
                  {opt.speed}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Text Area */}
      <div className="space-y-3">
        <label className="block text-sm font-bold font-brand text-slate-800">
          {t.controls.scenarioLabel} <span className="text-[#FF6B3D] ml-0.5">*</span>
        </label>
        <textarea
          value={config.scenario}
          onChange={(e) => handleChange('scenario', e.target.value)}
          placeholder={t.controls.scenarioPlaceholder}
          rows={3}
          className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-[#FF6B3D] focus:ring-4 focus:ring-[#FF6B3D]/10 transition-all outline-none resize-none placeholder:text-slate-300 font-medium text-slate-700 leading-relaxed"
          disabled={disabled}
        />
      </div>

      {/* Generate Button */}
      <div className="pt-2">
        <button
          onClick={onGenerate}
          disabled={disabled || !isReady}
          className={`
            w-full py-5 px-6 rounded-2xl font-extrabold font-brand text-lg flex items-center justify-center space-x-3 transition-all duration-300 transform
            ${disabled || !isReady
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-[#FF6B3D] text-white hover:bg-[#E55A2B] shadow-[0_20px_40px_-10px_rgba(255,107,61,0.5)] hover:shadow-[0_25px_50px_-12px_rgba(255,107,61,0.6)] hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
        >
          <span>{disabled && isReady ? t.controls.generatingBtn : t.controls.generateBtn}</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
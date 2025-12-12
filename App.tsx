import React, { useState, useEffect } from 'react';
import { UploadZone } from './components/UploadZone';
import { Controls } from './components/Controls';
import { ResultView } from './components/ResultView';
import { LoginScreen } from './components/LoginScreen';
import { AdminPanel } from './components/AdminPanel';
import { generateProductContext } from './services/geminiService';
import { userService, ADMIN_EMAIL } from './services/userService';
import { ProductConfig, AppState, User, Language } from './types';
import { translations } from './locales';

const HereNowLogo = () => (
  <div className="flex items-baseline gap-2.5 select-none">
    <span className="font-logo text-[#FF6B3D] text-4xl tracking-wide leading-none">
      HereNow
    </span>
    <span className="font-brand font-bold text-slate-500 text-lg tracking-tight hidden sm:inline-block">
      Product Contextualizer
    </span>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [config, setConfig] = useState<ProductConfig>({
    region: '',
    scenario: '',
    resolution: '1K',
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Language State
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('pca_lang');
    return (saved === 'en' || saved === 'zh') ? saved : 'zh';
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('pca_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  useEffect(() => {
    // When app loads, try to find user in localStorage.
    const savedUserJson = localStorage.getItem('pca_user');
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        // Refresh from DB to get latest balance
        const freshUser = userService.refreshUser(savedUser.id);
        if (freshUser) {
          setUser(freshUser);
        } else {
          // If user in local storage doesn't exist in DB (edge case), force logout
          localStorage.removeItem('pca_user');
        }
      } catch (e) {
        localStorage.removeItem('pca_user');
      }
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('pca_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pca_user');
    setAppState(AppState.IDLE);
    setSelectedFile(null);
    setGeneratedImage(null);
    setConfig({ region: '', scenario: '', resolution: '1K' });
  };

  const handleUserUpdate = () => {
    if (user) {
      const updated = userService.refreshUser(user.id);
      if (updated) {
        setUser(updated);
        localStorage.setItem('pca_user', JSON.stringify(updated));
      }
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !user) return;

    // Check Balance
    if (user.balance <= 0) {
      setErrorMessage(t.controls.insufficientBalanceError);
      setAppState(AppState.IDLE); 
      return;
    }

    setAppState(AppState.GENERATING);
    setErrorMessage(null);

    try {
      const resultImageUrl = await generateProductContext(selectedFile, config);
      
      // Deduct Credit on Success
      const updatedUser = userService.deductBalance(user.id);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('pca_user', JSON.stringify(updatedUser));
      }

      setGeneratedImage(resultImageUrl);
      setAppState(AppState.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMessage(error.message || t.controls.generateError);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `herenow-context-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setErrorMessage(null);
  };

  if (!user) {
    return (
      <>
        <div className="absolute top-6 right-6 z-50">
           <button 
             onClick={toggleLanguage}
             className="px-3 py-1.5 rounded-full bg-white/50 hover:bg-white backdrop-blur border border-slate-200 text-slate-600 font-bold text-xs transition-all shadow-sm"
           >
             {lang === 'zh' ? 'EN' : '中文'}
           </button>
        </div>
        <LoginScreen onLogin={handleLogin} t={t} />
      </>
    );
  }

  const isAdmin = userService.isAdmin(user.email);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      
      {showAdminPanel && isAdmin && (
        <AdminPanel 
          currentUser={user}
          onClose={() => setShowAdminPanel(false)} 
          onUserUpdate={handleUserUpdate}
          t={t}
        />
      )}

      {/* Glass Header */}
      <header className="sticky top-0 z-30 glass-panel border-b-0 border-b-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <HereNowLogo />
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-6">
             {/* Language Toggle */}
             <button 
                onClick={toggleLanguage}
                className="hidden sm:block px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
             >
               {lang === 'zh' ? 'EN' : '中文'}
             </button>

             {isAdmin && (
               <button 
                onClick={() => setShowAdminPanel(true)}
                className="hidden sm:flex items-center px-4 py-2 bg-slate-800 text-white rounded-full text-xs font-bold hover:bg-slate-700 transition-colors"
               >
                 <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 {t.header.adminPanel}
               </button>
             )}

             {/* Balance Display */}
             <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center ${
               user.balance > 0 ? 'bg-orange-100 text-[#FF6B3D]' : 'bg-red-100 text-red-500'
             }`}>
               <span>{t.header.balance}: {user.balance} {t.header.unit}</span>
             </div>

             {/* User Profile Menu */}
             <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 ml-2">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-slate-900 font-brand">{user.name}</p>
                 <button onClick={handleLogout} className="text-xs font-medium text-slate-500 hover:text-[#FF6B3D] transition-colors">{t.header.logout}</button>
               </div>
               <div className="p-0.5 rounded-full border border-white shadow-sm bg-white cursor-pointer" onClick={isAdmin ? () => setShowAdminPanel(true) : undefined}>
                 <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Introduction */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 font-brand tracking-tight leading-tight">
              {t.hero.title1}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B3D] to-orange-400">{t.hero.title2}</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Feature Demonstration (Before/After) */}
          <div className="max-w-4xl mx-auto mb-16 px-2">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative">
              
              {/* Card 1: Raw Product */}
              <div className="relative group w-full max-w-xs md:max-w-sm">
                <div className="absolute inset-0 bg-white/60 rounded-[2rem] blur-xl transform group-hover:scale-105 transition-transform duration-500 opacity-60"></div>
                <div className="relative glass-panel p-3 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[4/3] bg-white rounded-[1.5rem] overflow-hidden relative flex items-center justify-center border border-slate-100">
                    <span className="absolute top-4 left-4 bg-slate-100/90 backdrop-blur-md text-slate-500 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 z-10 shadow-sm">
                      {t.hero.demoRaw}
                    </span>
                    <img 
                      src="https://raw.githubusercontent.com/timzhangherenow/website/a8a60d246727ffcfbfc1bd96cb2d6cee8b8b2eef/images/Light.webp" 
                      className="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-500" 
                      alt="Raw LED Light Product" 
                    />
                  </div>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="flex-shrink-0 z-10 relative">
                 <div className="w-12 h-12 bg-white rounded-full shadow-xl shadow-orange-500/20 flex items-center justify-center text-[#FF6B3D] border border-orange-50 transform rotate-90 md:rotate-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                 </div>
              </div>

              {/* Card 2: Contextualized Result */}
              <div className="relative group w-full max-w-xs md:max-w-sm">
                <div className="absolute inset-0 bg-orange-200/40 rounded-[2rem] blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                <div className="relative glass-panel p-3 rounded-[2rem] border-[#FF6B3D]/20 shadow-lg shadow-orange-500/10">
                  <div className="aspect-[4/3] bg-slate-900 rounded-[1.5rem] overflow-hidden relative border border-white/10">
                    <span className="absolute top-4 left-4 bg-[#FF6B3D] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                      {t.hero.demoContext}
                    </span>
                    <img 
                      src="https://raw.githubusercontent.com/timzhangherenow/website/a8a60d246727ffcfbfc1bd96cb2d6cee8b8b2eef/images/cold%20storage.jpeg" 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                      alt="Product in Cold Storage Context" 
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Upload & Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <UploadZone 
                  onFileSelect={setSelectedFile} 
                  selectedFile={selectedFile} 
                  t={t}
                />
              </div>
              
              <div className="glass-panel p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <Controls 
                  config={config} 
                  onChange={setConfig} 
                  onGenerate={handleGenerate}
                  disabled={!selectedFile || appState === AppState.GENERATING || !!generatedImage || user.balance <= 0}
                  t={t}
                />
                {user.balance <= 0 && !generatedImage && (
                  <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 text-center">
                    <p className="text-sm text-red-600 font-bold">{t.controls.insufficientBalance}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Results & Status */}
            <div className="lg:col-span-7">
              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-md border border-red-100 text-red-600 rounded-2xl flex items-center font-medium shadow-sm">
                   <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <span>{errorMessage}</span>
                </div>
              )}

              {/* Idle State / Placeholder */}
              {appState === AppState.IDLE && !generatedImage && (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200/60 rounded-3xl bg-white/30 backdrop-blur-sm">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold font-brand text-slate-300">{t.status.idleTitle}</p>
                </div>
              )}

              {/* Generating State */}
              {appState === AppState.GENERATING && (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center glass-panel rounded-3xl orange-shadow border-white/60 p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/50 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-8">
                       <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-[#FF6B3D] rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h3 className="text-2xl font-extrabold font-brand text-slate-900 mb-2">{t.status.magicTitle}</h3>
                    <p className="text-slate-500 font-medium text-center max-w-xs">
                      {t.status.magicDesc} <span className="text-[#FF6B3D]">{config.region || t.controls.regionPlaceholder}</span><br/>
                      {t.status.magicScenario} {config.scenario}
                    </p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {(appState === AppState.SUCCESS || generatedImage) && (
                <ResultView 
                  originalImage={selectedFile}
                  generatedImage={generatedImage}
                  onDownload={handleDownload}
                  onReset={handleReset}
                  t={t}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-sm font-medium">
        <p>&copy; {new Date().getFullYear()} {t.common.appName}. {t.common.poweredBy}</p>
      </footer>
    </div>
  );
};

export default App;
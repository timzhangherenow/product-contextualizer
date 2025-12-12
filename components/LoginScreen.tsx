import React, { useState } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  t: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, t }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Log in as a standard demo user instead of admin
      // This creates a user if they don't exist
      const user = userService.login('guest@herenow.ai');
      onLogin(user);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-white to-orange-50">
      
      <div className="w-full max-w-md glass-panel p-10 rounded-3xl orange-shadow animate-fade-in-up relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <div className="mb-8">
            <span className="font-logo text-[#FF6B3D] text-6xl tracking-wide block">
              HereNow
            </span>
            <span className="font-brand font-bold text-slate-400 text-lg tracking-tight block mt-1">
              {t.common.appSubtitle}
            </span>
          </div>
          
          <h1 className="text-2xl font-extrabold font-brand text-slate-900 mb-2">{t.auth.welcome}</h1>
          <p className="text-slate-500 font-medium mb-10">{t.auth.subtitle}</p>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`
              w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-bold text-white transition-all transform duration-200
              ${isLoading 
                ? 'bg-orange-300 cursor-wait' 
                : 'bg-[#FF6B3D] hover:bg-[#E55A2B] hover:scale-[1.02] shadow-[0_10px_25px_-5px_rgba(255,107,61,0.4)]'
              }
            `}
          >
            {isLoading ? (
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              <>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1">
                   <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <span>{t.auth.loginButton}</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-xs">
        &copy; {new Date().getFullYear()} {t.common.appName}. {t.common.rights}
      </p>
    </div>
  );
};
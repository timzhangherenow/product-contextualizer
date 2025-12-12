export interface ProductConfig {
  region: string;
  scenario: string;
  resolution: '1K' | '2K' | '4K';
}

export interface GeneratedResult {
  imageUrl: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type Language = 'zh' | 'en';

// Simple interface for the translation object structure
export interface Translation {
  [key: string]: any;
}

// Augment global types
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
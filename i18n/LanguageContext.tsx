
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to get language from local storage, default to 'fr'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('mmv_language');
    return (saved === 'fr' || saved === 'en') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('mmv_language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    // Simple lookup only for now as structure is flat-ish in translations.ts
    // For deeper structures, we would traverse the object.
    // Given translations.ts structure is flat keys like 'nav.home':
    
    if (value[key]) {
        return value[key];
    }

    // If key not found, try to look it up in French as fallback
    if (translations['fr'][key as keyof typeof translations['fr']]) {
        return translations['fr'][key as keyof typeof translations['fr']];
    }

    return key; // Return key if translation missing
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

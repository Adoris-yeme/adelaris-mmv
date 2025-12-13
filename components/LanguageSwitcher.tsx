
import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center bg-stone-100 dark:bg-stone-800 rounded-full p-1 ${className}`}>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
          language === 'fr'
            ? 'bg-white dark:bg-stone-600 text-orange-900 dark:text-white shadow-sm'
            : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
          language === 'en'
            ? 'bg-white dark:bg-stone-600 text-orange-900 dark:text-white shadow-sm'
            : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;

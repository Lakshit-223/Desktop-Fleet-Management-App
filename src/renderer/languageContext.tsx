import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

// Define available languages
type Language = 'en' | 'ur';

// Define the shape of the context
interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create the Provider Component
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');

  // Function to toggle between English and Urdu
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ur' : 'en'));
  };
  
  // Function to retrieve text from dictionary
  const t = (key: string) => {
    // Attempt to find the key in the current language
    // If key is missing, fallback to the key itself (so UI doesn't break)
    return translations[lang][key as keyof typeof translations['en']] || key;
  };

  // Handle Side Effects (Font change, RTL direction)
  useEffect(() => {
    // 1. Set HTML lang attribute (for accessibility/browser)
    document.documentElement.lang = lang;
    
    // 2. Set Text Direction (Left-to-Right or Right-to-Left)
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    
    // 3. Change Font Family based on language
    if (lang === 'ur') {
      // Urdu needs a specific Nastaliq font
      document.body.style.fontFamily = "'Noto Nastaliq Urdu', serif";
    } else {
      // English uses default sans-serif
      document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook to easily use the context in components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
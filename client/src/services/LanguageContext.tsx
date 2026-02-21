import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language } from '../locales/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: async () => { },
    t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLang = await AsyncStorage.getItem('user_language');
            if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'bn')) {
                setLanguageState(savedLang as Language);
            }
        } catch (error) {
            console.error('Failed to load language', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const setLanguage = async (newLang: Language) => {
        try {
            await AsyncStorage.setItem('user_language', newLang);
            setLanguageState(newLang);
        } catch (error) {
            console.error('Failed to save language', error);
        }
    };

    // Translation function matching the current language
    const t = (key: string): string => {
        if (!translations[language]) return key;
        const translated = translations[language][key];
        return translated !== undefined ? translated : key; // Fallback to key if missing
    };

    if (!isLoaded) return null; // Avoid flicker before loading

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

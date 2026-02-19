import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    activeTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('system');
    const systemColorScheme = useColorScheme();
    const { setColorScheme } = useNativeWindColorScheme();

    useEffect(() => {
        loadTheme();
    }, []);

    useEffect(() => {
        updateTheme(theme);
    }, [theme, systemColorScheme]);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('user_theme');
            if (savedTheme) {
                setTheme(savedTheme as Theme);
            }
        } catch (error) {
            console.error('Failed to load theme', error);
        }
    };

    const updateTheme = async (newTheme: Theme) => {
        let activeMode: 'light' | 'dark' = 'light';

        if (newTheme === 'system') {
            activeMode = systemColorScheme === 'dark' ? 'dark' : 'light';
        } else {
            activeMode = newTheme;
        }

        setColorScheme(activeMode);
        try {
            await AsyncStorage.setItem('user_theme', newTheme);
        } catch (error) {
            // Ignore write errors
        }
    };

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
    };

    // Derived active theme for UI logic that needs to know concrete current mode
    const activeTheme = theme === 'system'
        ? (systemColorScheme === 'dark' ? 'dark' : 'light')
        : theme;

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, activeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};

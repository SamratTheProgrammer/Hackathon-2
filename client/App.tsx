import "./global.css";
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { OfflineProvider } from './src/services/OfflineContext';
import { ThemeProvider, useTheme } from './src/services/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import * as Font from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { View, ActivityIndicator } from 'react-native';
import { ToastProvider } from './src/components/ui/Toast';
import { LanguageProvider } from './src/services/LanguageContext';

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0F172A', // Slate 900
    card: '#0F172A',
    border: '#1E293B',
    text: '#FFFFFF',
  },
};

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8FAFC', // Slate 50
    card: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
  },
};

const NavigationContainerWithTheme = () => {
  const { activeTheme } = useTheme();

  return (
    <NavigationContainer theme={activeTheme === 'dark' ? MyDarkTheme : MyLightTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        'Inter': Inter_400Regular,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-bg">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ToastProvider>
      <LanguageProvider>
        <OfflineProvider>
          <ThemeProvider>
            <NavigationContainerWithTheme />
          </ThemeProvider>
        </OfflineProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}

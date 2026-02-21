import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../screens/Home';
import { Pay } from '../screens/Pay';
import { Receive } from '../screens/Receive';
import { Activity } from '../screens/Activity';
import { Wallet } from '../screens/Wallet';
import { Profile } from '../screens/Profile';
import { Onboarding } from '../screens/Onboarding';
import { AddBank } from '../screens/AddBank';
import { useOffline } from '../services/OfflineContext';
import { useTheme } from '../services/ThemeContext';
import { View, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Home as HomeIcon, ScanLine, QrCode, History, Wallet as WalletIcon, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTabIcon = ({ icon: Icon, focused, color, size }: { icon: any, focused: boolean, color: string, size: number }) => {
    return (
        <View className={`items-center justify-center w-12 h-12 rounded-2xl ${focused ? 'bg-primary/10' : 'bg-transparent'}`}>
            <Icon color={focused ? '#2563EB' : '#94A3B8'} size={24} strokeWidth={focused ? 2.5 : 2} />
        </View>
    );
};

const TabNavigator = () => {
    const { activeTheme } = useTheme();
    const isDark = activeTheme === 'dark';

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: Platform.OS === 'ios' ? 88 : 68,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
                    paddingTop: 12,
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderTopColor: isDark ? '#1E293B' : '#E2E8F0',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderTopWidth: 1,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused, color, size }) => <CustomTabIcon icon={HomeIcon} focused={focused} color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Pay"
                component={Pay}
                options={{
                    tabBarIcon: ({ focused, color, size }) => <CustomTabIcon icon={ScanLine} focused={focused} color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Receive"
                component={Receive}
                options={{
                    tabBarIcon: ({ focused, color, size }) => <CustomTabIcon icon={QrCode} focused={focused} color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Activity"
                component={Activity}
                options={{
                    tabBarIcon: ({ focused, color, size }) => <CustomTabIcon icon={History} focused={focused} color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Wallet"
                component={Wallet}
                options={{
                    tabBarIcon: ({ focused, color, size }) => <CustomTabIcon icon={WalletIcon} focused={focused} color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused, color, size }) => <CustomTabIcon icon={User} focused={focused} color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
};

export const RootNavigator = () => {
    const { user, isLoading } = useOffline();
    const { activeTheme } = useTheme();

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-neutral-bg dark:bg-neutral-900">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-neutral-bg dark:bg-neutral-900" onLayout={() => { }}>
            <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} backgroundColor={activeTheme === 'dark' ? '#0F172A' : '#F8FAFC'} />
            <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: activeTheme === 'dark' ? '#0F172A' : '#F8FAFC' } }}>
                {user ? (
                    <>
                        <Stack.Screen name="Main" component={TabNavigator} />
                        <Stack.Screen name="AddBank" component={AddBank} options={{ headerShown: false }} />
                    </>
                ) : (
                    <Stack.Screen name="Onboarding" component={Onboarding} />
                )}
            </Stack.Navigator>
        </View>
    );
};

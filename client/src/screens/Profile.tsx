import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { Card, ScreenWrapper } from '../components/ui';
import { User, Settings, Bell, Shield, CircleHelp, LogOut, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../services/ThemeContext';

const SettingItem = ({ icon, label, value, onPress, sublabel }: { icon: any, label: string, value?: boolean | string, onPress?: () => void, sublabel?: string }) => (
    <TouchableOpacity
        className="flex-row items-center justify-between p-4 border-b border-neutral-border dark:border-neutral-700 bg-white dark:bg-neutral-800 last:border-b-0"
        onPress={onPress}
        disabled={!onPress}
    >
        <View className="flex-row items-center">
            <View className="mr-3 p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{icon}</View>
            <View>
                <Text className="text-neutral-text dark:text-white font-medium">{label}</Text>
                {sublabel && <Text className="text-neutral-text-secondary dark:text-neutral-400 text-xs">{sublabel}</Text>}
            </View>
        </View>
        {typeof value === 'boolean' ? (
            <Switch value={value} onValueChange={onPress} trackColor={{ true: '#10B981', false: '#e2e8f0' }} thumbColor={value ? '#fff' : '#f4f4f5'} />
        ) : value ? (
            <Text className="text-neutral-text-secondary dark:text-neutral-400 font-medium">{value}</Text>
        ) : (
            <ChevronRight size={20} color="#94A3B8" />
        )}
    </TouchableOpacity>
);

export const Profile = () => {
    const { user, logout } = useOffline();
    const [biometrics, setBiometrics] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout }
        ]);
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="bg-white dark:bg-neutral-800 p-6 mb-4 items-center border-b border-neutral-border dark:border-neutral-700 shadow-sm">
                    <View className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center mb-4 border border-primary/20">
                        <Text className="text-4xl font-bold text-primary dark:text-blue-400">{user?.name ? user.name[0] : 'U'}</Text>
                    </View>
                    <Text className="text-xl font-bold text-neutral-text dark:text-white">{user?.name}</Text>
                    <Text className="text-neutral-text-secondary dark:text-neutral-400">{user?.upiId}</Text>
                    <View className="mt-2 bg-gray-100 dark:bg-neutral-700 px-3 py-1 rounded-full">
                        <Text className="text-gray-600 dark:text-gray-300 text-xs font-medium">+91 {user?.phone}</Text>
                    </View>
                </View>

                <View className="px-4">
                    <Text className="px-1 py-3 text-secondary font-bold text-xs uppercase tracking-wider">Security</Text>
                    <View className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-border dark:border-neutral-700 shadow-sm mb-6">
                        <SettingItem
                            icon={<Shield size={20} color="#64748B" />}
                            label="Change PIN"
                            onPress={() => Alert.alert('Coming Soon', 'PIN change flow placeholder')}
                        />
                        <SettingItem
                            icon={<User size={20} color="#64748B" />}
                            label="Biometric Login"
                            sublabel="Use FaceID/Fingerprint"
                            value={biometrics}
                            onPress={() => setBiometrics(!biometrics)}
                        />
                    </View>

                    <Text className="px-1 py-3 text-secondary font-bold text-xs uppercase tracking-wider">Preferences</Text>
                    <View className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-border dark:border-neutral-700 shadow-sm mb-6">
                        <SettingItem
                            icon={<Bell size={20} color="#64748B" />}
                            label="Notifications"
                            value={notifications}
                            onPress={() => setNotifications(!notifications)}
                        />
                        <SettingItem
                            icon={<Settings size={20} color="#64748B" />}
                            label="Language"
                            value="English"
                            onPress={() => { }}
                        />
                    </View>

                    <Text className="px-1 py-3 text-secondary font-bold text-xs uppercase tracking-wider">Appearance</Text>
                    <View className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-border dark:border-neutral-700 shadow-sm mb-6">
                        <SettingItem
                            icon={<Settings size={20} color="#64748B" />}
                            label="Dark Mode"
                            value={theme === 'dark'}
                            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        />
                    </View>

                    <Text className="px-1 py-3 text-secondary font-bold text-xs uppercase tracking-wider">Support</Text>
                    <View className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-border dark:border-neutral-700 shadow-sm mb-8">
                        <SettingItem
                            icon={<CircleHelp size={20} color="#64748B" />}
                            label="Help & FAQ"
                            onPress={() => { }}
                        />
                        <SettingItem
                            icon={<Shield size={20} color="#64748B" />}
                            label="Privacy Policy"
                            onPress={() => { }}
                        />
                    </View>

                    <Button
                        title="Logout"
                        variant="ghost"
                        icon={<LogOut size={18} color="#ef4444" />}
                        className="border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 mb-4"
                        textClassName="text-red-600 dark:text-red-400"
                        onPress={handleLogout}
                    />
                    <Text className="text-center text-xs text-neutral-text-secondary dark:text-neutral-500 mt-2">Version 1.0.0 (Hackathon Build)</Text>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

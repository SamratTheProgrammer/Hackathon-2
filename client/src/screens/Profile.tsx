import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert, TextInput, Modal, Platform } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { Card, ScreenWrapper } from '../components/ui';
import { User, Settings, Bell, Shield, CircleHelp, LogOut, ChevronRight, Edit3, X, Save, Mail, Phone as PhoneIcon, Globe } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../services/ThemeContext';
import { useLanguage } from '../services/LanguageContext';

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
    const { user, logout, updateUserProfile } = useOffline();
    const [biometrics, setBiometrics] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const navigation = useNavigation<any>();

    // Edit profile state
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLangModal, setShowLangModal] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const handleEditProfile = () => {
        setEditName(user?.name || '');
        setShowEditModal(true);
    };

    const handleSaveProfile = async () => {
        if (!editName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setIsUpdating(true);
        const success = await updateUserProfile({ name: editName.trim() });
        setIsUpdating(false);

        if (success) {
            setShowEditModal(false);
            Alert.alert('Success', 'Profile updated successfully!');
        }
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                {user ? (
                    <View className="bg-white dark:bg-neutral-800 p-6 mb-4 items-center border-b border-neutral-border dark:border-neutral-700 shadow-sm">
                        <View className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center mb-4 border border-primary/20">
                            <Text className="text-4xl font-bold text-primary dark:text-blue-400">{user.name ? user.name[0] : 'U'}</Text>
                        </View>
                        <Text className="text-xl font-bold text-neutral-text dark:text-white">{user.name}</Text>
                        {user.email && (
                            <View className="flex-row items-center mt-1">
                                <Mail size={14} color="#94A3B8" />
                                <Text className="text-neutral-text-secondary dark:text-neutral-400 ml-1">{user.email}</Text>
                            </View>
                        )}
                        {user.phone && (
                            <View className="mt-2 bg-gray-100 dark:bg-neutral-700 px-3 py-1 rounded-full">
                                <Text className="text-gray-600 dark:text-gray-300 text-xs font-medium">+91 {user.phone}</Text>
                            </View>
                        )}
                        {user.accountNumber && (
                            <View className="mt-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                                <Text className="text-primary dark:text-blue-400 text-xs font-medium">A/C: {user.accountNumber}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={handleEditProfile}
                            className="mt-3 flex-row items-center bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full"
                        >
                            <Edit3 size={14} color="#2563EB" />
                            <Text className="text-primary dark:text-blue-400 font-semibold text-sm ml-1">Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="bg-white dark:bg-neutral-800 p-6 mb-4 items-center border-b border-neutral-border dark:border-neutral-700 shadow-sm">
                        <View className="w-24 h-24 bg-gray-100 dark:bg-neutral-700 rounded-full items-center justify-center mb-4">
                            <User size={40} color="#94A3B8" />
                        </View>
                        <Text className="text-xl font-bold text-neutral-text dark:text-white mb-2">Not Logged In</Text>
                        <Text className="text-neutral-text-secondary dark:text-neutral-400 text-center mb-4">Login to access your full profile and settings.</Text>
                        <Button
                            title="Login / Sign Up"
                            onPress={() => navigation.navigate('Login')}
                            variant="primary"
                            className="w-full shadow-lg shadow-primary/30"
                        />
                    </View>
                )}

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

                    <Text className="px-1 py-3 text-secondary font-bold text-xs uppercase tracking-wider">{t('preferences')}</Text>
                    <View className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-border dark:border-neutral-700 shadow-sm mb-6">
                        <SettingItem
                            icon={<Bell size={20} color="#64748B" />}
                            label="Notifications"
                            value={notifications}
                            onPress={() => setNotifications(!notifications)}
                        />
                        <SettingItem
                            icon={<Globe size={20} color="#64748B" />}
                            label={t('language')}
                            value={language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'বাংলা'}
                            onPress={() => setShowLangModal(true)}
                        />
                    </View>

                    <Text className="px-1 py-3 text-secondary font-bold text-xs uppercase tracking-wider">Appearance</Text>
                    <View className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-border dark:border-neutral-700 shadow-sm mb-6">
                        <SettingItem
                            icon={<Settings size={20} color="#64748B" />}
                            label={t('dark_mode')}
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

                    {user && (
                        <Button
                            title={t('logout')}
                            variant="ghost"
                            icon={<LogOut size={18} color="#ef4444" />}
                            className="border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 mb-4"
                            textClassName="text-red-600 dark:text-red-400"
                            onPress={handleLogout}
                        />
                    )}
                    <Text className="text-center text-xs text-neutral-text-secondary dark:text-neutral-500 mt-2">Version 1.0.0 (Hackathon Build)</Text>
                </View>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={showEditModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowEditModal(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white dark:bg-neutral-800 rounded-t-3xl p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-neutral-text dark:text-white">Edit Profile</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <X size={24} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-neutral-text dark:text-gray-300 text-sm font-medium mb-1.5">Full Name</Text>
                        <View className="flex-row items-center bg-white dark:bg-neutral-900 border border-neutral-border dark:border-neutral-700 rounded-xl overflow-hidden mb-4">
                            <View className="pl-3 pr-1">
                                <User size={20} color="#94A3B8" />
                            </View>
                            <TextInput
                                className="flex-1 p-3 text-neutral-text dark:text-white text-base"
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="Enter your name"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        {user?.email && (
                            <View className="mb-4">
                                <Text className="text-neutral-text dark:text-gray-300 text-sm font-medium mb-1.5">Email</Text>
                                <View className="flex-row items-center bg-gray-50 dark:bg-neutral-900 border border-neutral-border dark:border-neutral-700 rounded-xl p-3">
                                    <Mail size={20} color="#94A3B8" />
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 ml-2">{user.email}</Text>
                                </View>
                            </View>
                        )}

                        <Button
                            title={t('save')}
                            onPress={handleSaveProfile}
                            variant="primary"
                            loading={isUpdating}
                            disabled={isUpdating}
                            icon={<Save size={18} color="white" />}
                            className="mt-2 shadow-lg shadow-primary/30"
                        />

                        <View className="h-8" />
                    </View>
                </View>
            </Modal>

            {/* Language Selection Modal */}
            <Modal
                visible={showLangModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLangModal(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white dark:bg-neutral-900 rounded-t-3xl p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-neutral-text dark:text-white">{t('select_language')}</Text>
                            <TouchableOpacity onPress={() => setShowLangModal(false)} className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full">
                                <X size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        {['en', 'hi', 'bn'].map((langKey) => (
                            <TouchableOpacity
                                key={langKey}
                                onPress={() => { setLanguage(langKey as any); setShowLangModal(false); }}
                                className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border-2 ${language === langKey ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-neutral-border dark:border-neutral-700 bg-white dark:bg-neutral-800'}`}
                            >
                                <Text className={`text-base font-semibold ${language === langKey ? 'text-primary' : 'text-neutral-text dark:text-white'}`}>
                                    {langKey === 'en' ? 'English' : langKey === 'hi' ? 'हिंदी (Hindi)' : 'বাংলা (Bengali)'}
                                </Text>
                                {language === langKey && <Shield size={20} color="#2563EB" />}
                            </TouchableOpacity>
                        ))}
                        <View className="h-8" />
                    </View>
                </View>
            </Modal>
        </ScreenWrapper>
    );
};

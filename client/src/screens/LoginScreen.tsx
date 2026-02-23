import React, { useState } from 'react';
import { View, Text, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { InputField as Input } from '../components/ui/InputField';
import { ScreenWrapper } from '../components/ui';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useToast } from '../components/ui/Toast';
import { useLanguage } from '../services/LanguageContext';

export const LoginScreen = ({ navigation }: any) => {
    const { login } = useOffline();
    const { showToast } = useToast();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim()) {
            showToast('Please enter your email address', 'error');
            return;
        }
        if (!password.trim()) {
            showToast('Please enter your password', 'error');
            return;
        }

        setIsLoading(true);
        const result = await login(email.trim(), password);
        setIsLoading(false);

        if (result === true) {
            showToast('Login successful!', 'success');
        } else if (typeof result === 'string') {
            showToast(result, 'error');
        }
    };

    return (
        <ScreenWrapper className="bg-neutral-bg dark:bg-neutral-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="items-center mb-12">
                        <View className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-3xl items-center justify-center mb-6 rotate-3">
                            <ShieldCheck size={48} color="#2563EB" />
                        </View>
                        <Text className="text-4xl font-bold text-neutral-text dark:text-white text-center">
                            {t('app_name')}
                        </Text>
                        <Text className="text-neutral-text-secondary dark:text-neutral-400 mt-2 text-center text-lg">
                            {t('tagline')}
                        </Text>
                    </View>

                    {/* Form */}
                    <View>
                        <Input
                            label={t('email_address')}
                            placeholder={t('email_placeholder')}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            icon={<Mail size={20} color="#94A3B8" />}
                        />

                        <View className="relative">
                            <Input
                                label={t('password')}
                                placeholder={t('password_placeholder')}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                icon={<Lock size={20} color="#94A3B8" />}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9"
                                style={{ padding: 8 }}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color="#94A3B8" />
                                ) : (
                                    <Eye size={20} color="#94A3B8" />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                            className="self-end mb-6"
                        >
                            <Text className="text-primary dark:text-blue-400 font-semibold text-sm">
                                {t('forgot_password')}
                            </Text>
                        </TouchableOpacity>

                        <Button
                            title={t('sign_in')}
                            onPress={handleLogin}
                            variant="primary"
                            loading={isLoading}
                            disabled={isLoading}
                            icon={<ArrowRight size={20} color="white" />}
                            className="shadow-lg shadow-primary/30"
                        />
                    </View>

                    {/* Signup Link */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-neutral-text-secondary dark:text-neutral-400 text-base">
                            {t('dont_have_account')}{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text className="text-primary dark:text-blue-400 font-bold text-base">
                                {t('create_account')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-center text-neutral-text-secondary dark:text-neutral-400 text-xs mt-8">
                        {t('terms_privacy')}
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

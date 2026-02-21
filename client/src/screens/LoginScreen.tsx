import React, { useState } from 'react';
import { View, Text, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { InputField as Input } from '../components/ui/InputField';
import { ScreenWrapper } from '../components/ui';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useToast } from '../components/ui/Toast';

export const LoginScreen = ({ navigation }: any) => {
    const { login } = useOffline();
    const { showToast } = useToast();
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
        const success = await login(email.trim(), password);
        setIsLoading(false);

        if (success) {
            showToast('Login successful!', 'success');
        }
        // Errors are handled inside OfflineContext with toasts
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
                            DigiDhan
                        </Text>
                        <Text className="text-neutral-text-secondary dark:text-neutral-400 mt-2 text-center text-lg">
                            Secure Payments, Anywhere.
                        </Text>
                    </View>

                    {/* Form */}
                    <View>
                        <Input
                            label="Email Address"
                            placeholder="name@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            icon={<Mail size={20} color="#94A3B8" />}
                        />

                        <View className="relative">
                            <Input
                                label="Password"
                                placeholder="Enter your password"
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
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        <Button
                            title="Sign In"
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
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text className="text-primary dark:text-blue-400 font-bold text-base">
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-center text-neutral-text-secondary dark:text-neutral-400 text-xs mt-8">
                        By continuing, you agree to our Terms & Privacy Policy
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

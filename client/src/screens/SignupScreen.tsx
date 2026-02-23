import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { InputField as Input } from '../components/ui/InputField';
import { ScreenWrapper } from '../components/ui';
import { ArrowLeft, Mail, User, Phone, Lock, Calendar, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react-native';
import { sendOtpEmail, verifyOtp } from '../services/emailService';
import { useToast } from '../components/ui/Toast';
import { useLanguage } from '../services/LanguageContext';

type SignupStep = 1 | 2;

export const SignupScreen = ({ navigation }: any) => {
    const { signup } = useOffline();
    const { showToast } = useToast();
    const { t } = useLanguage();
    const [step, setStep] = useState<SignupStep>(1);
    const [isLoading, setIsLoading] = useState(false);

    // Step 1: Name, Email, OTP
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [timer, setTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [otpError, setOtpError] = useState('');

    // Step 2: Mobile, DOB, Password
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // OTP refs
    const otpRefs = useRef<(TextInput | null)[]>([]);

    // Fade animation
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const animateTransition = (nextStep: SignupStep) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setStep(nextStep);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        });
    };

    // OTP Timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timerActive && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0) {
            setTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [timerActive, timer]);

    const handleSendOtp = async () => {
        if (!email.trim()) {
            showToast('Please enter your email address', 'error');
            return;
        }
        if (!name.trim()) {
            showToast('Please enter your name', 'error');
            return;
        }

        setSendingOtp(true);
        try {
            const otpCode = await sendOtpEmail(email.trim(), name.trim());
            setGeneratedOtp(otpCode);
            setShowOtpInput(true);
            setTimer(60);
            setTimerActive(true);
            showToast('Verification code sent to your email!', 'success');
        } catch (error) {
            showToast('Failed to send OTP. Please try again.', 'error');
        }
        setSendingOtp(false);
    };

    const handleOtpChange = (value: string, index: number) => {
        setOtpError('');
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 6) {
            setOtpError('Please enter the complete 6-digit OTP');
            return;
        }
        if (!verifyOtp(enteredOtp, generatedOtp)) {
            setOtpError('Invalid OTP. Please check your email and try again.');
            return;
        }
        setIsEmailVerified(true);
        setShowOtpInput(false);
        showToast('Email verified successfully!', 'success');
    };

    const handleGoToStep2 = () => {
        if (!name.trim()) {
            showToast('Please enter your name', 'error');
            return;
        }
        if (!isEmailVerified) {
            showToast('Please verify your email first', 'warning');
            return;
        }
        animateTransition(2);
    };

    const handleSignup = async () => {
        if (!mobile.trim() || mobile.length < 10) {
            showToast('Please enter a valid 10-digit mobile number', 'error');
            return;
        }
        if (!dob.trim()) {
            showToast('Please enter your date of birth (YYYY-MM-DD)', 'error');
            return;
        }
        if (!password.trim() || password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setIsLoading(true);
        const result = await signup({
            name: name.trim(),
            email: email.trim(),
            password,
            mobile: mobile.trim(),
            dob: dob.trim(),
        });
        setIsLoading(false);

        if (result === true) {
            showToast('Account created successfully!', 'success');
        } else if (typeof result === 'string') {
            showToast(result, 'error');
        }
    };

    // OTP digit inputs
    const renderOtpInputs = () => (
        <View className="flex-row justify-center" style={{ gap: 10 }}>
            {otp.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => { otpRefs.current[index] = ref; }}
                    className="w-12 h-14 border-2 rounded-xl text-center text-xl font-bold text-neutral-text dark:text-white bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700"
                    style={{ fontSize: 22 }}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(v) => handleOtpChange(v, index)}
                    onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
                    selectTextOnFocus
                />
            ))}
        </View>
    );

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
                    <Animated.View style={{ opacity: fadeAnim }}>

                        {/* Step Indicator */}
                        <View className="flex-row items-center justify-center mb-6">
                            {[1, 2].map((s) => (
                                <View
                                    key={s}
                                    className={`h-2 rounded-full mx-1 ${s === step ? 'w-8 bg-primary' : s < step ? 'w-2 bg-primary/60' : 'w-2 bg-neutral-border dark:bg-neutral-700'}`}
                                />
                            ))}
                        </View>

                        {/* ======= STEP 1: Name + Email + OTP ======= */}
                        {step === 1 && (
                            <View>
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    className="flex-row items-center mb-6"
                                >
                                    <ArrowLeft size={20} color="#94A3B8" />
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 ml-1 font-medium">{t('back')}</Text>
                                </TouchableOpacity>

                                <View className="items-center mb-8">
                                    <View className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl items-center justify-center mb-4">
                                        <ShieldCheck size={32} color="#2563EB" />
                                    </View>
                                    <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-1">
                                        {t('create_account')}
                                    </Text>
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 text-base text-center">
                                        Step 1: Verify your identity
                                    </Text>
                                </View>

                                <Input
                                    label={t('full_name')}
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChangeText={setName}
                                    icon={<User size={20} color="#94A3B8" />}
                                />

                                <Input
                                    label={t('email_address')}
                                    placeholder={t('email_placeholder')}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={(v: string) => { setEmail(v); setIsEmailVerified(false); setShowOtpInput(false); }}
                                    editable={!isEmailVerified}
                                    icon={<Mail size={20} color="#94A3B8" />}
                                />

                                {isEmailVerified ? (
                                    <View className="flex-row items-center mb-4 px-1">
                                        <CheckCircle size={18} color="#10B981" />
                                        <Text className="text-green-500 ml-2 font-semibold text-sm">Email verified</Text>
                                    </View>
                                ) : (
                                    <Button
                                        title={sendingOtp ? "Sending OTP..." : "Verify Email"}
                                        onPress={handleSendOtp}
                                        variant="primary"
                                        loading={sendingOtp}
                                        disabled={sendingOtp || !email.trim()}
                                        icon={<Mail size={18} color="white" />}
                                        className="mb-4"
                                    />
                                )}

                                {showOtpInput && !isEmailVerified && (
                                    <View className="mb-4">
                                        <Text className="text-neutral-text dark:text-gray-300 text-sm font-medium mb-3">
                                            Enter the 6-digit code sent to {email}
                                        </Text>
                                        {renderOtpInputs()}

                                        {otpError ? (
                                            <Text className="text-status-error text-center text-sm mt-3">{otpError}</Text>
                                        ) : null}

                                        <View className="items-center mt-3 mb-3">
                                            {timer > 0 ? (
                                                <Text className="text-neutral-text-secondary dark:text-neutral-400 text-sm">
                                                    Resend OTP in <Text className="text-primary font-bold">{timer}s</Text>
                                                </Text>
                                            ) : (
                                                <TouchableOpacity onPress={handleSendOtp}>
                                                    <Text className="text-primary font-semibold text-sm">Resend OTP</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        <Button
                                            title="Verify OTP"
                                            onPress={handleVerifyOtp}
                                            variant="primary"
                                            className="shadow-lg shadow-primary/30"
                                        />
                                    </View>
                                )}

                                {isEmailVerified && (
                                    <Button
                                        title="Continue to Step 2"
                                        onPress={handleGoToStep2}
                                        variant="primary"
                                        className="mt-2 shadow-lg shadow-primary/30"
                                    />
                                )}
                            </View>
                        )}

                        {/* ======= STEP 2: Mobile + DOB + Password ======= */}
                        {step === 2 && (
                            <View>
                                <TouchableOpacity
                                    onPress={() => animateTransition(1)}
                                    className="flex-row items-center mb-6"
                                >
                                    <ArrowLeft size={20} color="#94A3B8" />
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 ml-1 font-medium">{t('back')}</Text>
                                </TouchableOpacity>

                                <View className="items-center mb-8">
                                    <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-1">
                                        Almost There!
                                    </Text>
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 text-base text-center">
                                        Step 2: Complete your details
                                    </Text>
                                </View>

                                <Input
                                    label="Mobile Number"
                                    placeholder="10-digit mobile number"
                                    keyboardType="phone-pad"
                                    value={mobile}
                                    onChangeText={setMobile}
                                    maxLength={10}
                                    icon={<Phone size={20} color="#94A3B8" />}
                                />

                                <Input
                                    label="Date of Birth"
                                    placeholder="YYYY-MM-DD"
                                    value={dob}
                                    onChangeText={setDob}
                                    icon={<Calendar size={20} color="#94A3B8" />}
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

                                <Input
                                    label="Confirm Password"
                                    placeholder="Re-enter your password"
                                    secureTextEntry={!showPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    icon={<Lock size={20} color="#94A3B8" />}
                                />

                                <Button
                                    title={t('create_account')}
                                    onPress={handleSignup}
                                    variant="primary"
                                    loading={isLoading}
                                    disabled={isLoading}
                                    className="mt-4 shadow-lg shadow-primary/30"
                                />
                            </View>
                        )}

                        {/* Login Link */}
                        <View className="flex-row justify-center mt-8">
                            <Text className="text-neutral-text-secondary dark:text-neutral-400 text-base">
                                {t('already_have_account')}{' '}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text className="text-primary dark:text-blue-400 font-bold text-base">
                                    {t('sign_in')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

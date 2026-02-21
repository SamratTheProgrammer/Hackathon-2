import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { UiButton as Button } from '../components/ui/UiButton';
import { InputField as Input } from '../components/ui/InputField';
import { ScreenWrapper } from '../components/ui';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react-native';
import { sendOtpEmail, verifyOtp } from '../services/emailService';

const API_URL = 'http://localhost:5000/api';
import { useToast } from '../components/ui/Toast';

type ForgotStep = 1 | 2 | 3;

export const ForgotPasswordScreen = ({ navigation }: any) => {
    const [step, setStep] = useState<ForgotStep>(1);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    // Step 1: Email
    const [email, setEmail] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);

    // Step 2: OTP
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [timer, setTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [resetToken, setResetToken] = useState('');

    // Step 3: New Password
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // OTP refs
    const otpRefs = useRef<(TextInput | null)[]>([]);

    // Fade animation
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const animateTransition = (nextStep: ForgotStep) => {
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

        setSendingOtp(true);
        try {
            // First check if the user exists in AppUser table
            const checkRes = await fetch(`${API_URL}/app-auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });

            if (!checkRes.ok) {
                const err = await checkRes.json();
                showToast(err.message || 'No account found with this email', 'error');
                setSendingOtp(false);
                return;
            }

            const checkData = await checkRes.json();
            setResetToken(checkData.resetToken);

            // Send OTP via EmailJS for email verification
            const otpCode = await sendOtpEmail(email.trim(), 'User');
            setGeneratedOtp(otpCode);

            setTimer(60);
            setTimerActive(true);
            animateTransition(2);
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
            setOtpError('Invalid OTP. Please try again.');
            return;
        }
        animateTransition(3);
    };

    const handleResetPassword = async () => {
        if (!newPassword.trim() || newPassword.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setIsLoading(true);
        try {
            // If resetToken expired, get a fresh one
            let token = resetToken;
            if (!token) {
                const freshRes = await fetch(`${API_URL}/app-auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email.trim() }),
                });
                const freshData = await freshRes.json();
                token = freshData.resetToken;
            }

            // Reset the password using the AppUser reset endpoint
            const resetRes = await fetch(`${API_URL}/app-auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetToken: token, newPassword }),
            });

            if (!resetRes.ok) {
                const err = await resetRes.json();
                throw new Error(err.message || 'Failed to reset password');
            }

            showToast('Password reset successfully!', 'success');
            setTimeout(() => navigation.navigate('Login'), 1500);
        } catch (error: any) {
            showToast(error.message || 'Failed to reset password. Please try again.', 'error');
        }
        setIsLoading(false);
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
                            {[1, 2, 3].map((s) => (
                                <View
                                    key={s}
                                    className={`h-2 rounded-full mx-1 ${s === step ? 'w-8 bg-primary' : s < step ? 'w-2 bg-primary/60' : 'w-2 bg-neutral-border dark:bg-neutral-700'}`}
                                />
                            ))}
                        </View>

                        {/* ======= STEP 1: Enter Email ======= */}
                        {step === 1 && (
                            <View>
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    className="flex-row items-center mb-6"
                                >
                                    <ArrowLeft size={20} color="#94A3B8" />
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 ml-1 font-medium">Back</Text>
                                </TouchableOpacity>

                                <View className="items-center mb-8">
                                    <View className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-2xl items-center justify-center mb-4">
                                        <KeyRound size={32} color="#F97316" />
                                    </View>
                                    <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-1">
                                        Forgot Password?
                                    </Text>
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 text-base text-center">
                                        Enter your email and we'll send you a verification code
                                    </Text>
                                </View>

                                <Input
                                    label="Email Address"
                                    placeholder="name@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    icon={<Mail size={20} color="#94A3B8" />}
                                />

                                <Button
                                    title={sendingOtp ? "Sending..." : "Send Verification Code"}
                                    onPress={handleSendOtp}
                                    variant="primary"
                                    loading={sendingOtp}
                                    disabled={sendingOtp || !email.trim()}
                                    className="mt-2 shadow-lg shadow-primary/30"
                                />
                            </View>
                        )}

                        {/* ======= STEP 2: Verify OTP ======= */}
                        {step === 2 && (
                            <View>
                                <TouchableOpacity
                                    onPress={() => animateTransition(1)}
                                    className="flex-row items-center mb-6"
                                >
                                    <ArrowLeft size={20} color="#94A3B8" />
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 ml-1 font-medium">Back</Text>
                                </TouchableOpacity>

                                <View className="items-center mb-8">
                                    <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-1">
                                        Verify OTP
                                    </Text>
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 text-base text-center">
                                        Enter the 6-digit code sent to {email}
                                    </Text>
                                </View>

                                {renderOtpInputs()}

                                {otpError ? (
                                    <Text className="text-status-error text-center text-sm mt-3">{otpError}</Text>
                                ) : null}

                                <View className="items-center mt-4 mb-6">
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
                                    title="Verify"
                                    onPress={handleVerifyOtp}
                                    variant="primary"
                                    className="shadow-lg shadow-primary/30"
                                />
                            </View>
                        )}

                        {/* ======= STEP 3: New Password ======= */}
                        {step === 3 && (
                            <View>
                                <TouchableOpacity
                                    onPress={() => animateTransition(2)}
                                    className="flex-row items-center mb-6"
                                >
                                    <ArrowLeft size={20} color="#94A3B8" />
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 ml-1 font-medium">Back</Text>
                                </TouchableOpacity>

                                <View className="items-center mb-8">
                                    <View className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl items-center justify-center mb-4">
                                        <ShieldCheck size={32} color="#10B981" />
                                    </View>
                                    <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-1">
                                        Reset Password
                                    </Text>
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 text-base text-center">
                                        Create a new password for your account
                                    </Text>
                                </View>

                                <View className="relative">
                                    <Input
                                        label="New Password"
                                        placeholder="Minimum 6 characters"
                                        secureTextEntry={!showPassword}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
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
                                    label="Confirm New Password"
                                    placeholder="Re-enter your new password"
                                    secureTextEntry={!showPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    icon={<Lock size={20} color="#94A3B8" />}
                                />

                                <Button
                                    title="Reset Password"
                                    onPress={handleResetPassword}
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
                                Remember your password?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text className="text-primary dark:text-blue-400 font-bold text-base">
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

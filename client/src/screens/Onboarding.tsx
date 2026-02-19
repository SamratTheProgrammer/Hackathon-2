import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Alert, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { InputField as Input } from '../components/ui/InputField';
import { ScreenWrapper } from '../components/ui';
import { ShieldCheck, ArrowLeft, Smartphone, Mail } from 'lucide-react-native';

type OnboardingStep = 1 | 2 | 3 | 4;

const CORRECT_OTP = '123456';

export const Onboarding = () => {
    const { login } = useOffline();
    const [step, setStep] = useState<OnboardingStep>(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [pin, setPin] = useState(['', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [pinError, setPinError] = useState('');
    const [timer, setTimer] = useState(30);
    const [timerActive, setTimerActive] = useState(false);

    // Refs for OTP inputs
    const otpRefs = useRef<(TextInput | null)[]>([]);
    // Refs for PIN inputs
    const pinRefs = useRef<(TextInput | null)[]>([]);
    const confirmPinRefs = useRef<(TextInput | null)[]>([]);

    // Fade animation
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const animateTransition = (nextStep: OnboardingStep) => {
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

    // --- Handlers ---

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setTimeout(async () => {
            await login('9999999999', '0000');
            setIsLoading(false);
        }, 800);
    };

    const handleSendOtp = () => {
        if (phone.length < 10) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
            return;
        }
        setTimer(30);
        setTimerActive(true);
        animateTransition(3);
        // Auto-fill OTP for demo after a small delay
        setTimeout(() => {
            const demoOtp = CORRECT_OTP.split('');
            setOtp(demoOtp);
        }, 600);
    };

    const handleOtpChange = (value: string, index: number) => {
        setOtpError('');
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Auto-focus next
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
            setOtpError('Please enter the complete 6-digit OTP.');
            return;
        }
        if (enteredOtp !== CORRECT_OTP) {
            setOtpError('Invalid OTP. Try 123456 for demo.');
            return;
        }
        animateTransition(4);
    };

    const handlePinChange = (value: string, index: number, isConfirm = false) => {
        setPinError('');
        const setter = isConfirm ? setConfirmPin : setPin;
        const refs = isConfirm ? confirmPinRefs : pinRefs;
        const current = isConfirm ? [...confirmPin] : [...pin];
        current[index] = value;
        setter(current);
        // Auto-focus next
        if (value && index < 3) {
            refs.current[index + 1]?.focus();
        }
        // Jump from last PIN digit to first Confirm PIN digit
        if (!isConfirm && value && index === 3) {
            confirmPinRefs.current[0]?.focus();
        }
    };

    const handlePinKeyPress = (key: string, index: number, isConfirm = false) => {
        const refs = isConfirm ? confirmPinRefs : pinRefs;
        const values = isConfirm ? confirmPin : pin;
        if (key === 'Backspace' && !values[index] && index > 0) {
            refs.current[index - 1]?.focus();
        }
    };

    const handleSetPin = async () => {
        const enteredPin = pin.join('');
        const enteredConfirm = confirmPin.join('');
        if (enteredPin.length < 4) {
            setPinError('Please enter a 4-digit PIN.');
            return;
        }
        if (enteredPin !== enteredConfirm) {
            setPinError('PINs do not match. Please try again.');
            return;
        }
        setIsLoading(true);
        setTimeout(async () => {
            await login(phone, enteredPin);
            setIsLoading(false);
        }, 800);
    };

    // --- Step Indicator ---
    const StepIndicator = () => (
        <View className="flex-row items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s) => (
                <View
                    key={s}
                    className={`h-2 rounded-full mx-1 ${s === step ? 'w-8 bg-primary' : s < step ? 'w-2 bg-primary/60' : 'w-2 bg-neutral-border dark:bg-neutral-700'}`}
                />
            ))}
        </View>
    );

    // --- Back Button ---
    const BackButton = () => (
        <TouchableOpacity
            onPress={() => animateTransition((step - 1) as OnboardingStep)}
            className="flex-row items-center mb-6"
        >
            <ArrowLeft size={20} color="#94A3B8" />
            <Text className="text-neutral-text-secondary dark:text-neutral-400 ml-1 font-medium">Back</Text>
        </TouchableOpacity>
    );

    // --- Render individual digit input ---
    const renderDigitInputs = (
        values: string[],
        refs: React.MutableRefObject<(TextInput | null)[]>,
        onChange: (value: string, index: number) => void,
        onKeyPress: (key: string, index: number) => void,
        count: number
    ) => (
        <View className="flex-row justify-center" style={{ gap: 10 }}>
            {values.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => { refs.current[index] = ref; }}
                    className="w-12 h-14 border-2 rounded-xl text-center text-xl font-bold text-neutral-text dark:text-white bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700"
                    style={{ fontSize: 22 }}
                    maxLength={1}
                    keyboardType="number-pad"
                    secureTextEntry={count === 4}
                    value={digit}
                    onChangeText={(v) => onChange(v, index)}
                    onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, index)}
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

                        {/* ======= STEP 1: WELCOME ======= */}
                        {step === 1 && (
                            <View>
                                <View className="items-center mb-12">
                                    <View className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-3xl items-center justify-center mb-6 rotate-3">
                                        <ShieldCheck size={48} color="#2563EB" />
                                    </View>
                                    <Text className="text-4xl font-bold text-neutral-text dark:text-white text-center">
                                        Offline UPI
                                    </Text>
                                    <Text className="text-neutral-text-secondary dark:text-neutral-400 mt-2 text-center text-lg">
                                        Secure Payments, Anywhere.
                                    </Text>
                                </View>

                                <StepIndicator />

                                <View style={{ gap: 12 }}>
                                    <Button
                                        title="Continue with Google"
                                        onPress={handleGoogleLogin}
                                        variant="secondary"
                                        loading={isLoading}
                                        disabled={isLoading}
                                        icon={<Mail size={20} color="#2563EB" />}
                                        className="border-neutral-border dark:border-neutral-700 bg-white dark:bg-neutral-800"
                                    />

                                    <Button
                                        title="Login with Mobile Number"
                                        onPress={() => animateTransition(2)}
                                        variant="primary"
                                        icon={<Smartphone size={20} color="white" />}
                                        className="shadow-lg shadow-primary/30"
                                    />
                                </View>

                                <Text className="text-center text-neutral-text-secondary dark:text-neutral-400 text-xs mt-8">
                                    By continuing, you agree to our Terms & Privacy Policy
                                </Text>
                            </View>
                        )}

                        {/* ======= STEP 2: MOBILE INPUT ======= */}
                        {step === 2 && (
                            <View>
                                <BackButton />

                                <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-2">
                                    Enter your mobile number
                                </Text>
                                <Text className="text-neutral-text-secondary dark:text-neutral-400 mb-8 text-base">
                                    We'll send you a verification code
                                </Text>

                                <StepIndicator />

                                <Input
                                    label="Phone Number"
                                    placeholder="Enter 10-digit mobile number"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                    maxLength={10}
                                    icon={<Text className="text-neutral-text-secondary dark:text-neutral-400 font-semibold text-base">+91</Text>}
                                />

                                <Button
                                    title="Send OTP"
                                    onPress={handleSendOtp}
                                    variant="primary"
                                    className="mt-4 shadow-lg shadow-primary/30"
                                />
                            </View>
                        )}

                        {/* ======= STEP 3: OTP VERIFICATION ======= */}
                        {step === 3 && (
                            <View>
                                <BackButton />

                                <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-2">
                                    Verify OTP
                                </Text>
                                <Text className="text-neutral-text-secondary dark:text-neutral-400 mb-8 text-base">
                                    Enter the 6-digit code sent to +91 {phone}
                                </Text>

                                <StepIndicator />

                                {renderDigitInputs(otp, otpRefs, handleOtpChange, handleOtpKeyPress, 6)}

                                {otpError ? (
                                    <Text className="text-status-error text-center text-sm mt-3">{otpError}</Text>
                                ) : null}

                                <View className="items-center mt-4 mb-6">
                                    {timer > 0 ? (
                                        <Text className="text-neutral-text-secondary dark:text-neutral-400 text-sm">
                                            Resend OTP in <Text className="text-primary font-bold">{timer}s</Text>
                                        </Text>
                                    ) : (
                                        <TouchableOpacity onPress={() => { setTimer(30); setTimerActive(true); }}>
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

                                <Text className="text-center text-neutral-text-secondary dark:text-neutral-400 text-xs mt-4">
                                    Demo OTP: 123456
                                </Text>
                            </View>
                        )}

                        {/* ======= STEP 4: SECURE PIN ======= */}
                        {step === 4 && (
                            <View>
                                <BackButton />

                                <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-2">
                                    Create your App PIN
                                </Text>
                                <Text className="text-neutral-text-secondary dark:text-neutral-400 mb-8 text-base">
                                    This PIN will be used to secure your transactions
                                </Text>

                                <StepIndicator />

                                <Text className="text-neutral-text dark:text-gray-300 text-sm font-medium mb-3">Create PIN</Text>
                                {renderDigitInputs(pin, pinRefs, (v, i) => handlePinChange(v, i, false), (k, i) => handlePinKeyPress(k, i, false), 4)}

                                <View className="h-6" />

                                <Text className="text-neutral-text dark:text-gray-300 text-sm font-medium mb-3">Confirm PIN</Text>
                                {renderDigitInputs(confirmPin, confirmPinRefs, (v, i) => handlePinChange(v, i, true), (k, i) => handlePinKeyPress(k, i, true), 4)}

                                {pinError ? (
                                    <Text className="text-status-error text-center text-sm mt-3">{pinError}</Text>
                                ) : null}

                                <Button
                                    title="Set PIN & Continue"
                                    onPress={handleSetPin}
                                    variant="primary"
                                    loading={isLoading}
                                    disabled={isLoading}
                                    className="mt-8 shadow-lg shadow-primary/30"
                                />
                            </View>
                        )}

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

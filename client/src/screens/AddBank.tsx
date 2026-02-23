
import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { InputField as Input } from '../components/ui/InputField';
import { ScreenWrapper } from '../components/ui';
import { ArrowLeft, Landmark, Key, Mail, CreditCard, User, Smartphone } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { MockApi } from '../services/api';
import { useToast } from '../components/ui/Toast';

export const AddBank = () => {
    const navigation = useNavigation();
    const { linkBankAccount, bankAccounts } = useOffline();
    const { showToast } = useToast();

    // Steps: 0 = Input Account, 1 = Confirm Email, 2 = Input OTP
    const [step, setStep] = useState(0);
    const [accountNumber, setAccountNumber] = useState('');
    const [email, setEmail] = useState('');
    const [accountDetails, setAccountDetails] = useState<any>(null);
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLookup = async () => {
        if (!accountNumber || accountNumber.length < 5) {
            Alert.alert('Error', 'Please enter a valid Account Number');
            return;
        }

        const isAlreadyLinked = bankAccounts.some(account => account.accountNumber === accountNumber);
        if (isAlreadyLinked) {
            showToast('This bank account is already linked to your profile.', 'info');
            Alert.alert('Already Connected', 'This bank account is already linked to your profile.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await MockApi.lookupAccount(accountNumber, '');
            if (result && result.email) {
                setEmail(result.email);
                setAccountDetails(result);
                setStep(1);
            } else {
                Alert.alert('Error', 'Account not found');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Account not found');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = async () => {
        setIsLoading(true);
        try {
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(newOtp);

            const serviceId = 'service_x6ap095';
            const templateId = 'template_r0gepde';
            const publicKey = 'o9K-IpQMORfxWbx4i';

            const data = {
                service_id: serviceId,
                template_id: templateId,
                user_id: publicKey,
                template_params: {
                    email: email,
                    passcode: newOtp,
                    time: new Date(Date.now() + 15 * 60000).toLocaleTimeString()
                }
            };

            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                // Allow fallback for demo if quota exceeded
                console.warn('EmailJS quota may be exceeded. Using fallback OTP display.');
                Alert.alert('OTP Sent', `(Dev Mode) Email failed but OTP is: ${newOtp}`);
            } else {
                Alert.alert('OTP Sent', `An OTP has been sent to ${email}`);
            }

            setStep(2);
        } catch (error: any) {
            console.error('EmailJS Error:', error);
            // Fallback in case of network error
            const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(fallbackOtp);
            Alert.alert('OTP Sent', `(Dev Mode) Network Error. Your OTP is: ${fallbackOtp}`);
            setStep(2);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        // Aggressively strip any non-digit characters (including zero-width spaces from Gmail)
        const cleanOtp = otp ? otp.replace(/[^0-9]/g, '') : '';
        const cleanGeneratedOtp = generatedOtp ? generatedOtp.replace(/[^0-9]/g, '') : '';

        console.log(`[handleVerifyOtp] User entered raw: '${otp}', cleaned: '${cleanOtp}'`);
        console.log(`[handleVerifyOtp] Generated OTP is: '${cleanGeneratedOtp}'`);

        if (!cleanOtp || cleanOtp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }
        setIsLoading(true);

        // Local OTP Verification
        setTimeout(async () => {
            if (cleanOtp === cleanGeneratedOtp) {
                console.log(`[handleVerifyOtp] Match successful. Initiating linkBankAccount...`);
                try {
                    const success = await linkBankAccount(accountNumber, email);
                    if (success) {
                        console.log(`[handleVerifyOtp] linkBankAccount returned SUCCESS.`);
                        showToast('Successfully connected your bank account!', 'success');
                        (navigation as any).navigate('Main', { screen: 'Home' });
                    } else {
                        console.log(`[handleVerifyOtp] linkBankAccount returned FALSE.`);
                        showToast('Could not link your bank account. Please check backend logs.', 'error');
                    }
                } catch (error: any) {
                    console.error(`[handleVerifyOtp] Crash during linking:`, error);
                    showToast(error.message || 'An unknown error occurred during linking.', 'error');
                }
            } else {
                console.log(`[handleVerifyOtp] Match FAILED. '${cleanOtp}' !== '${cleanGeneratedOtp}'`);
                Alert.alert('Error', 'Invalid OTP');
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <ScreenWrapper className="bg-neutral-bg dark:bg-neutral-900">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
                        <ArrowLeft size={24} className="text-neutral-text dark:text-white" color="#94A3B8" />
                    </TouchableOpacity>

                    <View className="items-center mb-8">
                        <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
                            <Landmark size={40} color="#2563EB" />
                        </View>
                        <Text className="text-2xl font-bold text-neutral-text dark:text-white">Link Bank Account</Text>
                        <Text className="text-center text-neutral-text-secondary dark:text-neutral-400 mt-2">
                            {step === 0 ? 'Enter Account Number.' : step === 1 ? 'Verify Email.' : 'Enter OTP.'}
                        </Text>
                    </View>

                    <View className="space-y-4" style={{ gap: 16 }}>

                        {step === 0 && (
                            <>
                                <Input
                                    label="Account Number"
                                    placeholder="Enter Account Number"
                                    value={accountNumber}
                                    onChangeText={setAccountNumber}
                                    keyboardType="number-pad"
                                    icon={<CreditCard size={20} color="#64748B" />}
                                />
                                <Button title="Search Account" onPress={handleLookup} loading={isLoading} variant="primary" className="mt-4" />
                            </>
                        )}

                        {step === 1 && (
                            <View className="items-center w-full">
                                <View className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl mb-4 w-full border border-neutral-200 dark:border-neutral-700">
                                    <Text className="text-xs text-neutral-500 uppercase font-bold mb-3 tracking-wider">Account Found</Text>

                                    <View className="flex-row items-center mb-3">
                                        <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-3">
                                            <User size={20} color="#2563EB" />
                                        </View>
                                        <View>
                                            <Text className="text-neutral-900 dark:text-white font-bold text-lg">{accountDetails?.name || 'DigitalDhan User'}</Text>
                                            <Text className="text-xs text-neutral-500">A/C: {accountNumber}</Text>
                                        </View>
                                    </View>

                                    <View className="space-y-2 mt-2" style={{ gap: 8 }}>
                                        <View className="flex-row items-center">
                                            <Mail size={16} color="#64748B" />
                                            <Text className="ml-2 text-neutral-700 dark:text-neutral-300 font-medium">{email}</Text>
                                        </View>
                                        {accountDetails?.mobile && (
                                            <View className="flex-row items-center">
                                                <Smartphone size={16} color="#64748B" />
                                                <Text className="ml-2 text-neutral-700 dark:text-neutral-300 font-medium">+91 {accountDetails.mobile.slice(0, 5)} {accountDetails.mobile.slice(5)}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <Button title="Send OTP to Email" onPress={handleSendOtp} loading={isLoading} variant="primary" className="w-full" />
                                <TouchableOpacity onPress={() => setStep(0)} className="items-center mt-4 p-2"><Text className="text-primary font-medium">Changed my mind</Text></TouchableOpacity>
                            </View>
                        )}

                        {step === 2 && (
                            <>
                                <Text className="text-neutral-500 mb-2">Enter the verification code sent to {email}</Text>
                                <Input label="OTP" placeholder="6-digit Code" value={otp} onChangeText={setOtp} keyboardType="number-pad" icon={<Key size={20} color="#64748B" />} />
                                <Button title="Verify OTP & Link" onPress={handleVerifyOtp} loading={isLoading} variant="primary" className="mt-4" />
                            </>
                        )}

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};


import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { InputField as Input } from '../components/ui/InputField';
import { ScreenWrapper } from '../components/ui';
import { ArrowLeft, Landmark, Key, Mail, CreditCard } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { MockApi } from '../services/api';

export const AddBank = () => {
    const navigation = useNavigation();
    const { linkBankAccount } = useOffline();

    // Steps: 0 = Input Account, 1 = Confirm Email, 2 = Input OTP, 3 = Input Password
    const [step, setStep] = useState(0);
    const [accountNumber, setAccountNumber] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLookup = async () => {
        if (!accountNumber || accountNumber.length < 5) {
            Alert.alert('Error', 'Please enter a valid Account Number');
            return;
        }
        setIsLoading(true);
        try {
            const result = await MockApi.lookupAccount(accountNumber, '');
            if (result && result.email) {
                setEmail(result.email);
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
            const response = await MockApi.sendOtp(accountNumber);
            if (response.dev_otp) {
                // For demo purposes, we show the OTP in alert if email fails or dev mode
                Alert.alert('OTP Sent', `(Dev Mode) Your OTP is: ${response.dev_otp}`);
            } else {
                Alert.alert('OTP Sent', `An OTP has been sent to ${email}`);
            }
            setStep(2);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }
        setIsLoading(true);
        try {
            await MockApi.verifyOtp(accountNumber, otp);
            Alert.alert('Success', 'OTP Verified! Please enter your password to link.');
            setStep(3);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLink = async () => {
        if (!password) {
            Alert.alert('Error', 'Please enter Password');
            return;
        }
        setIsLoading(true);
        try {
            const success = await linkBankAccount(accountNumber, email, password);
            if (success) {
                Alert.alert('Success', 'Bank Account Linked Successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            // Context handles errors
        } finally {
            setIsLoading(false);
        }
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
                            {step === 0 ? 'Enter Account Number.' : step === 1 ? 'Verify Email.' : step === 2 ? 'Enter OTP.' : 'Final Security Check.'}
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
                                <View className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl mb-4 w-full">
                                    <Text className="text-xs text-neutral-500 uppercase font-bold mb-1">Account Found</Text>
                                    <View className="flex-row items-center"><Mail size={16} color="#64748B" /><Text className="ml-2 text-neutral-900 dark:text-white font-medium">{email}</Text></View>
                                </View>
                                <Button title="Send OTP to Email" onPress={handleSendOtp} loading={isLoading} variant="primary" className="w-full" />
                                <TouchableOpacity onPress={() => setStep(0)} className="items-center mt-4"><Text className="text-primary font-medium">Changed my mind</Text></TouchableOpacity>
                            </View>
                        )}

                        {step === 2 && (
                            <>
                                <Text className="text-neutral-500 mb-2">Enter the verification code sent to {email}</Text>
                                <Input label="OTP" placeholder="6-digit Code" value={otp} onChangeText={setOtp} keyboardType="number-pad" icon={<Key size={20} color="#64748B" />} />
                                <Button title="Verify OTP" onPress={handleVerifyOtp} loading={isLoading} variant="primary" className="mt-4" />
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <Input label="Password" placeholder="Bank Account Password" value={password} onChangeText={setPassword} secureTextEntry icon={<Key size={20} color="#64748B" />} />
                                <Button title="Link Account" onPress={handleLink} loading={isLoading} variant="primary" className="mt-4" />
                            </>
                        )}

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

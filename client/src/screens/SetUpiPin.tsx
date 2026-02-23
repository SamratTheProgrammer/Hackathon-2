import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Vibration } from 'react-native';
import { ScreenWrapper } from '../components/ui';
import { ArrowLeft, ArrowRight, Delete, ShieldCheck } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StorageService } from '../storage';
import { useToast } from '../components/ui/Toast';

export const SetUpiPin = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const account = (route.params as any)?.account;
    const { showToast } = useToast();

    const mode = (route.params as any)?.mode || 'create'; // 'create' | 'change' | 'verify'

    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [step, setStep] = useState<'create' | 'confirm' | 'verify'>(mode === 'verify' ? 'verify' : 'create');
    const [existingPin, setExistingPin] = useState<string | null>(null);

    useEffect(() => {
        if (!account?.accountNumber) {
            Alert.alert('Error', 'Account details missing.');
            navigation.goBack();
            return;
        }
        checkExistingPin();
    }, []);

    const checkExistingPin = async () => {
        const savedPin = await StorageService.getUpiPin(account.accountNumber);
        if (savedPin) {
            setExistingPin(savedPin);
        } else if (mode === 'verify') {
            Alert.alert('No PIN', 'Please set a UPI PIN first.');
            navigation.goBack();
        }
    };

    const handleKeyPress = (val: string) => {
        Vibration.vibrate(50);
        if (step === 'create' || step === 'verify') {
            if (pin.length < 6) setPin(prev => prev + val);
        } else {
            if (confirmPin.length < 6) setConfirmPin(prev => prev + val);
        }
    };

    const handleDelete = () => {
        Vibration.vibrate(50);
        if (step === 'create' || step === 'verify') {
            setPin(prev => prev.slice(0, -1));
        } else {
            setConfirmPin(prev => prev.slice(0, -1));
        }
    };

    const handleNext = async () => {
        if (step === 'verify') {
            if (pin.length !== 6) return;
            if (pin === existingPin) {
                const source = (route.params as any)?.source;
                if (source === 'checkBalance') {
                    // Go back to Home with verified flag
                    (navigation as any).navigate('Main', { screen: 'Home', params: { balanceVerified: true } });
                } else {
                    (navigation as any).navigate('BankDetails', { account, verified: true });
                }
            } else {
                showToast('The UPI PIN you entered is incorrect.', 'error');
                setPin('');
            }
            return;
        }

        if (step === 'create') {
            if (pin.length !== 6) {
                Alert.alert('Incomplete', 'Please enter a 6-digit PIN.');
                return;
            }
            setStep('confirm');
        } else {
            if (confirmPin.length !== 6) {
                Alert.alert('Incomplete', 'Please confirm your 6-digit PIN.');
                return;
            }
            if (pin !== confirmPin) {
                Alert.alert('Mismatch', 'PINs do not match. Please try again.');
                setConfirmPin('');
                return;
            }

            // Save PIN
            await StorageService.saveUpiPin(account.accountNumber, pin);
            showToast('UPI PIN Set Successfully!', 'success');
            (navigation as any).navigate('Main', { screen: 'Home' });
        }
    };

    const renderDots = (currentVal: string) => {
        return (
            <View className="flex-row justify-center space-x-4 mb-6" style={{ gap: 16 }}>
                {[...Array(6)].map((_, i) => (
                    <View
                        key={i}
                        className={`w-5 h-5 rounded-full border-2 ${i < currentVal.length
                            ? 'bg-primary border-primary dark:bg-blue-500 dark:border-blue-500'
                            : 'border-neutral-300 dark:border-neutral-600'
                            }`}
                    />
                ))}
            </View>
        );
    };

    const NumButton = ({ num }: { num: string }) => (
        <TouchableOpacity
            onPress={() => handleKeyPress(num)}
            className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-full items-center justify-center shadow-sm shadow-black/5"
            activeOpacity={0.7}
        >
            <Text className="text-2xl font-medium text-neutral-900 dark:text-white">{num}</Text>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper className="bg-neutral-50 dark:bg-neutral-900 justify-between">
            <View className="px-6 pt-6 flex-1">
                <View className="flex-row items-center mb-8">
                    {step === 'confirm' ? (
                        <TouchableOpacity onPress={() => { setStep('create'); setConfirmPin(''); }}>
                            <ArrowLeft size={24} className="text-neutral-text dark:text-white" color="#64748B" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeft size={24} className="text-neutral-text dark:text-white" color="#64748B" />
                        </TouchableOpacity>
                    )}
                    <View className="flex-1 items-center mr-6">
                        <Text className="text-lg font-bold text-neutral-900 dark:text-white">
                            {mode === 'verify' ? 'Verify UPI PIN' : (existingPin ? 'Change UPI PIN' : 'Set UPI PIN')}
                        </Text>
                    </View>
                </View>

                <View className="items-center mt-4">
                    <View className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mb-6">
                        <ShieldCheck size={32} color="#10B981" />
                    </View>
                    <Text className="text-xl font-bold text-neutral-900 dark:text-white mb-2 text-center">
                        {step === 'confirm' ? 'Confirm 6-digit UPI PIN' : 'Enter 6-digit UPI PIN'}
                    </Text>
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center px-4">
                        For bank account ending in {account?.accountNumber?.slice(-4)}
                    </Text>

                    {renderDots(step === 'confirm' ? confirmPin : pin)}
                </View>
            </View>

            {/* Custom Keyboard */}
            <View className="px-6 pb-10 pt-4 bg-neutral-100 dark:bg-neutral-900 rounded-t-3xl shadow-lg border-t border-neutral-200 dark:border-neutral-800">
                <View className="flex-row justify-between mb-6">
                    <NumButton num="1" />
                    <NumButton num="2" />
                    <NumButton num="3" />
                </View>
                <View className="flex-row justify-between mb-6">
                    <NumButton num="4" />
                    <NumButton num="5" />
                    <NumButton num="6" />
                </View>
                <View className="flex-row justify-between mb-6">
                    <NumButton num="7" />
                    <NumButton num="8" />
                    <NumButton num="9" />
                </View>
                <View className="flex-row justify-between items-center mb-2">
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="w-16 h-16 items-center justify-center bg-transparent"
                    >
                        <Delete size={28} color="#64748B" />
                    </TouchableOpacity>

                    <NumButton num="0" />

                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={(step === 'confirm' ? confirmPin.length : pin.length) !== 6}
                        className={`w-16 h-16 rounded-full items-center justify-center ${(step === 'confirm' ? confirmPin.length : pin.length) === 6
                            ? 'bg-primary dark:bg-blue-600'
                            : 'bg-neutral-300 dark:bg-neutral-800'
                            }`}
                    >
                        <ArrowRight
                            size={28}
                            color={(step === 'confirm' ? confirmPin.length : pin.length) === 6 ? "#FFFFFF" : "#94A3B8"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

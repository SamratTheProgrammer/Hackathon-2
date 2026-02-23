import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ui';
import { ArrowLeft, Landmark, ShieldCheck, CreditCard, ChevronRight, Eye, EyeOff, Trash2 } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StorageService } from '../storage';
import { UiButton as Button } from '../components/ui/UiButton';
import { useOffline } from '../services/OfflineContext';
import { useToast } from '../components/ui/Toast';

export const BankDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const account = (route.params as any)?.account;
    const verified = (route.params as any)?.verified;
    const [pinExists, setPinExists] = useState(false);
    const [isBalanceVisible, setIsBalanceVisible] = useState(false);
    const { unlinkBankAccount } = useOffline();
    const { showToast } = useToast();

    useEffect(() => {
        if (!account) {
            navigation.goBack();
            return;
        }
        checkPin();
    }, [account]);

    useEffect(() => {
        if (verified) {
            setIsBalanceVisible(true);
            navigation.setParams({ verified: undefined } as any);
        }
    }, [verified]);

    // Add listener to re-check PIN when focusing back to this screen
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkPin();
        });
        return unsubscribe;
    }, [navigation, account]);

    const checkPin = async () => {
        if (account?.accountNumber) {
            const savedPin = await StorageService.getUpiPin(account.accountNumber);
            setPinExists(!!savedPin);
        }
    };

    const toggleBalance = () => {
        if (isBalanceVisible) {
            setIsBalanceVisible(false);
        } else {
            if (!pinExists) {
                Alert.alert('Security', 'Please set a 6-digit UPI PIN first to view your balance.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Set PIN', onPress: () => (navigation as any).navigate('SetUpiPin', { account, mode: 'create' }) }
                ]);
            } else {
                (navigation as any).navigate('SetUpiPin', { account, mode: 'verify' });
            }
        }
    };

    if (!account) return null;

    return (
        <ScreenWrapper className="bg-neutral-bg dark:bg-neutral-900">
            <ScrollView className="flex-1">
                <View className="p-6 bg-primary dark:bg-blue-900 rounded-b-3xl mb-6 shadow-md">
                    <View className="flex-row items-center mb-8">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                            <ArrowLeft size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-white">Bank Account Details</Text>
                    </View>

                    <View className="items-center mb-4">
                        <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                            <Landmark size={40} color="#FFFFFF" />
                        </View>
                        <Text className="text-2xl font-bold text-white">{account.bankName || 'DigitalDhan Bank'}</Text>
                        <View className="flex-row items-center mt-2 bg-white/20 px-4 py-1.5 rounded-full">
                            <CreditCard size={16} color="#FFFFFF" className="mr-2" />
                            <Text className="text-white font-medium tracking-widest">{account.accountNumber}</Text>
                        </View>
                    </View>
                </View>

                <View className="px-6 space-y-4" style={{ gap: 16 }}>
                    <View className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                        <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Available Balance</Text>
                            <TouchableOpacity onPress={toggleBalance}>
                                {isBalanceVisible ? (
                                    <EyeOff size={20} color="#64748B" />
                                ) : (
                                    <Eye size={20} color="#64748B" />
                                )}
                            </TouchableOpacity>
                        </View>
                        <Text className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                            {isBalanceVisible
                                ? `₹${(account.balance || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                                : '••••••'
                            }
                        </Text>
                        <Text className="text-xs text-neutral-400 dark:text-neutral-500">
                            Last matched automatically from server
                        </Text>
                    </View>

                    <Text className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-4">Security Settings</Text>

                    <TouchableOpacity
                        onPress={() => (navigation as any).navigate('SetUpiPin', { account })}
                        activeOpacity={0.7}
                        className="bg-white dark:bg-neutral-800 p-5 rounded-2xl flex-row items-center justify-between border border-neutral-200 dark:border-neutral-700 shadow-sm"
                    >
                        <View className="flex-row items-center flex-1">
                            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${pinExists ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                                <ShieldCheck size={24} color={pinExists ? "#10B981" : "#F59E0B"} />
                            </View>
                            <View>
                                <Text className="text-lg font-bold text-neutral-900 dark:text-white">
                                    {pinExists ? 'Change UPI PIN' : 'Set UPI PIN'}
                                </Text>
                                <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {pinExists ? '6-digit PIN is active' : 'Required for secure payments'}
                                </Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert('Remove Bank Account?', 'Are you sure you want to remove this bank account? You will need to link it again to make payments.', [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Remove',
                                    style: 'destructive',
                                    onPress: async () => {
                                        const success = await unlinkBankAccount(account.accountNumber);
                                        if (success) {
                                            showToast('Bank account removed successfully', 'success');
                                            (navigation as any).navigate('Main', { screen: 'Home' });
                                        } else {
                                            showToast('Could not remove bank account', 'error');
                                        }
                                    }
                                }
                            ]);
                        }}
                        activeOpacity={0.7}
                        className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl flex-row items-center justify-between border border-red-100 dark:border-red-900/30 mt-6 mb-10 shadow-sm"
                    >
                        <View className="flex-row items-center">
                            <Trash2 size={24} color="#EF4444" className="mr-4" />
                            <Text className="text-lg font-bold text-red-500">Remove Bank Account</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

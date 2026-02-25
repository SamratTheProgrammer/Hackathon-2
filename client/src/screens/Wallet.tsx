import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { Card, ScreenWrapper, LoginPrompt } from '../components/ui';
import { Wallet as WalletIcon, RefreshCw, ArrowRight, ShieldCheck, Landmark } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StorageService } from '../storage';
import { useToast } from '../components/ui/Toast';

export const Wallet = () => {
    const { user, offlineWallet, bankBalance, loadOfflineCash, syncTransactions, transactions, isOfflineMode, bankAccounts } = useOffline();
    const { showToast } = useToast();
    const [loadAmount, setLoadAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<any>();
    const route = useRoute();
    const [selectedAccount, setSelectedAccount] = useState<any>(null);
    const [showAccountSelector, setShowAccountSelector] = useState(false);
    const [balanceVisible, setBalanceVisible] = useState(false);

    useEffect(() => {
        if (bankAccounts.length > 0 && !selectedAccount) {
            setSelectedAccount(bankAccounts[0]);
        } else if (bankAccounts.length > 0 && selectedAccount && !bankAccounts.find(a => a.accountNumber === selectedAccount.accountNumber)) {
            setSelectedAccount(bankAccounts[0]);
        }
    }, [bankAccounts, selectedAccount]);

    // Reset balance visibility when selected account specifically changes
    useEffect(() => {
        setBalanceVisible(false);
    }, [selectedAccount?.accountNumber]);

    useEffect(() => {
        const params = route.params as any;

        // Handle PIN verified for check balance
        if (params?.balanceVerifiedFromWallet && params?.verifiedAccount === selectedAccount?.accountNumber) {
            setBalanceVisible(true);
            navigation.setParams({ balanceVerifiedFromWallet: undefined, verifiedAccount: undefined });

            // Auto hide balance after 10 seconds
            setTimeout(() => {
                setBalanceVisible(false);
            }, 10000);
        }

        // Handle PIN verified for load cash
        if (params?.pinVerifiedFromLoadCash && params?.loadAmount && params?.verifiedAccount) {
            handleVerifiedLoad(params.loadAmount, params.verifiedAccount);
            // clear params
            navigation.setParams({ pinVerifiedFromLoadCash: undefined, loadAmount: undefined, verifiedAccount: undefined });
        }
    }, [route.params, selectedAccount]);

    const handleCheckBalance = async () => {
        if (!selectedAccount) return;

        if (balanceVisible) {
            setBalanceVisible(false);
            return;
        }

        const pin = await StorageService.getUpiPin(selectedAccount.accountNumber);
        if (pin) {
            navigation.navigate('SetUpiPin', { account: selectedAccount, mode: 'verify', source: 'checkWalletBalance' });
        } else {
            showToast('Please set a UPI PIN first for this account', 'warning');
        }
    };

    const handleVerifiedLoad = async (amount: number, accountNo: string) => {
        setIsLoading(true);
        const success = await loadOfflineCash(amount, accountNo);
        setIsLoading(false);
        if (success) {
            showToast(`Loaded ₹${amount} to Offline Wallet`, 'success');
            setLoadAmount('');
        } else {
            showToast('Failed to load cash. Please try again.', 'error');
        }
    };

    const handleLoad = async () => {
        const amt = parseFloat(loadAmount);
        if (!amt || amt <= 0) {
            showToast('Please enter a valid amount', 'warning');
            return;
        }

        if (!selectedAccount) {
            showToast('Please link a bank account to load cash', 'warning');
            return;
        }

        if (amt > selectedAccount.balance) {
            showToast('Insufficient bank balance to load cash', 'error');
            return;
        }

        const pin = await StorageService.getUpiPin(selectedAccount.accountNumber);
        if (pin) {
            navigation.navigate('SetUpiPin', { account: selectedAccount, mode: 'verify', source: 'loadCash', loadAmount: amt });
        } else {
            showToast('Please set a UPI PIN first for this account', 'warning');
        }
    };

    const handleSync = async () => {
        if (isOfflineMode) {
            showToast('Please disable Offline Mode to sync.', 'warning');
            return;
        }
        setIsLoading(true);
        await syncTransactions();
        setIsLoading(false);
        showToast('All transactions are up to date.', 'success');
    };

    const pendingCount = transactions.filter(t => t.status === 'pending').length;

    if (!user) {
        return <LoginPrompt title="Offline Wallet" description="Please login to manage your offline wallet and check balances." />;
    }

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-6">Discovery Wallet</Text>

                <Card className="bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700 mb-6 p-5 shadow-sm">
                    <View className="flex-row justify-between items-start mb-6">
                        <View>
                            <Text className="text-neutral-text-secondary dark:text-neutral-400 font-medium mb-1">Offline Balance</Text>
                            <Text className="text-4xl font-bold text-neutral-text dark:text-white">₹{offlineWallet?.balance.toFixed(2)}</Text>
                        </View>
                        <View className="bg-secondary/10 dark:bg-secondary/20 p-2 rounded-xl">
                            <WalletIcon color="#10B981" size={28} />
                        </View>
                    </View>
                </Card>

                {/* Load Cash Section */}
                <Text className="text-lg font-bold text-neutral-text dark:text-white mb-4">Load Offline Cash</Text>
                <Card className="mb-8 bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700">
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-neutral-text-secondary dark:text-neutral-400 font-medium text-xs mb-1">From Bank Account</Text>
                            {selectedAccount ? (
                                <TouchableOpacity
                                    className="flex-row items-center border border-neutral-border dark:border-neutral-700 rounded-lg p-2 bg-gray-50 dark:bg-neutral-900"
                                    onPress={() => bankAccounts.length > 1 && setShowAccountSelector(true)}
                                    activeOpacity={bankAccounts.length > 1 ? 0.7 : 1}
                                >
                                    <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-2">
                                        <Landmark size={16} color="#2563EB" />
                                    </View>
                                    <View>
                                        <Text className="text-sm font-bold text-neutral-text dark:text-white">{selectedAccount.bankName || 'DigitalDhan Bank'}</Text>
                                        <Text className="text-xs text-neutral-text-secondary dark:text-neutral-400">•••• {selectedAccount.accountNumber?.slice(-4)}</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <Text className="text-sm text-status-warning font-medium mt-2">No Bank Linked</Text>
                            )}
                        </View>
                        <View className="items-end justify-center">
                            <Text className="text-neutral-text-secondary dark:text-neutral-400 font-medium text-xs mb-1">Available</Text>
                            {balanceVisible ? (
                                <Text className="text-neutral-text dark:text-white font-bold text-lg">₹{(selectedAccount?.balance || 0).toFixed(2)}</Text>
                            ) : (
                                <TouchableOpacity onPress={handleCheckBalance} className="bg-primary/10 px-3 py-1 rounded-full">
                                    <Text className="text-primary font-bold text-xs">Check Balance</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View className="flex-row items-center bg-gray-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-2 mb-6">
                        <Text className="text-3xl font-bold text-neutral-text-secondary dark:text-neutral-500 mr-2">₹</Text>
                        <TextInput
                            className="flex-1 text-4xl font-bold text-neutral-text dark:text-white h-16"
                            placeholder="0"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            value={loadAmount}
                            onChangeText={setLoadAmount}
                        />
                    </View>

                    <View className="flex-row space-x-3 justify-end mb-6">
                        {[100, 500, 1000].map(amt => (
                            <Button
                                key={amt}
                                title={`+${amt}`}
                                variant="secondary"
                                className="px-4 py-2 rounded-xl border-neutral-border dark:border-neutral-600"
                                onPress={() => setLoadAmount(amt.toString())}
                            />
                        ))}
                    </View>

                    <Button
                        title={isLoading ? "Processing..." : "Load Cash"}
                        onPress={handleLoad}
                        disabled={isLoading || isOfflineMode}
                        className={isOfflineMode ? "opacity-50" : "shadow-md shadow-primary/20"}
                    />
                    {isOfflineMode && <Text className="text-center text-xs text-status-error mt-3">Cannot load cash in offline mode</Text>}
                </Card>

                {/* Sync Section */}
                <Text className="text-lg font-bold text-neutral-text dark:text-white mb-4">Synchronization</Text>
                <Card className="flex-row items-center justify-between p-5 bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700 shadow-sm">
                    <View>
                        <Text className="font-bold text-neutral-text dark:text-white mb-1">Pending Sync</Text>
                        <Text className="text-neutral-text-secondary dark:text-neutral-400 text-xs">{pendingCount} transactions pending</Text>
                    </View>
                    <Button
                        title="Sync Now"
                        variant="ghost"
                        icon={<RefreshCw size={18} color="#2563eb" />}
                        onPress={handleSync}
                        disabled={isLoading || pendingCount === 0 || isOfflineMode}
                        className="bg-blue-50/50 dark:bg-blue-900/20"
                    />
                </Card>

                <View className="flex-row items-center justify-center mt-10 mb-8 opacity-80">
                    <ShieldCheck size={16} color="#10B981" />
                    <Text className="text-secondary dark:text-secondary-400 ml-2 font-medium text-xs">Secured by Hardware Security Module</Text>
                </View>

            </ScrollView>

            {/* Account Selector Modal */}
            {showAccountSelector && (
                <View className="absolute inset-0 z-50 flex justify-end bg-black/50">
                    <View className="bg-white dark:bg-neutral-900 rounded-t-3xl p-6 shadow-xl border-t border-neutral-border dark:border-neutral-800">
                        <Text className="text-xl font-bold text-neutral-text dark:text-white mb-4">Select Source Account</Text>

                        {bankAccounts.map((account: any, index: number) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => { setSelectedAccount(account); setShowAccountSelector(false); }}
                                className={`flex-row items-center p-4 mb-3 border rounded-2xl ${selectedAccount?.accountNumber === account.accountNumber
                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                    : 'border-neutral-border dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800'
                                    }`}
                            >
                                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                                    <Landmark size={20} color="#2563EB" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-neutral-text dark:text-white font-bold">{account.bankName || 'DigitalDhan Bank'}</Text>
                                    <Text className="text-xs text-neutral-text-secondary dark:text-neutral-400">•••• {account.accountNumber?.slice(-4)}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-xs text-neutral-text-secondary dark:text-neutral-400 mb-1">Balance</Text>
                                    <Text className="text-sm font-bold text-neutral-text dark:text-white">₹{(account.balance || 0).toFixed(2)}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <Button
                            title="Cancel"
                            variant="ghost"
                            onPress={() => setShowAccountSelector(false)}
                            className="mt-2 text-primary"
                        />
                    </View>
                </View>
            )}
        </ScreenWrapper>
    );
};

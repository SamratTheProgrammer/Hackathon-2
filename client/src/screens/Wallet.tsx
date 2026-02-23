import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { Card, ScreenWrapper, LoginPrompt } from '../components/ui';
import { Wallet as WalletIcon, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useToast } from '../components/ui/Toast';

export const Wallet = () => {
    const { user, offlineWallet, bankBalance, loadOfflineCash, syncTransactions, transactions, isOfflineMode } = useOffline();
    const { showToast } = useToast();
    const [loadAmount, setLoadAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoad = async () => {
        const amt = parseFloat(loadAmount);
        if (!amt || amt <= 0) {
            showToast('Please enter a valid amount', 'warning');
            return;
        }
        if (amt > bankBalance) {
            showToast('Insufficient bank balance to load cash', 'error');
            return;
        }

        setIsLoading(true);
        setTimeout(async () => {
            const success = await loadOfflineCash(amt);
            setIsLoading(false);
            if (success) {
                showToast(`Loaded ₹${amt} to Offline Wallet`, 'success');
                setLoadAmount('');
            } else {
                showToast('Failed to load cash. Please try again.', 'error');
            }
        }, 1000);
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
                        <Text className="text-neutral-text-secondary dark:text-neutral-400 font-medium">From Bank Account</Text>
                        <Text className="text-neutral-text dark:text-white font-bold">₹{bankBalance.toFixed(2)}</Text>
                    </View>

                    <View className="flex-row items-center space-x-2 mb-6 border-b border-neutral-border dark:border-neutral-700 pb-2">
                        <Text className="text-3xl font-bold text-neutral-text dark:text-white">₹</Text>
                        <TextInput
                            className="flex-1 text-3xl font-bold text-neutral-text dark:text-white"
                            placeholder="0"
                            placeholderTextColor="#94A3B8"
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
        </ScreenWrapper>
    );
};

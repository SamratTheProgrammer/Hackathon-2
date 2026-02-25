import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { ScreenWrapper } from '../components/ui';
import { Card } from '../components/ui';
import { ArrowLeft, ArrowDownUp, Landmark, Send, ChevronDown } from 'lucide-react-native';
import { UiButton as Button } from '../components/ui/UiButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useOffline } from '../services/OfflineContext';
import { useToast } from '../components/ui/Toast';
import { StorageService } from '../storage';
import { MockApi } from '../services/api';

export const SelfTransfer = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { bankBalance, bankAccountNo, bankAccounts } = useOffline();
    const { showToast } = useToast();

    const [fromAccount, setFromAccount] = useState(bankAccountNo);
    const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);

    const [recipientAc, setRecipientAc] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recipientName, setRecipientName] = useState<string | null>(null);
    const [lookupDone, setLookupDone] = useState(false);

    useEffect(() => {
        const executeTransferAfterPin = async () => {
            const params = route.params as any;
            if (params?.pinVerifiedFromSelfTransfer && params?.transferData) {
                // Clear params to avoid re-triggering
                navigation.setParams({ pinVerifiedFromSelfTransfer: false, transferData: null } as any);

                const { recipientAc, recipientName, amount: amt } = params.transferData;
                setIsLoading(true);
                try {
                    const token = await StorageService.getBankToken();
                    if (!token) throw new Error('Bank account not linked properly');

                    await MockApi.sendP2PMoney(amt, { receiverAccount: recipientAc }, 'Self Transfer', token);
                    showToast(`Successfully transferred ₹${amt} to ${recipientName}`, 'success');

                    // Reset form
                    setRecipientAc('');
                    setAmount('');
                    setRecipientName(null);
                    setLookupDone(false);
                } catch (e: any) {
                    showToast(e.message || 'Transfer failed', 'error');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        executeTransferAfterPin();
    }, [route.params]);

    const handleLookup = async () => {
        if (!recipientAc || recipientAc.length < 5) {
            showToast('Please enter a valid account number', 'warning');
            return;
        }
        if (recipientAc === fromAccount) {
            showToast('Cannot transfer to the same account', 'warning');
            return;
        }
        setIsLoading(true);
        try {
            const token = await StorageService.getBankToken();
            if (!token) {
                showToast('Please link your bank account first', 'error');
                setIsLoading(false);
                return;
            }
            const res = await MockApi.lookupAccount(recipientAc);
            if (res && res.name) {
                setRecipientName(res.name);
                setLookupDone(true);
                showToast(`Account found: ${res.name}`, 'success');
            } else {
                showToast('Account not found', 'error');
                setRecipientName(null);
                setLookupDone(false);
            }
        } catch (e: any) {
            showToast(e.message || 'Failed to look up account', 'error');
            setRecipientName(null);
            setLookupDone(false);
        }
        setIsLoading(false);
    };

    const handleTransfer = async () => {
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) {
            showToast('Please enter a valid amount', 'warning');
            return;
        }
        // Retrieve the specifically selected account
        const account = bankAccounts.find((a: any) => a.accountNumber === fromAccount);
        const sourceBalance = account ? account.balance : bankBalance;

        if (amt > sourceBalance) {
            showToast('Insufficient bank balance', 'error');
            return;
        }
        if (!lookupDone || !recipientName) {
            showToast('Please verify recipient account first', 'warning');
            return;
        }

        // Require UPI PIN
        const pin = fromAccount ? await StorageService.getUpiPin(fromAccount) : null;
        if (!pin) {
            showToast('Please set a UPI PIN for the selected account first', 'warning');
            return;
        }

        (navigation as any).navigate('SetUpiPin', {
            account: account || { accountNumber: bankAccountNo },
            mode: 'verify',
            source: 'selfTransfer',
            transferData: { recipientAc, recipientName, amount: amt }
        });
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                        <ArrowLeft size={24} color="#64748B" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-neutral-text dark:text-white">Self Transfer</Text>
                </View>

                {/* From Account */}
                <TouchableOpacity
                    onPress={() => bankAccounts && bankAccounts.length > 1 && setIsAccountModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Card className="mb-6 p-5 bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700">
                        <View className="flex-row items-center mb-0">
                            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                                <Landmark size={20} color="#2563EB" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-neutral-text-secondary dark:text-neutral-400 text-xs">From Your Account</Text>
                                <View className="flex-row items-center">
                                    <Text className="text-neutral-text dark:text-white font-bold mr-2">
                                        {fromAccount ? `•••• ${fromAccount.slice(-4)}` : 'No account linked'}
                                    </Text>
                                    {bankAccounts && bankAccounts.length > 1 && (
                                        <ChevronDown size={14} color="#64748B" />
                                    )}
                                </View>
                            </View>
                            <Text className="ml-auto text-primary font-bold">
                                ₹{bankAccounts.find((a: any) => a.accountNumber === fromAccount)?.balance.toFixed(2) || '0.00'}
                            </Text>
                        </View>
                    </Card>
                </TouchableOpacity>

                {/* Account Selection Modal */}
                <Modal visible={isAccountModalVisible} transparent={true} animationType="fade">
                    <View className="flex-1 bg-black/60 justify-end">
                        <View className="bg-white dark:bg-neutral-900 rounded-t-3xl p-6 pb-8 min-h-[40%]">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-xl font-bold text-neutral-text dark:text-white">Select Account</Text>
                                <TouchableOpacity onPress={() => setIsAccountModalVisible(false)}>
                                    <Text className="text-primary font-semibold">Close</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                {bankAccounts && bankAccounts.map((acc: any, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setFromAccount(acc.accountNumber);
                                            setIsAccountModalVisible(false);
                                        }}
                                        className={`flex-row items-center p-4 mb-3 rounded-2xl border ${fromAccount === acc.accountNumber ? 'border-primary bg-primary/5' : 'border-neutral-200 dark:border-neutral-800'}`}
                                    >
                                        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                                            <Landmark size={20} color="#2563EB" />
                                        </View>
                                        <View>
                                            <Text className="text-neutral-text dark:text-white font-bold">
                                                {acc.bankName}
                                            </Text>
                                            <Text className="text-neutral-text-secondary dark:text-neutral-400 text-xs mt-1">
                                                •••• {acc.accountNumber.slice(-4)}
                                            </Text>
                                        </View>
                                        {fromAccount === acc.accountNumber && (
                                            <View className="ml-auto w-4 h-4 rounded-full bg-primary" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* To Account */}
                <Text className="text-lg font-bold text-neutral-text dark:text-white mb-3">Transfer To</Text>
                <Card className="mb-6 p-5 bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700">
                    <Text className="text-neutral-text-secondary dark:text-neutral-400 text-xs mb-2">Recipient Account Number</Text>
                    <View className="flex-row items-center">
                        <TextInput
                            className="flex-1 text-lg font-bold text-neutral-text dark:text-white border-b border-neutral-border dark:border-neutral-700 pb-2 mr-3"
                            placeholder="Enter account number"
                            placeholderTextColor="#94A3B8"
                            keyboardType="numeric"
                            value={recipientAc}
                            onChangeText={(val) => { setRecipientAc(val); setLookupDone(false); setRecipientName(null); }}
                        />
                        <Button
                            title="Verify"
                            onPress={handleLookup}
                            disabled={isLoading}
                            variant="secondary"
                            className="px-4 py-2 rounded-xl"
                        />
                    </View>
                    {lookupDone && recipientName && (
                        <View className="mt-3 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800">
                            <Text className="text-green-700 dark:text-green-400 font-semibold">✓ {recipientName}</Text>
                        </View>
                    )}
                </Card>

                {/* Amount */}
                <Text className="text-lg font-bold text-neutral-text dark:text-white mb-3">Amount</Text>
                <Card className="mb-6 p-5 bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700">
                    <View className="flex-row items-center border-b border-neutral-border dark:border-neutral-700 pb-2 mb-4">
                        <Text className="text-3xl font-bold text-neutral-text dark:text-white mr-2">₹</Text>
                        <TextInput
                            className="flex-1 text-3xl font-bold text-neutral-text dark:text-white"
                            placeholder="0"
                            placeholderTextColor="#94A3B8"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                    <View className="flex-row space-x-3 justify-end">
                        {[100, 500, 1000, 2000].map(amt => (
                            <Button
                                key={amt}
                                title={`₹${amt}`}
                                variant="secondary"
                                className="px-3 py-1.5 rounded-xl border-neutral-border dark:border-neutral-600"
                                onPress={() => setAmount(amt.toString())}
                            />
                        ))}
                    </View>
                </Card>

                {/* Transfer Button */}
                <Button
                    title={isLoading ? "Processing..." : "Transfer Now"}
                    onPress={handleTransfer}
                    disabled={isLoading || !lookupDone || !amount}
                    icon={<Send size={20} color="white" />}
                    className={!lookupDone || !amount ? "opacity-50" : "shadow-md shadow-primary/20"}
                />

                <View className="items-center mt-8 mb-4">
                    <ArrowDownUp size={18} color="#94A3B8" />
                    <Text className="text-neutral-text-secondary dark:text-neutral-400 text-xs mt-2 text-center">
                        Transfer between your own bank accounts securely with UPI PIN verification
                    </Text>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

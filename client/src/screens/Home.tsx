
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOffline } from '../services/OfflineContext';
import { OfflineBanner } from '../components/OfflineBanner';
import { UiButton as Button } from '../components/ui/UiButton';
import { Card, ScreenWrapper } from '../components/ui';
import {
    ArrowUpRight, ArrowDownLeft, Wallet, RefreshCw, Smartphone,
    Landmark, Eye, ArrowLeftRight, Zap, Tv, Car
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export const Home = () => {
    const { user, bankBalance, offlineWallet, isOfflineMode, setOfflineMode, transactions, syncTransactions, bankAccountNo } = useOffline();
    const navigation = useNavigation<any>();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => setRefreshing(false), 1000);
    };

    const recentTxns = transactions.slice(0, 3);

    const quickActions = [
        { icon: <ArrowUpRight color="white" size={24} />, label: 'Pay / Scan', isActive: true, onPress: () => navigation.navigate('Pay') },
        { icon: <ArrowDownLeft color="#2563EB" size={24} />, label: 'Receive', onPress: () => navigation.navigate('Receive') },
        { icon: <Wallet color="#2563EB" size={24} />, label: 'Load Cash', onPress: () => navigation.navigate('Wallet') },
        { icon: <RefreshCw color="#2563EB" size={24} />, label: 'Sync Txns', onPress: syncTransactions },
        { icon: <Landmark color="#2563EB" size={24} />, label: 'Add Bank', onPress: () => navigation.navigate('AddBank') },
        { icon: <Eye color="#2563EB" size={24} />, label: 'Check Balance', onPress: () => Alert.alert('Bank Balance', `₹${bankBalance.toFixed(2)}\n\nAccount: SBI •• ${bankAccountNo?.slice(-4) || 'XXXX'}`, [{ text: 'OK' }]) },
        { icon: <ArrowLeftRight color="#2563EB" size={24} />, label: 'Self Transfer', onPress: () => navigation.navigate('Wallet') },
    ];

    const billActions = [
        { icon: <Smartphone color="#2563EB" size={22} />, label: 'Mobile\nRecharge', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { icon: <Zap color="#F59E0B" size={22} />, label: 'Electricity', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { icon: <Tv color="#8B5CF6" size={22} />, label: 'DTH', bg: 'bg-violet-50 dark:bg-violet-900/20' },
        { icon: <Car color="#10B981" size={22} />, label: 'FastTag', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-neutral-bg dark:bg-neutral-900">
            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
            >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-neutral-text-secondary dark:text-neutral-400 text-sm font-medium">Welcome back,</Text>
                        <Text className="text-2xl font-bold text-neutral-text dark:text-white">{user?.name}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setOfflineMode(!isOfflineMode)}
                        className={`p-2 rounded-full border ${isOfflineMode ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700' : 'bg-white dark:bg-neutral-800 border-primary/20 shadow-sm'} `}
                    >
                        <Smartphone size={24} color={isOfflineMode ? '#ea580c' : '#2563EB'} />
                    </TouchableOpacity>
                </View>

                {isOfflineMode && <OfflineBanner />}

                {/* Offline Wallet Card */}
                <LinearGradient
                    colors={['#2563EB', '#10B981']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-5 rounded-3xl mb-6 shadow-lg shadow-primary/30"
                >
                    <View className="flex-row justify-between items-start mb-6">
                        <View>
                            <Text className="text-white/80 font-medium mb-1">Offline Balance</Text>
                            <Text className="text-4xl font-bold text-white">₹{offlineWallet?.balance.toFixed(2)}</Text>
                        </View>
                        <View className="bg-white/20 p-2 rounded-2xl backdrop-blur-md">
                            <Wallet color="white" size={24} />
                        </View>
                    </View>
                    <View className="flex-row items-center bg-black/10 self-start px-3 py-1.5 rounded-full border border-white/10">
                        <Text className="text-white/90 text-xs font-medium">Wallet ID: •••• {offlineWallet?.id.slice(-4)}</Text>
                    </View>
                </LinearGradient>

                {/* Bank Balance (Hidden/Mocked when offline) */}
                {!isOfflineMode && (
                    <Card className="mb-8 p-0 overflow-hidden border-neutral-border dark:border-neutral-700 bg-white dark:bg-neutral-800">
                        <View className="p-4 flex-row justify-between items-center">
                            <View>
                                <Text className="text-neutral-text-secondary dark:text-neutral-400 font-medium text-sm">Bank Balance</Text>
                                <Text className="text-xl font-bold text-neutral-text dark:text-white">₹{bankBalance.toFixed(2)}</Text>
                            </View>
                            <View className="bg-neutral-bg dark:bg-neutral-700 px-3 py-1 rounded-md">
                                <Text className="text-xs text-neutral-text-secondary dark:text-neutral-300 font-medium">
                                    {bankAccountNo ? `SBI •• ${bankAccountNo.slice(-4)}` : 'Not Linked'}
                                </Text>
                            </View>
                        </View>
                    </Card>
                )}

                {/* Quick Actions */}
                <Text className="text-lg font-bold text-neutral-text dark:text-white mb-4">Quick Actions</Text>
                <View className="flex-row flex-wrap mb-6" style={{ gap: 0 }}>
                    {quickActions.map((action, index) => (
                        <ActionButton
                            key={index}
                            icon={action.icon}
                            label={action.label}
                            isActive={action.isActive}
                            onPress={action.onPress}
                        />
                    ))}
                </View>

                {/* Bills & Recharges */}
                <Text className="text-lg font-bold text-neutral-text dark:text-white mb-4">Bills & Recharges</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-8"
                    contentContainerStyle={{ gap: 12 }}
                >
                    {billActions.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => Alert.alert('Coming Soon', `${item.label.replace('\n', ' ')} will be available in a future update.`)}
                            className="items-center"
                            style={{ width: 80 }}
                        >
                            <View className={`w-14 h-14 rounded-2xl items-center justify-center mb-2 ${item.bg}`}>
                                {item.icon}
                            </View>
                            <Text className="text-xs text-center font-medium text-neutral-text-secondary dark:text-neutral-400">
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Recent Activity */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-neutral-text dark:text-white">Recent Activity</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
                        <Text className="text-primary dark:text-blue-400 font-semibold">View All</Text>
                    </TouchableOpacity>
                </View>

                {recentTxns.length === 0 ? (
                    <View className="items-center py-8 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-border dark:border-neutral-700 border-dashed">
                        <Text className="text-neutral-text-secondary dark:text-neutral-400">No recent transactions</Text>
                    </View>
                ) : (
                    recentTxns.map((txn) => (
                        <Card key={txn.id} className="mb-3 flex-row items-center justify-between py-4 shadow-none border border-neutral-border dark:border-neutral-700 bg-white dark:bg-neutral-800">
                            <View className="flex-row items-center">
                                <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${txn.type === 'sent' ? 'bg-red-50 dark:bg-red-900/20' :
                                    txn.type === 'received' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
                                    } `}>
                                    {txn.type === 'sent' ? <ArrowUpRight size={20} color="#ef4444" /> :
                                        txn.type === 'received' ? <ArrowDownLeft size={20} color="#22c55e" /> :
                                            <RefreshCw size={20} color="#3b82f6" />}
                                </View>
                                <View>
                                    <Text className="font-semibold text-neutral-text dark:text-white capitalize text-base">{txn.type}</Text>
                                    <Text className="text-xs text-neutral-text-secondary dark:text-neutral-400">{new Date(txn.createdAt).toLocaleDateString()}</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className={`font-bold text-base ${txn.type === 'sent' ? 'text-neutral-text dark:text-white' : 'text-status-success'} `}>
                                    {txn.type === 'sent' ? '-' : '+'}₹{txn.amount.toFixed(2)}
                                </Text>
                                <Text className={`text-xs capitalize font-medium ${txn.status === 'pending' ? 'text-status-warning' :
                                    txn.status === 'failed' ? 'text-status-error' : 'text-neutral-text-secondary dark:text-neutral-400'
                                    } `}>
                                    {txn.status}
                                </Text>
                            </View>
                        </Card>
                    ))
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

const ActionButton = ({ icon, label, isActive = false, onPress }: { icon: any, label: string, isActive?: boolean, onPress: () => void }) => (
    <TouchableOpacity className="w-[25%] items-center mb-4" onPress={onPress}>
        <View className={`w-16 h-16 rounded-[20px] items-center justify-center mb-2 shadow-sm ${isActive ? 'bg-primary' : 'bg-white dark:bg-neutral-800 border border-neutral-border dark:border-neutral-700'
            } `}>
            {icon}
        </View>
        <Text className="text-xs text-center font-medium text-neutral-text-secondary dark:text-neutral-400">{label}</Text>
    </TouchableOpacity>
);

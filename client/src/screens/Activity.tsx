import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { InputField as Input } from '../components/ui/InputField';
import { Card, ScreenWrapper } from '../components/ui';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Search, Filter } from 'lucide-react-native';

const FilterChip = ({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        className={`px-4 py-2 rounded-full mr-2 border ${active ? 'bg-primary border-primary' : 'bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700'}`}
    >
        <Text className={`${active ? 'text-white' : 'text-neutral-text-secondary dark:text-neutral-400'} font-medium`}>{label}</Text>
    </TouchableOpacity>
);

export const Activity = () => {
    const { transactions } = useOffline();
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Settled' | 'Failed'>('All');
    const [search, setSearch] = useState('');

    const filteredTxns = transactions.filter(t => {
        const matchFilter = filter === 'All' || t.status.toLowerCase() === filter.toLowerCase();
        const matchSearch = t.id.includes(search) ||
            t.note?.toLowerCase().includes(search.toLowerCase()) ||
            t.toUser?.toLowerCase().includes(search.toLowerCase()) ||
            t.fromUser?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const renderItem = ({ item }: { item: Transaction }) => (
        <Card className="mb-3 flex-row items-center justify-between py-4 bg-white dark:bg-neutral-800 border border-neutral-border dark:border-neutral-700 shadow-sm">
            <View className="flex-row items-center flex-1">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${item.type === 'sent' ? 'bg-red-50 dark:bg-red-900/20' :
                    item.type === 'received' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                    {item.type === 'sent' ? <ArrowUpRight size={20} color="#ef4444" /> :
                        item.type === 'received' ? <ArrowDownLeft size={20} color="#22c55e" /> :
                            <RefreshCw size={20} color="#3b82f6" />}
                </View>
                <View className="flex-1">
                    <Text className="font-bold text-neutral-text dark:text-white">
                        {item.type === 'sent' ? `Paid to ${item.toUser}` :
                            item.type === 'received' ? `Received from ${item.fromUser}` :
                                item.type === 'load' ? 'Loaded Cash' : 'Unloaded Cash'}
                    </Text>
                    <Text className="text-xs text-neutral-text-secondary dark:text-neutral-400">{new Date(item.createdAt).toLocaleString()}</Text>
                    {item.note && <Text className="text-xs text-neutral-text-secondary dark:text-neutral-400 italic" numberOfLines={1}>{item.note}</Text>}
                </View>
            </View>
            <View className="items-end">
                <Text className={`font-bold ${item.type === 'sent' ? 'text-neutral-text dark:text-white' : 'text-status-success'}`}>
                    {item.type === 'sent' ? '-' : '+'}₹{item.amount.toFixed(2)}
                </Text>
                <View className={`px-2 py-0.5 rounded-full mt-1 ${item.status === 'pending' ? 'bg-orange-50 dark:bg-orange-900/20' :
                    item.status === 'failed' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'
                    }`}>
                    <Text className={`text-[10px] capitalize font-medium ${item.status === 'pending' ? 'text-status-warning' :
                        item.status === 'failed' ? 'text-status-error' : 'text-status-success'
                        }`}>
                        {item.status} ({item.isOffline ? 'Off' : 'On'})
                    </Text>
                </View>
            </View>
        </Card>
    );

    return (
        <ScreenWrapper>
            <View className="px-4 py-2">
                <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-4">Activity</Text>

                {/* Search */}
                <Input
                    placeholder="Search transactions"
                    icon={<Search size={20} color="#9ca3af" />}
                    value={search}
                    onChangeText={setSearch}
                    className="bg-white dark:bg-neutral-800 dark:text-white"
                />

                {/* Filters */}
                <View className="flex-row mb-6 mt-4">
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={['All', 'Pending', 'Settled', 'Failed']}
                        keyExtractor={item => item}
                        renderItem={({ item }) => (
                            <FilterChip
                                label={item}
                                active={filter === item}
                                onPress={() => setFilter(item as any)}
                            />
                        )}
                    />
                </View>
            </View>

            <FlatList
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                data={filteredTxns}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View className="items-center py-10">
                        <Text className="text-neutral-text-secondary dark:text-neutral-400">No transactions found</Text>
                    </View>
                }
            />
        </ScreenWrapper>
    );
};

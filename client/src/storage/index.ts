import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, OfflineWallet, Transaction, UserProfile } from '../types';

const KEYS = {
    USER_PROFILE: 'user_profile',
    BANK_BALANCE: 'bank_balance',
    OFFLINE_WALLET: 'offline_wallet',
    TRANSACTIONS: 'transactions',
    APP_SETTINGS: 'app_settings',
};

export const StorageService = {
    async saveUserProfile(profile: UserProfile): Promise<void> {
        try {
            await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
        } catch (e) {
            console.error('Failed to save user profile', e);
        }
    },

    async getUserProfile(): Promise<UserProfile | null> {
        try {
            const json = await AsyncStorage.getItem(KEYS.USER_PROFILE);
            return json ? JSON.parse(json) : null;
        } catch (e) {
            console.error('Failed to get user profile', e);
            return null;
        }
    },

    async saveBankBalance(balance: number): Promise<void> {
        await AsyncStorage.setItem(KEYS.BANK_BALANCE, JSON.stringify(balance));
    },

    async getBankBalance(): Promise<number> {
        const json = await AsyncStorage.getItem(KEYS.BANK_BALANCE);
        return json ? JSON.parse(json) : 10000; // Default mock balance
    },

    async saveOfflineWallet(wallet: OfflineWallet): Promise<void> {
        await AsyncStorage.setItem(KEYS.OFFLINE_WALLET, JSON.stringify(wallet));
    },

    async getOfflineWallet(): Promise<OfflineWallet | null> {
        const json = await AsyncStorage.getItem(KEYS.OFFLINE_WALLET);
        return json ? JSON.parse(json) : null;
    },

    async saveTransactions(transactions: Transaction[]): Promise<void> {
        await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
    },

    async getTransactions(): Promise<Transaction[]> {
        const json = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
        return json ? JSON.parse(json) : [];
    },

    async clearAll(): Promise<void> {
        await AsyncStorage.clear();
    }
};

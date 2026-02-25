import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, OfflineWallet, Transaction, UserProfile } from '../types';

const KEYS = {
    USER_PROFILE: 'user_profile',
    BANK_BALANCE: 'bank_balance',
    OFFLINE_WALLET: 'offline_wallet',
    TRANSACTIONS: 'transactions',
    APP_SETTINGS: 'app_settings',
    BANK_TOKEN: 'bank_token',
    BANK_ACCOUNT_NO: 'bank_account_no',
    AUTH_TOKEN: 'auth_token',
    APP_CREDENTIALS: 'app_credentials',
    UPI_PINS: 'upi_pins', // Store map of accountNumber -> pin
    LINKED_ACCOUNTS: 'linked_accounts', // Store array of linked bank accounts
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
        return json ? JSON.parse(json) : 0;
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
        // Preserve theme preference across logout
        const savedTheme = await AsyncStorage.getItem('user_theme');
        await AsyncStorage.clear();
        if (savedTheme) {
            await AsyncStorage.setItem('user_theme', savedTheme);
        }
    },

    /** Clears session data but preserves app credentials so user can re-login */
    async clearSession(): Promise<void> {
        const keysToRemove = [
            KEYS.USER_PROFILE,
            KEYS.BANK_BALANCE,
            KEYS.OFFLINE_WALLET,
            KEYS.TRANSACTIONS,
            KEYS.BANK_TOKEN,
            KEYS.BANK_ACCOUNT_NO,
            KEYS.AUTH_TOKEN,
        ];
        await AsyncStorage.multiRemove(keysToRemove);
    },

    async saveBankToken(token: string): Promise<void> {
        await AsyncStorage.setItem(KEYS.BANK_TOKEN, token);
    },

    async getBankToken(): Promise<string | null> {
        return await AsyncStorage.getItem(KEYS.BANK_TOKEN);
    },

    async saveBankAccountNo(accountNo: string): Promise<void> {
        await AsyncStorage.setItem(KEYS.BANK_ACCOUNT_NO, accountNo);
    },

    async getBankAccountNo(): Promise<string | null> {
        return await AsyncStorage.getItem(KEYS.BANK_ACCOUNT_NO);
    },

    async saveLinkedBankAccounts(accounts: any[]): Promise<void> {
        await AsyncStorage.setItem(KEYS.LINKED_ACCOUNTS, JSON.stringify(accounts));
    },

    async getLinkedBankAccounts(): Promise<any[]> {
        const json = await AsyncStorage.getItem(KEYS.LINKED_ACCOUNTS);
        return json ? JSON.parse(json) : [];
    },

    async saveAuthToken(token: string): Promise<void> {
        await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    },

    async getAuthToken(): Promise<string | null> {
        return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    },

    /** Save app-level credentials (separate from bank credentials) */
    async saveAppCredentials(creds: { name: string; email: string; password: string; mobile: string; dob: string }): Promise<void> {
        await AsyncStorage.setItem(KEYS.APP_CREDENTIALS, JSON.stringify(creds));
    },

    /** Get app-level credentials */
    async getAppCredentials(): Promise<{ name: string; email: string; password: string; mobile: string; dob: string } | null> {
        const json = await AsyncStorage.getItem(KEYS.APP_CREDENTIALS);
        return json ? JSON.parse(json) : null;
    },

    async saveUpiPin(accountNumber: string, pin: string): Promise<void> {
        try {
            const existing = await AsyncStorage.getItem(KEYS.UPI_PINS);
            const pins = existing ? JSON.parse(existing) : {};
            pins[accountNumber] = pin;
            await AsyncStorage.setItem(KEYS.UPI_PINS, JSON.stringify(pins));
        } catch (e) {
            console.error('Failed to save UPI PIN', e);
        }
    },

    async getUpiPin(accountNumber: string): Promise<string | null> {
        try {
            const existing = await AsyncStorage.getItem(KEYS.UPI_PINS);
            if (!existing) return null;
            const pins = JSON.parse(existing);
            return pins[accountNumber] || null;
        } catch (e) {
            console.error('Failed to get UPI PIN', e);
            return null;
        }
    },

    async deleteUpiPin(accountNumber: string): Promise<void> {
        try {
            const existing = await AsyncStorage.getItem(KEYS.UPI_PINS);
            if (!existing) return;
            const pins = JSON.parse(existing);
            delete pins[accountNumber];
            await AsyncStorage.setItem(KEYS.UPI_PINS, JSON.stringify(pins));
        } catch (e) {
            console.error('Failed to delete UPI PIN', e);
        }
    }
};


import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { AppState, OfflineWallet, Transaction, TransactionType, UserProfile } from '../types';
import { StorageService } from '../storage';
import { MockApi } from './api';

const DEFAULT_LIMITS = { maxBalance: 2000, maxPerTransaction: 500, dailyLimit: 2000 };
const API_URL = 'http://localhost:5000/api';

interface ContextType extends AppState {
    setOfflineMode: (isOffline: boolean) => void;
    loadOfflineCash: (amount: number) => Promise<boolean>;
    sendMoney: (amount: number, toUser: Partial<UserProfile>, note?: string) => Promise<boolean>;
    receiveMoney: (amount: number, fromUser: Partial<UserProfile>) => Promise<boolean>;
    syncTransactions: () => Promise<void>;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (data: { name: string; email: string; password: string; mobile: string; dob: string }) => Promise<boolean>;
    updateUserProfile: (data: { name?: string }) => Promise<boolean>;
    linkBankAccount: (accountNo: string, email: string, pass?: string) => Promise<boolean>;
    unlinkBankAccount: (accountNo: string) => Promise<boolean>;
    bankAccounts: any[];
    logout: () => void;
}

const OfflineContext = createContext<ContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [bankBalance, setBankBalance] = useState(0);
    const [bankAccountNo, setBankAccountNo] = useState<string | null>(null);
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);
    const [offlineWallet, setOfflineWallet] = useState<OfflineWallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isOfflineMode, setIsOfflineMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadInitialState();
    }, []);

    const loadInitialState = async () => {
        setIsLoading(true);
        const [storedUser, storedBalance, storedWallet, storedTxns, storedAccountNo, storedToken] = await Promise.all([
            StorageService.getUserProfile(),
            StorageService.getBankBalance(),
            StorageService.getOfflineWallet(),
            StorageService.getTransactions(),
            StorageService.getBankAccountNo(),
            StorageService.getBankToken(),
        ]);

        if (storedUser) setUser(storedUser);
        setBankBalance(storedBalance);
        setBankAccountNo(storedAccountNo);

        // Load bank accounts if token exists
        let accounts: any[] = [];
        if (storedAccountNo) {
            let ownerName = '';
            // Fetch the real account holder name from the bank DB
            if (storedToken) {
                try {
                    const verifyRes = await MockApi.verifyBankAccount(storedAccountNo, storedToken);
                    if (verifyRes?.account?.name) {
                        ownerName = verifyRes.account.name;
                    }
                } catch (e) {
                    console.error('Error fetching account owner name:', e);
                }
            }
            accounts.push({
                bankName: 'DigitalDhan Bank',
                accountNumber: storedAccountNo,
                balance: storedBalance,
                ownerName: ownerName,
            });
        }
        setBankAccounts(accounts);

        setOfflineWallet(storedWallet || { id: 'w1', balance: 0, lastSyncedAt: new Date().toISOString(), limits: DEFAULT_LIMITS });

        // Load offline transactions + fetch bank transactions if bank is linked
        let allTxns = storedTxns || [];
        if (storedToken) {
            try {
                const bankTxns = await MockApi.fetchTransactions(storedToken);
                const formattedBankTxns = bankTxns.map((t: any) => ({
                    id: t.id,
                    type: (t.type === 'credit' ? 'received' : 'sent') as TransactionType,
                    amount: t.amount,
                    status: t.status === 'Success' ? 'settled' : t.status.toLowerCase(),
                    createdAt: t.date,
                    isOffline: false,
                    note: t.remarks || (t.type === 'credit' ? 'Credit' : 'Debit'),
                    fromUser: t.type === 'credit' ? t.to : undefined,
                    toUser: t.type === 'debit' ? t.to : undefined
                }));

                const offlineOnly = allTxns.filter(t => t.isOffline);
                allTxns = [...formattedBankTxns, ...offlineOnly].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            } catch (e) {
                console.error('Error fetching transactions:', e);
            }
        }

        setTransactions(allTxns);
        setIsLoading(false);
    };

    // ============================================================
    // APP AUTH — Uses separate AppUser table on server
    // ============================================================

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/app-auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                return error.message || 'Invalid credentials';
            }

            const data = await response.json();
            const { token, user: serverUser } = data;

            const newUser: UserProfile = {
                id: serverUser.id,
                name: serverUser.name,
                phone: serverUser.mobile || '',
                upiId: `${serverUser.mobile}@digidhan`,
                email: serverUser.email,
                token: token,
                mobile: serverUser.mobile,
            };

            await StorageService.saveUserProfile(newUser);
            await StorageService.saveAuthToken(token);
            setUser(newUser);

            // Restore or create wallet on login
            const existingWallet = await StorageService.getOfflineWallet();
            if (existingWallet) {
                setOfflineWallet(existingWallet);
            } else {
                const walletId = `W-${serverUser.id.slice(0, 8).toUpperCase()}`;
                const newWallet: OfflineWallet = {
                    id: walletId,
                    balance: 0,
                    lastSyncedAt: new Date().toISOString(),
                    limits: DEFAULT_LIMITS,
                };
                setOfflineWallet(newWallet);
                await StorageService.saveOfflineWallet(newWallet);
            }

            return true;
        } catch (error: any) {
            return error.message || 'Could not connect to server';
        }
    };

    const signup = async (data: { name: string; email: string; password: string; mobile: string; dob: string }) => {
        try {
            const response = await fetch(`${API_URL}/app-auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                return error.message || 'Could not create account';
            }

            const resData = await response.json();
            const { token, user: serverUser } = resData;

            const newUser: UserProfile = {
                id: serverUser.id,
                name: serverUser.name,
                phone: serverUser.mobile || '',
                upiId: `${serverUser.mobile}@digidhan`,
                email: serverUser.email,
                token: token,
                mobile: serverUser.mobile,
            };

            await StorageService.saveUserProfile(newUser);
            await StorageService.saveAuthToken(token);
            setUser(newUser);

            // Auto-create offline wallet for the new user
            const walletId = `W-${serverUser.id.slice(0, 8).toUpperCase()}`;
            const newWallet: OfflineWallet = {
                id: walletId,
                balance: 0,
                lastSyncedAt: new Date().toISOString(),
                limits: DEFAULT_LIMITS,
            };
            setOfflineWallet(newWallet);
            await StorageService.saveOfflineWallet(newWallet);

            return true;
        } catch (error: any) {
            return error.message || 'Could not connect to server';
        }
    };

    const updateUserProfile = async (profileData: { name?: string }) => {
        try {
            const token = user?.token || await StorageService.getAuthToken();
            if (!token) throw new Error('Not authenticated');

            const response = await fetch(`${API_URL}/app-auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Update failed');
            }

            const resData = await response.json();
            const updatedUser = { ...user!, ...profileData };
            if (resData.user) {
                updatedUser.name = resData.user.name || updatedUser.name;
            }

            await StorageService.saveUserProfile(updatedUser);
            setUser(updatedUser);
            return true;
        } catch (error: any) {
            Alert.alert('Update Failed', error.message || 'Could not update profile');
            return false;
        }
    };

    // ============================================================
    // WALLET / TRANSACTIONS
    // ============================================================

    const loadOfflineCash = async (amount: number) => {
        if (bankBalance < amount) return false;

        const newBankBalance = bankBalance - amount;
        setBankBalance(newBankBalance);
        StorageService.saveBankBalance(newBankBalance);

        const newWallet = { ...offlineWallet!, balance: offlineWallet!.balance + amount };
        setOfflineWallet(newWallet);
        StorageService.saveOfflineWallet(newWallet);

        const txn: Transaction = {
            id: Date.now().toString(),
            type: 'load',
            amount,
            status: 'settled',
            createdAt: new Date().toISOString(),
            isOffline: false,
            note: 'Loaded from Bank'
        };
        addTransaction(txn);
        return true;
    };

    const sendMoney = async (amount: number, toUser: Partial<UserProfile>, note?: string) => {
        if ((offlineWallet?.balance || 0) < amount) return false;

        const newWallet = { ...offlineWallet!, balance: offlineWallet!.balance - amount };
        setOfflineWallet(newWallet);
        StorageService.saveOfflineWallet(newWallet);

        const txn: Transaction = {
            id: Date.now().toString(),
            type: 'sent',
            amount,
            toUser: toUser.name || toUser.upiId,
            status: isOfflineMode ? 'pending' : 'settled',
            createdAt: new Date().toISOString(),
            isOffline: isOfflineMode,
            note
        };
        addTransaction(txn);
        return true;
    };

    const receiveMoney = async (amount: number, fromUser: Partial<UserProfile>) => {
        const newWallet = { ...offlineWallet!, balance: offlineWallet!.balance + amount };
        setOfflineWallet(newWallet);
        StorageService.saveOfflineWallet(newWallet);

        const txn: Transaction = {
            id: Date.now().toString(),
            type: 'received',
            amount,
            fromUser: fromUser.name || fromUser.upiId,
            status: isOfflineMode ? 'pending' : 'settled',
            createdAt: new Date().toISOString(),
            isOffline: isOfflineMode,
        };
        addTransaction(txn);
        return true;
    };

    const addTransaction = (txn: Transaction) => {
        const newTxns = [txn, ...transactions];
        setTransactions(newTxns);
        StorageService.saveTransactions(newTxns);
    };

    const syncTransactions = async () => {
        if (isOfflineMode) return;
        const pending = transactions.filter(t => t.status === 'pending');
        if (pending.length === 0) return;

        const { synced, failed } = await MockApi.syncTransactions(pending);

        const updatedTxns = transactions.map(t => {
            if (synced.includes(t.id)) return { ...t, status: 'settled', settledAt: new Date().toISOString() };
            if (failed.includes(t.id)) return { ...t, status: 'failed' };
            return t;
        }) as Transaction[];

        setTransactions(updatedTxns);
        StorageService.saveTransactions(updatedTxns);
    };

    const logout = async () => {
        await StorageService.clearAll();
        setUser(null);
        setBankBalance(0);
        setBankAccountNo(null);
        setOfflineWallet(null);
        setTransactions([]);
    };

    // ============================================================
    // LINK BANK — connects DigiDhan bank account to this app
    // ============================================================

    const linkBankAccount = async (accountNumber: string, email: string, pass?: string): Promise<boolean> => {
        console.log(`[linkBankAccount] Starting link for account: ${accountNumber}, email: ${email}`);
        try {
            console.log(`[linkBankAccount] 1. Calling login API...`);
            let loginResponse;
            try {
                loginResponse = pass
                    ? await MockApi.login(email, pass)
                    : await MockApi.loginViaAccount(accountNumber);
                console.log(`[linkBankAccount] 1. Login successful. Token received.`);
            } catch (err: any) {
                console.error(`[linkBankAccount] API /login Failed:`, err);
                throw new Error(`Login failed: ${err.message}`);
            }
            const token = loginResponse.token;

            console.log(`[linkBankAccount] 2. Calling verifyBankAccount API...`);
            let verificationResponse;
            try {
                verificationResponse = await MockApi.verifyBankAccount(accountNumber, token);
                console.log(`[linkBankAccount] 2. Verification successful. Account details mapped.`);
            } catch (err: any) {
                console.error(`[linkBankAccount] API /verify-bank-account Failed:`, err);
                throw new Error(`Verification failed: ${err.message}`);
            }

            await StorageService.saveBankToken(token);

            setBankBalance(verificationResponse.account.balance);
            StorageService.saveBankBalance(verificationResponse.account.balance);

            setBankAccountNo(verificationResponse.account.accountNumber);
            StorageService.saveBankAccountNo(verificationResponse.account.accountNumber);

            setBankAccounts(prev => {
                // Avoid duplicates
                if (prev.some(a => a.accountNumber === verificationResponse.account.accountNumber)) return prev;
                return [...prev, {
                    bankName: verificationResponse.account.bankName || 'DigitalDhan Bank',
                    accountNumber: verificationResponse.account.accountNumber,
                    balance: verificationResponse.account.balance,
                    ownerName: verificationResponse.account.name || ''
                }];
            });

            const updatedUser = {
                ...user!,
                accountNumber: verificationResponse.account.accountNumber,
            };
            setUser(updatedUser);
            await StorageService.saveUserProfile(updatedUser);

            console.log(`[linkBankAccount] 3. Fetching transactions...`);
            const bankTxns = await MockApi.fetchTransactions(token);
            console.log(`[linkBankAccount] 3. Bank transactions fetched (${bankTxns.length})`);

            const formattedBankTxns = bankTxns.map((t: any) => ({
                id: t.id,
                type: (t.type === 'credit' ? 'received' : 'sent') as TransactionType,
                amount: t.amount,
                status: t.status === 'Success' ? 'settled' : t.status.toLowerCase(),
                createdAt: t.date,
                isOffline: false,
                note: t.remarks || (t.type === 'credit' ? 'Credit' : 'Debit'),
                fromUser: t.type === 'credit' ? t.to : undefined,
                toUser: t.type === 'debit' ? t.to : undefined
            }));

            setTransactions(prev => {
                const map = new Map();
                [...formattedBankTxns, ...prev.filter(t => t.isOffline)].forEach(t => map.set(t.id, t));
                return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            });

            console.log(`[linkBankAccount] Linking COMPLETE!`);
            return true;
        } catch (error: any) {
            console.error('[linkBankAccount] FAILED:', error);
            Alert.alert('Link Failed', error.message || 'Could not verify account');
            return false;
        }
    };

    const unlinkBankAccount = async (accountNumber: string): Promise<boolean> => {
        try {
            setBankAccounts(prev => prev.filter(a => a.accountNumber !== accountNumber));
            if (bankAccountNo === accountNumber) {
                setBankAccountNo(null);
                setBankBalance(0);
            }
            return true;
        } catch (error) {
            console.error('[unlinkBankAccount] Failed', error);
            return false;
        }
    };

    return (
        <OfflineContext.Provider value={{
            user, bankBalance, offlineWallet, transactions, isOfflineMode, isLoading, bankAccountNo, bankAccounts,
            setOfflineMode: setIsOfflineMode, loadOfflineCash, sendMoney, receiveMoney, syncTransactions,
            login, signup, updateUserProfile, linkBankAccount, unlinkBankAccount, logout
        }}>
            {children}
        </OfflineContext.Provider>
    );
};

export const useOffline = () => {
    const context = useContext(OfflineContext);
    if (!context) throw new Error('useOffline must be used within OfflineProvider');
    return context;
};

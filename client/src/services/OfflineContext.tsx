import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, OfflineWallet, Transaction, UserProfile } from '../types';
import { StorageService } from '../storage';
import { MockApi } from './api';

const DEFAULT_LIMITS = { maxBalance: 2000, maxPerTransaction: 500, dailyLimit: 2000 };

interface ContextType extends AppState {
    setOfflineMode: (isOffline: boolean) => void;
    loadOfflineCash: (amount: number) => Promise<boolean>;
    sendMoney: (amount: number, toUser: Partial<UserProfile>, note?: string) => Promise<boolean>;
    receiveMoney: (amount: number, fromUser: Partial<UserProfile>) => Promise<boolean>;
    syncTransactions: () => Promise<void>;
    isLoading: boolean;
    login: (phone: string, pin: string) => Promise<boolean>;
    logout: () => void;
}

const OfflineContext = createContext<ContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [bankBalance, setBankBalance] = useState(0);
    const [offlineWallet, setOfflineWallet] = useState<OfflineWallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isOfflineMode, setIsOfflineMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadInitialState();
    }, []);

    const loadInitialState = async () => {
        setIsLoading(true);
        const [storedUser, storedBalance, storedWallet, storedTxns] = await Promise.all([
            StorageService.getUserProfile(),
            StorageService.getBankBalance(),
            StorageService.getOfflineWallet(),
            StorageService.getTransactions(),
        ]);

        if (storedUser) setUser(storedUser);
        setBankBalance(storedBalance);
        setOfflineWallet(storedWallet || { id: 'w1', balance: 0, lastSyncedAt: new Date().toISOString(), limits: DEFAULT_LIMITS });
        setTransactions(storedTxns || []);
        setIsLoading(false);
    };

    const login = async (phone: string, pin: string) => {
        // Mock login
        const newUser: UserProfile = { id: 'u1', name: 'Demo User', phone, upiId: `${phone}@bank` };
        await StorageService.saveUserProfile(newUser);
        setUser(newUser);
        return true;
    };

    const loadOfflineCash = async (amount: number) => {
        if (bankBalance < amount) return false;

        // Debit bank, Credit offline
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

        // Debit offline wallet
        const newWallet = { ...offlineWallet!, balance: offlineWallet!.balance - amount };
        setOfflineWallet(newWallet);
        StorageService.saveOfflineWallet(newWallet);

        const txn: Transaction = {
            id: Date.now().toString(),
            type: 'sent',
            amount,
            toUser: toUser.name || toUser.upiId,
            status: isOfflineMode ? 'pending' : 'settled', // Online settles immediately for demo
            createdAt: new Date().toISOString(),
            isOffline: isOfflineMode,
            note
        };
        addTransaction(txn);
        return true;
    };

    const receiveMoney = async (amount: number, fromUser: Partial<UserProfile>) => {
        // Credit offline wallet (simulating P2P receive)
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
            if (failed.includes(t.id)) return { ...t, status: 'failed' }; // Refund logic omitted for simplicity
            return t;
        }) as Transaction[];

        setTransactions(updatedTxns);
        StorageService.saveTransactions(updatedTxns);
    };

    const logout = () => {
        StorageService.clearAll();
        setUser(null);
    };

    return (
        <OfflineContext.Provider value={{
            user, bankBalance, offlineWallet, transactions, isOfflineMode, isLoading,
            setOfflineMode: setIsOfflineMode, loadOfflineCash, sendMoney, receiveMoney, syncTransactions, login, logout
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

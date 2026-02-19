export type UserProfile = {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    upiId: string;
};

export type WalletLimits = {
    maxBalance: number;
    maxPerTransaction: number;
    dailyLimit: number;
};

export type OfflineWallet = {
    id: string;
    balance: number;
    lastSyncedAt: string; // ISO Date string
    limits: WalletLimits;
};

export type TransactionStatus = 'pending' | 'settled' | 'failed';
export type TransactionType = 'sent' | 'received' | 'load' | 'unload';

export type Transaction = {
    id: string;
    type: TransactionType;
    amount: number;
    fromUser?: string; // name or ID
    toUser?: string; // name or ID
    note?: string;
    status: TransactionStatus;
    createdAt: string; // ISO Date string
    settledAt?: string; // ISO Date string
    isOffline: boolean;
};

export type AppState = {
    user: UserProfile | null;
    bankBalance: number; // Simulated online balance
    offlineWallet: OfflineWallet | null;
    transactions: Transaction[];
    isOfflineMode: boolean; // Dev toggle
};

import { Transaction, UserProfile } from '../types';

export const MockApi = {
    fetchBankBalance: async (): Promise<number> => {
        return new Promise((resolve) => setTimeout(() => resolve(25000.50), 1000));
    },

    searchUser: async (query: string): Promise<UserProfile[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 'u2', name: 'Alice Smith', phone: '9876543210', upiId: 'alice@bank' },
                    { id: 'u3', name: 'Bob Jones', phone: '8765432109', upiId: 'bob@bank' },
                ].filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.phone.includes(query)));
            }, 500);
        });
    },

    syncTransactions: async (transactions: Transaction[]): Promise<{ synced: string[], failed: string[] }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const synced = transactions.filter((_, i) => i % 2 === 0).map(t => t.id); // Mock success for half
                const failed = transactions.filter((_, i) => i % 2 !== 0).map(t => t.id); // Mock failure for rest
                resolve({ synced, failed });
            }, 2000);
        });
    }
};

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

    },

    verifyBankAccount: async (accountNumber: string, token: string): Promise<any> => {
        try {
            // Replace with your actual server IP if running on physical device
            // For Android Emulator use 10.0.2.2, for iOS Simulator use localhost
            const API_URL = 'http://localhost:5000/api';

            const response = await fetch(`${API_URL}/user/verify-bank-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ accountNumber })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Verification failed');
            }

            return await response.json();

        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    login: async (email: string, password: string): Promise<any> => {
        try {
            const API_URL = 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Login API Error:', error);
            throw error;
        }
    },

    loginViaAccount: async (accountNumber: string): Promise<any> => {
        try {
            const API_URL = 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/auth/login-via-account`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountNumber })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Login Via Account API Error:', error);
            throw error;
        }
    },

    fetchTransactions: async (token: string): Promise<any[]> => {
        try {
            const API_URL = 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/transactions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch transactions');
            return await response.json();
        } catch (error) {
            console.error('Fetch Transactions Error:', error);
            return [];
        }
    },

    lookupAccount: async (accountNumber: string, token: string): Promise<{ email: string }> => {
        try {
            const API_URL = 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/user/lookup-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ accountNumber })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Account lookup failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Lookup API Error:', error);
            throw error;
        }
    },

};

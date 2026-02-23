import { Transaction, UserProfile } from '../types';

const API_URL = 'http://localhost:5000/api';

const fetchWithTimeout = async (url: string, options: any, timeoutMs = 15000) => {
    return Promise.race([
        fetch(url, options),
        new Promise<any>((_, reject) =>
            setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs / 1000}s. Make sure the server is reachable.`)), timeoutMs)
        )
    ]);
};

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
                const synced = transactions.filter((_, i) => i % 2 === 0).map(t => t.id);
                const failed = transactions.filter((_, i) => i % 2 !== 0).map(t => t.id);
                resolve({ synced, failed });
            }, 2000);
        });
    },

    verifyBankAccount: async (accountNumber: string, token: string): Promise<any> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/user/verify-bank-account`, {
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

    lookupAccount: async (accountNumber: string): Promise<any> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/user/lookup-account`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountNumber })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Account not found');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    login: async (email: string, password: string): Promise<any> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
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
            const response = await fetchWithTimeout(`${API_URL}/auth/login-via-account`, {
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

    signup: async (formData: {
        name: string;
        email: string;
        password: string;
        mobile: string;
        dob: string;
    }): Promise<any> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Signup failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Signup API Error:', error);
            throw error;
        }
    },

    forgotPassword: async (email: string): Promise<any> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send reset email');
            }
            return await response.json();
        } catch (error) {
            console.error('Forgot Password API Error:', error);
            throw error;
        }
    },

    resetPassword: async (token: string, newPassword: string): Promise<any> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Password reset failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Reset Password API Error:', error);
            throw error;
        }
    },

    getProfile: async (token: string): Promise<any> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/user/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch profile');
            return await response.json();
        } catch (error) {
            console.error('Get Profile Error:', error);
            throw error;
        }
    },

    updateProfile: async (token: string, data: { name?: string }): Promise<any> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Profile update failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Update Profile Error:', error);
            throw error;
        }
    },

    fetchTransactions: async (token: string): Promise<any[]> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/transactions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch transactions');
            return await response.json();
        } catch (error) {
            console.error('Fetch Transactions Error:', error);
            return [];
        }
    },

    sendOtp: async (accountNumber: string, token: string = ''): Promise<any> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/user/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountNumber })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to send OTP');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    verifyOtp: async (accountNumber: string, otp: string): Promise<boolean> => {
        try {
            const response = await fetchWithTimeout(`${API_URL}/user/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountNumber, otp })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Invalid OTP');
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
};

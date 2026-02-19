import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
    // Initial state from localStorage or default
    const [balance, setBalance] = useState(0);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [transactions, setTransactions] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            fetchUserData();
            fetchTransactions();
        }
    }, [token]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userData = response.data;

            // Format profile photo URL
            if (userData.profilePhoto) {
                // Remove 'uploads' prefix if present in path as it might be duplicated in static serve
                // Store path is usually 'uploads\filename' or 'uploads/filename'
                // Static serve is at /uploads

                // Better approach: just use the path as is, but replace backslashes
                const cleanPath = userData.profilePhoto.replace(/\\/g, '/');
                // Check if it already has the full URL or is a base64 data URI
                if (cleanPath.startsWith('http') || cleanPath.startsWith('data:')) {
                    userData.avatar = cleanPath;
                } else {
                    // Ensure we point to the root where uploads are served, not /api
                    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
                    userData.avatar = `${baseUrl}/${cleanPath}`;
                }
            } else {
                userData.avatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }

            setUser(userData);
            setBalance(userData.balance);
            // Update local storage if needed, but rely on API for truth
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error("Error fetching user data", error);
            if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                logout();
            }
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Transform data if necessary to match UI expectations
            const formattedTransactions = response.data.map(tx => ({
                id: tx.id,
                to: tx.to,
                date: new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                amount: tx.type === 'debit' ? -tx.amount : tx.amount,
                status: tx.status,
                type: tx.type,
                remarks: tx.remarks,
                rejectionReason: tx.rejectionReason
            }));
            setTransactions(formattedTransactions);
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    };

    const login = (userData, newToken) => {
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setTransactions([]);
        setBalance(0);
    };

    const updateUser = async (formData) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/user/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Refresh user data from server
            await fetchUserData();
            return true;
        } catch (error) {
            console.error("Profile update failed", error);
            toast.error(error.response?.data?.message || "Profile update failed");
            return false;
        }
    };

    const addTransaction = async (transaction) => {
        try {
            let type = transaction.type;
            let amount = Math.abs(transaction.amount);

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/transactions`, {
                amount,
                type,
                to: transaction.to,
                status: transaction.status || 'Success',
                remarks: transaction.remarks,
                receiverMobile: transaction.receiverMobile
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh data
            fetchUserData();
            fetchTransactions();
            // Return response data including rewards info
            return response.data;
        } catch (error) {
            console.error("Transaction failed", error);
            toast.error(error.response?.data?.message || "Transaction failed");
            return null;
        }
    };

    return (
        <TransactionContext.Provider value={{ balance, transactions, addTransaction, user, updateUser, login, logout, token, fetchUserData }}>
            {children}
        </TransactionContext.Provider>
    );
};


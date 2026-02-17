import { createContext, useContext, useState, useEffect } from "react";

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
    // Initial dummy data
    const [balance, setBalance] = useState(245000.50);
    const [user, setUser] = useState({
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "+91 98765 43210",
        bio: "Senior Software Engineer",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    });
    const [transactions, setTransactions] = useState([
        { id: 1, to: "Netflix Subscription", date: "Feb 16, 2026", amount: -499, status: "Success", type: "debit" },
        { id: 2, to: "Rahul Sharma", date: "Feb 15, 2026", amount: 5000, status: "Success", type: "credit" },
        { id: 3, to: "Grocery Store", date: "Feb 14, 2026", amount: -2340, status: "Success", type: "debit" },
        { id: 4, to: "Electricity Bill", date: "Feb 12, 2026", amount: -1200, status: "Pending", type: "debit" },
        { id: 5, to: "Failed Transfer", date: "Feb 10, 2026", amount: -5000, status: "Failed", type: "debit" },
    ]);

    const updateUser = (updatedData) => {
        setUser((prev) => ({ ...prev, ...updatedData }));
    };

    const addTransaction = (transaction) => {
        const newTx = {
            id: transactions.length + 1,
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status: "Success",
            ...transaction
        };

        setTransactions([newTx, ...transactions]);

        if (transaction.type === "credit") {
            setBalance((prev) => prev + Number(transaction.amount));
        } else {
            setBalance((prev) => prev - Number(transaction.amount));
        }
    };

    return (
        <TransactionContext.Provider value={{ balance, transactions, addTransaction, user, updateUser }}>
            {children}
        </TransactionContext.Provider>
    );
};

import { useState, useEffect } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { Phone, CheckCircle2, User, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactions } from "../context/TransactionContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';

const SendMoney = () => {
    const [sendMode, setSendMode] = useState("mobile");
    const [mobileNumber, setMobileNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("idle"); // idle, success, pending, failed
    const [accountNumber, setAccountNumber] = useState("");
    const { addTransaction, token } = useTransactions();
    const navigate = useNavigate();

    // Recipient State
    const [recipient, setRecipient] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [successDetails, setSuccessDetails] = useState({ amount: '', recipientName: '' });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (sendMode === "mobile" && mobileNumber.length === 10) {
                searchUser(mobileNumber, 'mobile');
            } else if (sendMode === "bank" && accountNumber.length >= 10) {
                searchUser(accountNumber, 'account');
            } else {
                setRecipient(null);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [mobileNumber, accountNumber, sendMode]);

    const searchUser = async (query, type) => {
        setIsSearching(true);
        try {
            const endpoint = type === 'mobile'
                ? `${import.meta.env.VITE_API_URL}/user/search/${query}`
                : `${import.meta.env.VITE_API_URL}/user/search-account/${query}`;

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecipient(response.data);
            toast.dismiss();
        } catch (error) {
            setRecipient(null);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();

        if (!recipient) {
            toast.error("Please select a valid recipient");
            return;
        }

        setStatus("pending");

        // For P2P (Mobile or Bank), we use the recipient's details found via search
        // If it's an internal user, we pass receiverMobile to trigger P2P logic in backend
        const success = await addTransaction({
            to: recipient.name,
            amount: Number(amount),
            type: "debit",
            status: "Success",
            receiverMobile: recipient.mobile // Critical for Backend P2P Logic
        });

        if (success) {
            setSuccessDetails({ amount: amount, recipientName: sendMode === 'mobile' ? recipient?.name : 'Bank Account' });
            setStatus("success");
            setAmount("");
            setMobileNumber("");
            setAccountNumber("");
            setRecipient(null);
        } else {
            setStatus("idle");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Money</h1>

            <Card className="p-8">
                <div className="flex gap-4 mb-8 bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl">
                    <button
                        onClick={() => { setSendMode("mobile"); setRecipient(null); }}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${sendMode === "mobile" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                    >
                        To Mobile Number
                    </button>
                    <button
                        onClick={() => { setSendMode("bank"); setRecipient(null); }}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${sendMode === "bank" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                    >
                        To Bank Account
                    </button>
                </div>

                <form onSubmit={handleSend} className="space-y-6">
                    <div className="space-y-4">
                        {sendMode === "mobile" ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="Enter 10-digit mobile number"
                                        className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isSearching ? (
                                            <Loader2 className="animate-spin text-blue-500" size={20} />
                                        ) : recipient && sendMode === 'mobile' ? (
                                            <CheckCircle2 className="text-green-500" size={20} />
                                        ) : mobileNumber.length === 10 ? (
                                            <User className="text-red-400" size={20} />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Number</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">AC</div>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                                        placeholder="Enter 12-digit account number"
                                        className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isSearching ? (
                                            <Loader2 className="animate-spin text-blue-500" size={20} />
                                        ) : recipient && sendMode === 'bank' ? (
                                            <CheckCircle2 className="text-green-500" size={20} />
                                        ) : accountNumber.length >= 10 ? (
                                            <User className="text-red-400" size={20} />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recipient Preview (Shared for both modes) */}
                        <AnimatePresence>
                            {recipient && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center gap-4"
                                >
                                    <img
                                        src={recipient.profilePhoto ? `${import.meta.env.VITE_API_URL}/${recipient.profilePhoto.replace(/\\/g, '/')}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                        alt={recipient.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    />
                                    <div>
                                        <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Sending to</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{recipient.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {sendMode === 'mobile' ? recipient.mobile : `AC: ${recipient.accountNumber}`}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            {!recipient && ((sendMode === 'mobile' && mobileNumber.length === 10) || (sendMode === 'bank' && accountNumber.length >= 10)) && !isSearching && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-500 text-sm px-1"
                                >
                                    User not found on this platform.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full pl-10 pr-4 py-3 text-2xl font-bold text-gray-900 dark:text-white bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Remark (Optional)</label>
                        <input
                            type="text"
                            placeholder="Dinner bill, Rent, etc."
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                        />
                    </div>

                    <Button type="submit" className="w-full justify-center text-lg py-4" disabled={!amount || status === "pending" || !recipient}>
                        {status === "pending" ? "Processing..." : `Send ₹${amount || "0"}`}
                    </Button>
                </form>
            </Card>

            {/* Success / Pending State */}
            <AnimatePresence>
                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4"
                        >
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Transfer of ₹{successDetails.amount} to {successDetails.recipientName} was successful.</p>
                            <Button onClick={() => navigate('/dashboard')} className="w-full justify-center">Done</Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SendMoney;

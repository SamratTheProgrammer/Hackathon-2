import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { Phone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactions } from "../context/TransactionContext";
import { useNavigate } from "react-router-dom";

const SendMoney = () => {
    const [sendMode, setSendMode] = useState("mobile");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("idle"); // idle, success, pending, failed
    const { addTransaction } = useTransactions();
    const navigate = useNavigate();

    const handleSend = (e) => {
        e.preventDefault();
        setStatus("pending");

        // Add transaction to context
        addTransaction({
            to: sendMode === "mobile" ? "Mobile Transfer" : "Bank Transfer",
            amount: Number(amount),
            type: "debit",
            status: "Success"
        });

        setTimeout(() => {
            setStatus("success");
        }, 2000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Money</h1>

            <Card className="p-8">
                <div className="flex gap-4 mb-8 bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl">
                    <button
                        onClick={() => setSendMode("mobile")}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${sendMode === "mobile" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                    >
                        To Mobile Number
                    </button>
                    <button
                        onClick={() => setSendMode("bank")}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${sendMode === "bank" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                    >
                        To Bank Account
                    </button>
                </div>

                <form onSubmit={handleSend} className="space-y-6">
                    {sendMode === "mobile" ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Number</label>
                                <input
                                    type="text"
                                    placeholder="123456789012"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">IFSC Code</label>
                                <input
                                    type="text"
                                    placeholder="SBIN0001234"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                    )}

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

                    <Button type="submit" className="w-full justify-center text-lg py-4" disabled={!amount || status === "pending"}>
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
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Transfer of ₹{amount} to Recipient was successful.</p>
                            <Button onClick={() => navigate('/dashboard')} className="w-full justify-center">Done</Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SendMoney;

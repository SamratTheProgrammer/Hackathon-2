import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { CreditCard, Smartphone, Building2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactions } from "../context/TransactionContext";

const AddMoney = () => {
    const { addTransaction } = useTransactions();
    const [amount, setAmount] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");
    const [utrNumber, setUtrNumber] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const paymentMethods = [
        { id: 'upi', icon: Smartphone, label: 'UPI' },
        { id: 'card', icon: CreditCard, label: 'Card' },
        { id: 'netbanking', icon: Building2, label: 'Net Banking' },
        { id: 'bank_transfer', icon: Building2, label: 'Bank Transfer' },
    ];

    const handleAddMoney = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate random delay for other methods
        if (selectedMethod !== 'bank_transfer') {
            setTimeout(async () => {
                const success = await addTransaction({
                    amount: parseFloat(amount),
                    type: 'credit',
                    to: `Added via ${paymentMethods.find(m => m.id === selectedMethod)?.label}`,
                    status: 'Success' // Auto-approve for simulated methods? Or Pending? Let's say Success for now as it was "old" behavior likely.
                });
                setLoading(false);
                if (success) {
                    setShowSuccess(true);
                    setAmount("");
                    setSelectedMethod("");
                }
            }, 1500);
            return;
        }

        // Bank Transfer Logic
        const success = await addTransaction({
            amount: parseFloat(amount),
            type: 'credit',
            to: `Bank Transfer (UTR: ${utrNumber})`,
            status: 'Pending'
        });
        setLoading(false);

        if (success) {
            setShowSuccess(true);
            setAmount("");
            setUtrNumber("");
            setSelectedMethod("");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Money to Wallet</h1>

            <Card className="p-8">
                <form onSubmit={handleAddMoney} className="space-y-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full pl-10 pr-4 py-4 text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-600 outline-none transition-colors placeholder-gray-300 dark:placeholder-gray-600"
                            />
                        </div>
                        <div className="flex gap-2 mt-4">
                            {[100, 500, 1000, 2000].map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setAmount(val.toString())}
                                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-colors"
                                >
                                    + ₹{val}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Select Payment Method</label>
                        <div className="grid grid-cols-2 gap-4">
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${selectedMethod === method.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        <Icon size={24} />
                                        <span className="font-medium">{method.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedMethod === 'bank_transfer' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <Building2 className="text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Bank Transfer Details</h3>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="flex justify-between">
                                        <span>Bank Name:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">Digital Bank</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Account Name:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">DigitalDhan Solutions</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Account Number:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">123456789012</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>IFSC Code:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">DIGI0001234</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transaction ID / UTR Number</label>
                                <input
                                    type="text"
                                    value={utrNumber}
                                    onChange={(e) => setUtrNumber(e.target.value)}
                                    placeholder="Enter 12-digit UTR number"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">Please enter the UTR number from your banking app after making the transfer.</p>
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full justify-center text-lg py-4" disabled={!amount || !selectedMethod || (selectedMethod === 'bank_transfer' && !utrNumber) || loading}>
                        {loading ? "Processing..." : (selectedMethod === 'bank_transfer' ? "Submit Payment Proof" : "Proceed to Pay")}
                    </Button>
                </form>
            </Card>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
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
                            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Sent!</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Your request to add ₹{amount} has been sent for approval. Your balance will be updated once approved.</p>
                            <Button onClick={() => setShowSuccess(false)} className="w-full justify-center">Done</Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddMoney;

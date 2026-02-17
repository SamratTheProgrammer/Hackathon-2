import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddMoney = () => {
    const [amount, setAmount] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("upi");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddMoney = (e) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const methods = [
        { id: "upi", icon: Smartphone, label: "UPI", desc: "Google Pay, PhonePe, Paytm" },
        { id: "card", icon: CreditCard, label: "Debit Card", desc: "Visa, Mastercard, RuPay" },
        { id: "netbanking", icon: Building2, label: "Net Banking", desc: "SBI, HDFC, ICICI, Axis" },
    ];

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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Select Payment Mode</label>
                        <div className="space-y-3">
                            {methods.map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === method.id
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-gray-100 dark:border-gray-700 hover:border-blue-200"
                                        }`}
                                >
                                    <div className={`p-3 rounded-full ${selectedMethod === method.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                                        <method.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold ${selectedMethod === method.id ? "text-blue-900 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
                                            {method.label}
                                        </h3>
                                        <p className="text-sm text-gray-500">{method.desc}</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? "border-blue-600" : "border-gray-300"}`}>
                                        {selectedMethod === method.id && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" className="w-full justify-center text-lg py-4" disabled={!amount}>
                        Proceed to Add ₹{amount || "0"}
                    </Button>
                </form>
            </Card>

            {/* Success Modal Simulation */}
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
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Smartphone size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Money Added!</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">₹{amount} has been successfully added to your wallet.</p>
                            <Button onClick={() => setShowSuccess(false)} className="w-full justify-center">Done</Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddMoney;

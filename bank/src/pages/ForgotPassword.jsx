import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Link to="/login" className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 text-sm transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to Login
            </Link>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Reset Password</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                {step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP sent to your email"}
            </p>

            {step === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full justify-center" disabled={isLoading}>
                        {isLoading ? "Sending OTP..." : "Send OTP"} <Send size={18} className="ml-2" />
                    </Button>
                </form>
            ) : (
                <form className="space-y-4">
                    <div className="flex gap-4 justify-center my-6">
                        {[1, 2, 3, 4].map((_, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength="1"
                                className="w-14 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all"
                            />
                        ))}
                    </div>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Didn't receive code? <button type="button" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Resend</button>
                    </div>

                    <Button type="submit" className="w-full justify-center">
                        Verify & Reset <CheckCircle size={18} className="ml-2" />
                    </Button>
                </form>
            )}
        </motion.div>
    );
};

export default ForgotPassword;

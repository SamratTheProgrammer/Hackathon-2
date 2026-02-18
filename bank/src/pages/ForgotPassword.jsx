import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
            setEmailSent(true);
            toast.success("Password reset link sent to your email");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh]"
        >
            <div className="w-full max-w-md">
                <Link to="/login" className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back to Login
                </Link>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Reset Password</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                    enter your email address and we'll send you a link to reset your password.
                </p>

                {!emailSent ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full justify-center" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Reset Link"} <ArrowRight size={20} />
                        </Button>
                    </form>
                ) : (
                    <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-green-800 dark:text-green-300 font-medium mb-3">Email Sent!</p>
                        <p className="text-sm text-green-700 dark:text-green-400">
                            Check your inbox for the password reset link. If you don't see it, check your spam folder.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-6 w-full justify-center"
                            onClick={() => setEmailSent(false)}
                        >
                            Resend Email
                        </Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ForgotPassword;

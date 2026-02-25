import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { useTransactions } from "../context/TransactionContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase.config";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 2FA State
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState(null);
    const [tempMobile, setTempMobile] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.type === 'email' ? 'email' : 'password']: e.target.value });
    };

    const handleInputChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    }

    const { login } = useTransactions();

    const onCaptchVerify = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'login-recaptcha', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved
                }
            });
        }
    }

    const sendOtp = (mobile) => {
        onCaptchVerify();
        const appVerifier = window.recaptchaVerifier;
        const formatPh = "+" + mobile.replace(/\D/g, '');

        signInWithPhoneNumber(auth, formatPh, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                toast.success(`OTP sent to ${mobile}`);
            }).catch((error) => {
                console.error(error);
                toast.error("Failed to send OTP");
                setIsLoading(false);
            });
    }

    const verifyOtp = () => {
        setIsLoading(true);
        window.confirmationResult.confirm(otp).then(async (res) => {
            // OTP Verified. Now get real token from backend.
            try {
                // In a real app, we would send the firebase token to backend.
                // For this hackathon, we trust the frontend verification and ask backend to issue token.
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login/verify-2fa`, {
                    userId: userId,
                    firebaseToken: res._tokenResponse.idToken // Sending it just in case backend wants to verify
                });

                handleLoginSuccess(response.data);
            } catch (err) {
                console.error(err);
                toast.error("2FA Verification Failed on Server");
                setIsLoading(false);
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Invalid OTP");
            setIsLoading(false);
        })
    }

    const handleLoginSuccess = (data) => {
        if (data.token && data.user) {
            const userData = data.user;
            if (userData.profilePhoto && !userData.profilePhoto.startsWith('http')) {
                userData.avatar = `${import.meta.env.VITE_API_URL.replace('/api', '')}/${userData.profilePhoto}`;
            } else {
                userData.avatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }

            login(userData, data.token);
            toast.success("Login successful!");
            navigate("/dashboard");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (showOtpInput) {
            verifyOtp();
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);

            if (response.data.require2FA) {
                setUserId(response.data.userId);
                setTempMobile(response.data.mobile);
                setShowOtpInput(true);
                toast.info("2FA Required. Sending OTP...");

                // Trigger OTP send
                if (response.data.mobile) {
                    sendOtp(response.data.mobile);
                } else {
                    toast.error("No mobile number registered for 2FA");
                    setIsLoading(false);
                }
            } else {
                handleLoginSuccess(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Login failed");
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div id="login-recaptcha"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Sign in to access your digital wallet</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!showOtpInput ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                    required
                                    onChange={handleInputChange('email')}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                    required
                                    onChange={handleInputChange('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP sent to {tempMobile?.replace(/.(?=.{4})/g, '*')}</label>
                        <input
                            type="text"
                            placeholder="Type OTP here"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-gray-600 dark:text-gray-300">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">Forgot Password?</Link>
                </div>

                <Button type="submit" className="w-full justify-center" disabled={isLoading}>
                    {isLoading ? (showOtpInput ? "Verifying..." : "Signing In...") : (showOtpInput ? "Verify OTP" : "Sign In")} <ArrowRight size={20} />
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account? <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Create Account</Link>
            </div>
        </motion.div>
    );
};

export default Login;

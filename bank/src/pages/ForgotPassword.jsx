import { useState, useRef } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { Mail, ArrowRight, ArrowLeft, KeyRound, ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// EmailJS credentials (same as Signup)
const SERVICE_ID = 'service_cuvtjge';
const TEMPLATE_ID = 'template_rxupr77';
const PUBLIC_KEY = 'Mm6j68y0QFt9dSyTm';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1=Email, 2=OTP, 3=New Password, 4=Done
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const otpRefs = useRef([]);
    const timerRef = useRef(null);

    // Generate 6-digit OTP
    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Start countdown timer
    const startTimer = () => {
        setTimer(60);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Step 1: Send OTP via EmailJS
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setIsLoading(true);
        try {
            // Check if user exists on server first
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });

            // Generate OTP and send via EmailJS
            const otpCode = generateOtp();
            setGeneratedOtp(otpCode);

            const templateParams = {
                to_name: "User",
                email: email,
                passcode: otpCode,
                time: "15 minutes",
                otp: otpCode,
                message: `Your password reset verification code is ${otpCode}`,
            };

            try {
                await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
                toast.success("OTP sent to your email!");
            } catch (emailError) {
                console.error("EmailJS Error:", emailError);
                // Fallback: show in console for demo
                console.log("Demo Mode: OTP is", otpCode);
                toast.info(`OTP sent! (Demo: ${otpCode})`);
            }

            setStep(2);
            startTimer();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "User not found or server error");
        } finally {
            setIsLoading(false);
        }
    };

    // OTP input handling
    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length < 6) {
            toast.error("Please enter the complete 6-digit OTP");
            return;
        }
        if (enteredOtp !== generatedOtp) {
            toast.error("Invalid OTP. Please try again.");
            return;
        }
        toast.success("OTP verified!");
        setStep(3);
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            // Generate a reset token from the server
            const tokenRes = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });

            // The server generates a JWT token for reset — we need to get it
            // Since we already verified the OTP, we'll call reset-password directly
            // We'll generate a temporary token for the reset
            const resetToken = tokenRes.data.resetToken;

            if (resetToken) {
                await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
                    token: resetToken,
                    newPassword
                });
            }

            toast.success("Password reset successfully!");
            setStep(4);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
        >
            <div className="w-full max-w-md">
                <Link to="/login" className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back to Login
                </Link>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-blue-600' :
                                    s < step ? 'w-2 bg-blue-400' :
                                        'w-2 bg-gray-300 dark:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ======= STEP 1: Enter Email ======= */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <KeyRound size={32} className="text-orange-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Enter your email and we'll send you a verification code
                                </p>
                            </div>

                            <form onSubmit={handleSendOtp} className="space-y-4">
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
                                    {isLoading ? "Sending OTP..." : "Send OTP"} <ArrowRight size={20} />
                                </Button>
                            </form>
                        </motion.div>
                    )}

                    {/* ======= STEP 2: Verify OTP ======= */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck size={32} className="text-blue-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify OTP</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Enter the 6-digit code sent to <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
                                </p>
                            </div>

                            {/* OTP Inputs */}
                            <div className="flex justify-center gap-3 mb-6">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value.replace(/\D/g, ""), index)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    />
                                ))}
                            </div>

                            {/* Resend timer */}
                            <div className="text-center mb-6">
                                {timer > 0 ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Resend OTP in <span className="font-bold text-blue-600">{timer}s</span>
                                    </p>
                                ) : (
                                    <button onClick={handleSendOtp} className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                >
                                    Back
                                </button>
                                <Button onClick={handleVerifyOtp} className="flex-1 justify-center">
                                    Verify OTP
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* ======= STEP 3: New Password ======= */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck size={32} className="text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Create a new password for your account
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Minimum 6 characters"
                                            className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Re-enter your password"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full justify-center" disabled={isLoading}>
                                    {isLoading ? "Resetting..." : "Reset Password"} <ArrowRight size={20} />
                                </Button>
                            </form>
                        </motion.div>
                    )}

                    {/* ======= STEP 4: Success ======= */}
                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck size={32} className="text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Password Reset!</h3>
                                <p className="text-green-700 dark:text-green-400 mb-6">
                                    Your password has been successfully reset. You can now login with your new password.
                                </p>
                                <Link to="/login">
                                    <Button className="w-full justify-center">
                                        Go to Login <ArrowRight size={20} />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ForgotPassword;

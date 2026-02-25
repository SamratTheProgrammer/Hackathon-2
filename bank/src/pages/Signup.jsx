import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import { User, Mail, Phone, Lock, Eye, EyeOff, Calendar, Upload, Image as ImageIcon, X, CheckCircle, Gift } from "lucide-react";
import { motion } from "framer-motion";

import { useTransactions } from "../context/TransactionContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';

const Signup = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // OTP State
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        dob: '',
        password: '',
        confirmPassword: '',
        referralCode: searchParams.get('referralCode') || ''
    });

    const [files, setFiles] = useState({
        kycDocument: null,
        profilePhoto: null
    });

    const [previews, setPreviews] = useState({
        kycDocument: null,
        profilePhoto: null
    });

    const handleChange = (e) => {
        const { type, value, placeholder } = e.target;
        const fieldName = type === 'date' ? 'dob' : type === 'tel' ? 'mobile' : type === 'email' ? 'email' : type === 'text' && placeholder === 'John Doe' ? 'name' : type === 'password' && placeholder === '••••••••' ? 'password' : 'confirmPassword';
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    }

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [field]: file }));
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = (field) => {
        setFiles(prev => ({ ...prev, [field]: null }));
        setPreviews(prev => ({ ...prev, [field]: null }));
    };

    const sendEmailOtp = () => {
        if (!formData.email) {
            toast.error("Please enter your email address first");
            return;
        }

        setSendingOtp(true);
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);

        const templateParams = {
            // Recipient
            to_name: formData.name || "User",
            email: formData.email, // THIS IS THE KEY: Template uses {{email}} for "To Email"

            // Template Content Variables
            passcode: newOtp,      // Template uses {{passcode}}
            time: "15 minutes",    // Template uses {{time}}

            // Redundant/Fallback
            otp: newOtp,
            message: `Your verification code is ${newOtp}`
        };

        // Try to send via EmailJS
        emailjs.send('service_cuvtjge', 'template_rxupr77', templateParams, 'Mm6j68y0QFt9dSyTm')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setSendingOtp(false);
                setShowOtpInput(true);
                toast.success("OTP sent to your email!");
            }, (err) => {
                console.error('FAILED...', err);

                // FALLBACK: Mock Mode for Demo/Hackathon if keys are invalid
                console.log("Mock Mode: OTP is " + newOtp);
                setSendingOtp(false);
                setShowOtpInput(true);
                toast.warning("Demo Mode: OTP sent to console (Check F12)");
                // toast.success("OTP sent to your email! (Mock)"); 
            });
    };

    const verifyEmailOtp = () => {
        if (otp === generatedOtp) {
            setIsVerified(true);
            setShowOtpInput(false);
            toast.success("Email verified successfully!");
        } else {
            toast.error("Invalid OTP");
        }
    };

    const { login } = useTransactions();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isVerified) {
            toast.error("Please verify your email address first!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (!acceptedTerms) {
            toast.error("Please accept the Terms & Conditions");
            return;
        }

        if (!files.kycDocument) {
            toast.error("Please upload a KYC Document (Aadhaar/PAN)");
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('mobile', formData.mobile);
        data.append('dob', formData.dob);
        data.append('password', formData.password);
        if (formData.referralCode) data.append('referralCode', formData.referralCode);
        if (files.kycDocument) data.append('kycDocument', files.kycDocument);
        if (files.profilePhoto) data.append('profilePhoto', files.profilePhoto);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Login user immediately
            if (response.data.token && response.data.user) {
                // Ensure avatar URL is correct if relative
                const userData = response.data.user;
                if (userData.profilePhoto && !userData.profilePhoto.startsWith('http')) {
                    userData.avatar = `${import.meta.env.VITE_API_URL.replace('/api', '')}/${userData.profilePhoto}`;
                } else {
                    userData.avatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }

                login(userData, response.data.token);
                toast.success("Account created successfully!");
                navigate("/dashboard");
            } else {
                toast.success("Account created successfully! Please login.");
                navigate("/login");
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Join DigitalDhan today</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                            required
                            onChange={handleInputChange('name')}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <div className="relative flex gap-2">
                        <div className="relative w-full">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                required
                                onChange={handleInputChange('email')}
                                disabled={isVerified}
                            />
                        </div>
                        {!isVerified && (
                            <Button
                                type="button"
                                onClick={sendEmailOtp}
                                disabled={sendingOtp || !formData.email}
                                className="whitespace-nowrap px-3 text-xs"
                            >
                                {sendingOtp ? "Sending..." : "Verify"}
                            </Button>
                        )}
                        {isVerified && (
                            <div className="flex items-center text-green-500">
                                <CheckCircle size={24} />
                            </div>
                        )}
                    </div>
                    {showOtpInput && (
                        <div className="mt-2 flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Email OTP"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <Button type="button" onClick={verifyEmailOtp} disabled={!otp}>
                                Confirm
                            </Button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referral Code (Optional)</label>
                    <div className="relative">
                        <Gift className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="e.g. JOHN1234"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 uppercase"
                            onChange={handleInputChange('referralCode')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                required
                                onChange={handleInputChange('dob')}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                required
                                onChange={handleInputChange('mobile')}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                required
                                onChange={handleInputChange('confirmPassword')}
                            />
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                    <div className="relative h-32">
                        {previews.kycDocument ? (
                            <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                <img src={previews.kycDocument} alt="KYC Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeFile('kycDocument')}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                >
                                    <X size={14} />
                                </button>
                                <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate text-center">
                                    {files.kycDocument.name}
                                </p>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition h-full text-center">
                                <Upload className="text-gray-400 mb-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">KYC Document</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Aadhaar/PAN</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'kycDocument')} />
                            </label>
                        )}
                    </div>

                    <div className="relative h-32">
                        {previews.profilePhoto ? (
                            <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                <img src={previews.profilePhoto} alt="Profile Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeFile('profilePhoto')}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                >
                                    <X size={14} />
                                </button>
                                <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate text-center">
                                    {files.profilePhoto.name}
                                </p>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition h-full text-center">
                                <ImageIcon className="text-gray-400 mb-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">User Photo</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Profile Picture</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePhoto')} />
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex items-start gap-2 text-sm mt-2">
                    <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        required
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <span className="text-gray-600 dark:text-gray-300">I accept the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms & Conditions</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.</span>
                </div>

                <Button type="submit" className="w-full justify-center mt-6" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Free Account"}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Sign In</Link>
            </div>
        </motion.div>
    );
};

export default Signup;

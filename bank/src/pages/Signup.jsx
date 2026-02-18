import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { User, Mail, Phone, Lock, Eye, EyeOff, Calendar, Upload, Image as ImageIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import axios from 'axios';
import { useTransactions } from "../context/TransactionContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

<<<<<<< HEAD
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        dob: '',
        password: '',
        confirmPassword: ''
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
        setFormData({ ...formData, [e.target.type === 'date' ? 'dob' : e.target.type === 'tel' ? 'mobile' : e.target.type === 'email' ? 'email' : e.target.type === 'text' && e.target.placeholder === 'John Doe' ? 'name' : e.target.type === 'password' && e.target.placeholder === '••••••••' ? 'password' : 'confirmPassword']: e.target.value });
    };

    const handleInputChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    }

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFiles({ ...files, [field]: file });
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

    const { login } = useTransactions();

=======
>>>>>>> ebddbb95e466853adb500ba885daa72f1a5d8e95
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (!acceptedTerms) {
            toast.error("Please accept the Terms & Conditions");
            return;
        }

        setIsLoading(true);

<<<<<<< HEAD
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('mobile', formData.mobile);
        data.append('dob', formData.dob);
        data.append('password', formData.password);
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
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);
            } else {
                toast.success("Account created successfully! Please login.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Signup failed");
=======
        const formData = new FormData();
        formData.append("name", e.target[0].value);
        formData.append("email", e.target[1].value);
        formData.append("dob", e.target[2].value);
        formData.append("mobile", e.target[3].value);
        formData.append("password", e.target[4].value);
        // idProof file is at index 6 (based on currrent form layout, need to be careful with indexing or use refs/state)
        // Better to use state for inputs or get by name if possible, but form doesn't have names on inputs.
        // Let's assume the file input is the one with type="file" inside the label.
        const fileInput = e.target.querySelector('input[type="file"]');
        if (fileInput && fileInput.files[0]) {
            formData.append("idProof", fileInput.files[0]);
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data);
            navigate("/dashboard");
        } catch (error) {
            console.error("Signup failed", error);
            alert(error.response?.data?.message || "Signup failed");
>>>>>>> ebddbb95e466853adb500ba885daa72f1a5d8e95
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
            <ToastContainer />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Join DigitalDhan today</p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'kycDocument')} required />
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

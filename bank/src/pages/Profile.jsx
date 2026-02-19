import { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { User, Mail, Phone, FileText, Camera, Save, Loader2, Share2 } from "lucide-react";
import { useTransactions } from "../context/TransactionContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Profile = () => {
    const { user, updateUser } = useTransactions();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        bio: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                mobile: user.mobile || user.phone || '',
                bio: user.bio || '',
            });
            setPreviewUrl(user.avatar || null);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        if (selectedFile) {
            data.append('profilePhoto', selectedFile);
        }

        const success = await updateUser(data);
        setIsSubmitting(false);

        if (success) {
            setSelectedFile(null);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>

            <div className="relative w-32 h-32 mx-auto group">
                <img
                    src={previewUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="Profile"
                    className="w-full h-full rounded-full ring-4 ring-white dark:ring-gray-800 shadow-lg object-cover"
                />
                <button
                    type="button"
                    onClick={handlePhotoClick}
                    className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                    <Camera size={28} className="text-white" />
                </button>
                <button
                    type="button"
                    onClick={handlePhotoClick}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                    <Camera size={20} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            {selectedFile && (
                <p className="text-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                    New photo selected — click Save to apply
                </p>
            )}

            {/* Referral Code Section */}
            <Card className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold mb-1">Invite & Earn</h3>
                        <p className="text-blue-100 text-sm">Share your code and earn ₹50 for every friend who joins!</p>
                    </div>
                </div>
                <div className="mt-4 bg-white/20 backdrop-blur-md rounded-xl p-3 flex items-center justify-between border border-white/20 relative z-10">
                    <div className="flex flex-col">
                        <span className="text-xs text-blue-100">Your Referral Code</span>
                        <span className="font-mono text-xl font-bold tracking-wider">{user?.referralCode || 'Generate...'}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                if (user?.referralCode) {
                                    navigator.clipboard.writeText(user.referralCode);
                                    toast.success("Code copied!");
                                }
                            }}
                            className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium text-sm border border-white/10"
                        >
                            Copy Code
                        </button>
                        <button
                            onClick={async () => {
                                if (user?.referralCode) {
                                    const shareUrl = `${window.location.origin}/signup?referralCode=${user.referralCode}`;
                                    const shareData = {
                                        title: 'Join DigitalDhan!',
                                        text: `Use my referral code ${user.referralCode} to join DigitalDhan and earn ₹20!`,
                                        url: shareUrl
                                    };

                                    if (navigator.share) {
                                        try {
                                            await navigator.share(shareData);
                                        } catch (err) {
                                            console.error("Share failed:", err);
                                        }
                                    } else {
                                        navigator.clipboard.writeText(shareUrl);
                                        toast.success("Link copied to clipboard!");
                                    }
                                }
                            }}
                            className="p-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold text-sm flex items-center gap-2"
                        >
                            <Share2 size={16} /> Share Link
                        </button>
                    </div>
                </div>
            </Card>

            <Card className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile || ''}
                                disabled
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-4 text-gray-400" size={20} />
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="3"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-gray-900 dark:text-white"
                            ></textarea>
                        </div>
                    </div>

                    <Button type="submit" className="w-full justify-center text-lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><Loader2 size={20} className="animate-spin" /> Saving...</>
                        ) : (
                            <><Save size={20} /> Save Changes</>
                        )}
                    </Button>
                </form>
            </Card>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 50, x: "-50%" }}
                        className="fixed bottom-8 left-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50"
                    >
                        <Save size={20} className="text-green-400" />
                        <span className="font-medium">Profile updated successfully!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;

import { useState, useEffect } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { User, Mail, Phone, FileText, Camera, Save } from "lucide-react";
import { useTransactions } from "../context/TransactionContext";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
    const { user, updateUser } = useTransactions();
    const [formData, setFormData] = useState(user || {
        name: '',
        email: '',
        mobile: '',
        bio: '',
        avatar: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                ...user,
                // Ensure mobile maps if needed, though user should have mobile from DB
                mobile: user.mobile || user.phone || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser(formData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>

            <div className="relative w-32 h-32 mx-auto">
                <img
                    src={formData.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-full ring-4 ring-white shadow-lg object-cover"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                    <Camera size={20} />
                </button>
            </div>

            <Card className="p-8">
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

                    <Button type="submit" className="w-full justify-center text-lg">
                        <Save size={20} /> Save Changes
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

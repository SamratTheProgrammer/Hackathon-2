import { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '../context/TransactionContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { token } = useTransactions();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [token]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await handleMarkAsRead(notification.id, { stopPropagation: () => { } });
        }
        setIsOpen(false);

        // Navigate based on type
        if (notification.type === 'transaction') {
            navigate('/transactions');
        } else if (notification.type === 'reward') {
            navigate('/rewards');
        } else if (notification.type === 'security') {
            navigate('/security');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{unreadCount} unread</span>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    No notifications yet
                                </div>
                            ) : (
                                <ul>
                                    {notifications.map((notification) => (
                                        <li
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors relative group ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div>
                                                    <p className={`text-sm font-medium mb-1 ${!notification.isRead ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-2">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                {!notification.isRead && (
                                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Notifications;

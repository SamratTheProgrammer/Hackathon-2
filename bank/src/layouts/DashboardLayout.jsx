import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wallet, Send, History, Gift, Shield, Menu, X, LogOut, CreditCard, Moon, Sun, Laptop } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { user } = useTransactions();
    const { theme, setTheme } = useTheme();

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: Wallet, label: "Add Money", path: "/add-money" },
        { icon: Send, label: "Send Money", path: "/send-money" },
        { icon: History, label: "Transactions", path: "/transactions" },
        { icon: Gift, label: "Rewards", path: "/rewards" },
        { icon: Shield, label: "Security", path: "/security" },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* Sidebar for Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed h-full z-20 transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <Link to="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                        DigitalDhan
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                                location.pathname === item.path
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    {/* Theme Toggle */}
                    {/* Theme Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
                        {['light', 'dark'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={cn(
                                    "flex-1 flex items-center justify-center py-2 rounded-lg transition-all",
                                    theme === t
                                        ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                )}
                                title={t.charAt(0).toUpperCase() + t.slice(1) + " Mode"}
                            >
                                {t === 'light' && <Sun size={18} />}
                                {t === 'dark' && <Moon size={18} />}
                            </button>
                        ))}
                    </div>

                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 mb-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors group">
                        <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-blue-200" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">View Profile</p>
                        </div>
                    </Link>
                    <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
                        <LogOut size={20} />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 relative min-w-0 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center sticky top-0 z-30 transition-colors duration-300">
                    <Link to="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                        DigitalDhan
                    </Link>
                    <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                onClick={toggleSidebar}
                                className="fixed inset-0 bg-black z-40 lg:hidden"
                            />
                            <motion.aside
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 z-50 flex flex-col lg:hidden shadow-2xl transition-colors duration-300"
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">Menu</span>
                                    <button onClick={toggleSidebar}><X size={24} className="text-gray-500 dark:text-gray-400" /></button>
                                </div>
                                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                                                location.pathname === item.path
                                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                            )}
                                        >
                                            <item.icon size={20} />
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                                    <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
                                        <LogOut size={20} />
                                        Logout
                                    </Link>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, Send, History, Gift, Shield, Menu, X, LogOut, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";
import Notifications from "../components/Notifications";

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useTransactions();
    const { theme, setTheme } = useTheme();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: Wallet, label: "Add Money", path: "/add-money" },
        { icon: Send, label: "Send Money", path: "/send-money" },
        { icon: History, label: "Transactions", path: "/transactions" },
        { icon: Gift, label: "Rewards", path: "/rewards" },
        { icon: Shield, label: "Security", path: "/security" },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const sidebarWidth = isCollapsed ? "w-20" : "w-64";
    const mainMargin = isCollapsed ? "lg:ml-20" : "lg:ml-64";

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* Sidebar for Desktop */}
            <aside className={cn("hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed h-full z-20 transition-all duration-300", sidebarWidth)}>
                <div className={cn("p-6 border-b border-gray-100 dark:border-gray-800 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && (
                        <Link to="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                            DigitalDhan
                        </Link>
                    )}
                    <button
                        onClick={toggleCollapse}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={item.label}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                                isCollapsed && "justify-center px-2",
                                location.pathname === item.path
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            <item.icon size={20} />
                            {!isCollapsed && item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    {/* Theme Toggle */}
                    <div className={cn("flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4", isCollapsed && "flex-col")}>
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

                    <Link to="/profile" className={cn("flex items-center gap-3 px-4 py-3 mb-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors group", isCollapsed && "justify-center px-2")}>
                        <img src={user?.avatar} alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-blue-200 shrink-0" />
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">View Profile</p>
                            </div>
                        )}
                    </Link>
                    <button onClick={handleLogout} className={cn("flex items-center w-full gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium", isCollapsed && "justify-center px-2")}>
                        <LogOut size={20} />
                        {!isCollapsed && "Logout"}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn("flex-1 relative min-w-0 bg-white dark:bg-gray-900 min-h-screen transition-all duration-300", mainMargin)}>
                {/* Mobile Header */}
                <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center sticky top-0 z-30 transition-colors duration-300">
                    <Link to="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                        DigitalDhan
                    </Link>
                    <div className="flex items-center gap-2">
                        <Notifications />
                        <Link to="/profile">
                            <img src={user?.avatar} alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-gray-100 dark:ring-gray-700" />
                        </Link>
                        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors">
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
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
                                className="fixed top-0 left-0 w-72 h-full bg-white dark:bg-gray-900 z-50 flex flex-col lg:hidden shadow-2xl transition-colors duration-300"
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">Menu</span>
                                    <button onClick={toggleSidebar}><X size={24} className="text-gray-500 dark:text-gray-400" /></button>
                                </div>

                                {/* Mobile user info */}
                                <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-4 mx-4 mt-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <img src={user?.avatar} alt="Profile" className="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-700" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
                                    </div>
                                </Link>

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
                                    {/* Theme toggle in mobile */}
                                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
                                        {['light', 'dark'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTheme(t)}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm",
                                                    theme === t
                                                        ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
                                                        : "text-gray-500 dark:text-gray-400"
                                                )}
                                            >
                                                {t === 'light' && <Sun size={16} />}
                                                {t === 'dark' && <Moon size={16} />}
                                                {t.charAt(0).toUpperCase() + t.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium">
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Desktop Top Bar */}
                <div className="hidden lg:flex items-center justify-end p-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <Notifications />
                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800"></div>
                        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                            <img src={user?.avatar} alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-gray-100 dark:ring-gray-700" />
                            <span className="font-bold text-gray-900 dark:text-white capitalize">{user?.name}</span>
                        </Link>
                    </div>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

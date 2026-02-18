import { useState, useEffect } from "react";
import Button from "../components/Button";
import { Menu, X, Sun, Moon, Laptop } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useTransactions } from "../context/TransactionContext";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { user } = useTransactions();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Security", href: "#security" },
        { name: "Rewards", href: "#rewards" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <a href="#" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                    DigitalDhan
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}

                    {/* Theme Toggle */}
                    {/* Theme Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                        {['light', 'dark'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`p-1.5 rounded-full transition-all ${theme === t
                                    ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                    }`}
                                title={t.charAt(0).toUpperCase() + t.slice(1) + " Mode"}
                            >
                                {t === 'light' && <Sun size={14} />}
                                {t === 'dark' && <Moon size={14} />}
                            </button>
                        ))}
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                        {user.name?.charAt(0)}
                                    </div>
                                )}
                            </Link>
                        </div>
                    ) : (
                        <Link to="/login">
                            <Button variant="primary" size="sm">
                                Get Started
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-600 dark:text-gray-300"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-600 dark:text-gray-300 font-medium py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            {/* Mobile Theme Toggle */}
                            {/* Mobile Theme Toggle */}
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600 dark:text-gray-300 font-medium">Theme</span>
                                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                                    {['light', 'dark'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTheme(t)}
                                            className={`p-2 rounded-full transition-all ${theme === t
                                                ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
                                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                                }`}
                                        >
                                            {t === 'light' && <Sun size={16} />}
                                            {t === 'dark' && <Moon size={16} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {user ? (
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="flex items-center gap-3 py-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                                {user.name?.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;

import SectionWrapper from "../components/SectionWrapper";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { ArrowUpRight, ArrowDownLeft, Wallet, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPreview = () => {
    return (
        <SectionWrapper className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative">
                    {/* Abstract Background Blurs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 dark:bg-blue-500 rounded-full blur-[128px] opacity-20"></div>

                    {/* Dashboard Card */}
                    <motion.div
                        initial={{ rotateY: -20, opacity: 0 }}
                        whileInView={{ rotateY: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/20 rounded-3xl p-6 md:p-8 max-w-md mx-auto shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-green-400"></div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">Welcome back,</p>
                                    <p className="font-bold">Rahul Sharma</p>
                                </div>
                            </div>
                            <Bell className="text-gray-500 dark:text-gray-300" />
                        </div>

                        {/* Balance Card */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 mb-8 shadow-lg">
                            <p className="text-blue-100 mb-1">Total Balance</p>
                            <h3 className="text-3xl font-bold mb-6">₹ 2,45,000.50</h3>
                            <div className="flex gap-4">
                                <button className="flex-1 bg-white/20 hover:bg-white/30 transition py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                                    <ArrowUpRight size={16} /> Add
                                </button>
                                <button className="flex-1 bg-white/20 hover:bg-white/30 transition py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                                    <ArrowDownLeft size={16} /> Send
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold">Recent Activity</h4>
                                <span className="text-xs text-blue-600 dark:text-blue-300 cursor-pointer">View All</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                            <Wallet size={16} className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Spotify Premium</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Today, 10:30 AM</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">- ₹119</span>
                                </div>
                                <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                            <ArrowDownLeft size={16} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Received from Amit</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 5:45 PM</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">+ ₹5,000</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="order-1 lg:order-2 text-center lg:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Experience the Future of Mobile Banking</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                        Our intuitive dashboard gives you complete control over your finances.
                        Track expenses, manage investments, and handle payments with a beautiful,
                        glassmorphism-inspired interface designed for clarity and speed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
                        <Link to="/dashboard" className="w-full sm:w-auto">
                            <Button variant="primary" className="w-full">View Live Demo</Button>
                        </Link>
                        <Button variant="outline" className="w-full sm:w-auto">Learn More</Button>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default DashboardPreview;

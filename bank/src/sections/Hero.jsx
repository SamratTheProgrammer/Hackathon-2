import Button from "../components/Button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../context/TransactionContext";

const Hero = () => {
    const { user } = useTransactions();
    const navigate = useNavigate();

    return (
        <section className="relative pt-32 pb-20 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-900 -z-20" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/50 to-transparent dark:from-blue-900/20 -z-10 blur-3xl opacity-60" />

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        #1 Trusted Fintech App
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
                        Secure. Smart. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                            Seamless Banking.
                        </span>
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
                        Manage your money, send payments, earn rewards, and experience next-gen digital banking — all in one secure app.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        {user ? (
                            <Button
                                size="lg"
                                className="shadow-xl shadow-blue-500/20"
                                onClick={() => navigate('/dashboard')}
                            >
                                Go to Dashboard <ArrowRight className="ml-2" size={20} />
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                className="shadow-xl shadow-blue-500/20"
                                onClick={() => navigate('/signup')}
                            >
                                Create Free Account <ArrowRight className="ml-2" size={20} />
                            </Button>
                        )}
                        <Button variant="outline" size="lg">
                            Watch Demo
                        </Button>
                    </div>

                    <div className="flex items-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>No Hidden Fees</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Instant Transfer</span>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Image Mockup */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative z-10 mx-auto w-72 md:w-80 bg-gray-900 dark:bg-black rounded-[3rem] p-4 shadow-2xl border-8 border-gray-900 dark:border-gray-800">
                        <div className="bg-white rounded-[2rem] overflow-hidden h-[550px] md:h-[600px] w-full relative">
                            {/* Fake App Header */}
                            <div className="bg-blue-600 p-6 pt-10 text-white pb-20 rounded-b-[3rem]">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                </div>
                                <p className="text-sm opacity-80">Total Balance</p>
                                <h3 className="text-3xl font-bold">₹ 1,24,500</h3>
                            </div>

                            {/* Check floating card */}
                            <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[85%] bg-white rounded-xl shadow-lg p-4 flex gap-4 justify-between items-center">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        Top
                                    </div>
                                    <span className="text-xs font-medium">Add</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        Send
                                    </div>
                                    <span className="text-xs font-medium">Pay</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        Scan
                                    </div>
                                    <span className="text-xs font-medium">Scan</span>
                                </div>
                            </div>

                            {/* Transactions List */}
                            <div className="mt-20 px-6 space-y-4">
                                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold">N</div>
                                        <div>
                                            <p className="font-semibold text-sm">Netflix</p>
                                            <p className="text-xs text-gray-400">Subscription</p>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-red-500">- ₹499</span>
                                </div>
                                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 font-bold">S</div>
                                        <div>
                                            <p className="font-semibold text-sm">Salary</p>
                                            <p className="text-xs text-gray-400">Credit</p>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-green-500">+ ₹85,000</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Decor Elements */}
                    <div className="absolute top-20 -right-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="absolute bottom-20 -left-10 w-24 h-24 bg-blue-400 rounded-full blur-xl opacity-50 animate-bounce"></div>
                    <div className="absolute top-1/2 left-0 md:-translate-x-12 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 animate-bounce shadow-blue-500/20 z-20">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            ₹
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Cashback</p>
                            <p className="font-bold text-gray-900">₹ 50.00</p>
                        </div>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

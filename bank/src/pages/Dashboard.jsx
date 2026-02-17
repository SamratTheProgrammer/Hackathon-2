import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { ArrowUpRight, ArrowDownLeft, Wallet, Bell, TrendingUp, TrendingDown, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { useTransactions } from "../context/TransactionContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { balance, transactions, user } = useTransactions();
    const recentTransactions = transactions.slice(0, 3);
    return (
        <div className="space-y-8">
            {/* Welcome & Balance Section */}
            <div className="gap-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                            <p className="text-gray-500 dark:text-gray-400">Welcome back, {user.name}!</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                <Bell size={24} className="text-gray-600" />
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <Link to="/profile">
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full ring-2 ring-gray-100 dark:ring-gray-700 hover:ring-blue-500 transition-all cursor-pointer"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Main Balance Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <p className="text-blue-100 mb-2">Total Balance</p>
                            <h2 className="text-4xl font-bold mb-8">{balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</h2>

                            <div className="flex gap-4">
                                <Link to="/add-money" className="flex-1">
                                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none w-full">
                                        <ArrowUpRight size={20} /> Add Money
                                    </Button>
                                </Link>
                                <Link to="/send-money" className="flex-1">
                                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none w-full">
                                        <ArrowDownLeft size={20} /> Send Money
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Card className="p-4 flex items-center gap-4 dark:bg-gray-800">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400"><TrendingUp size={24} /></div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Income</p>
                                <p className="font-bold text-lg dark:text-white">₹ 85,000</p>
                            </div>
                        </Card>
                        <Card className="p-4 flex items-center gap-4 dark:bg-gray-800">
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400"><TrendingDown size={24} /></div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Expense</p>
                                <p className="font-bold text-lg dark:text-white">₹ 32,450</p>
                            </div>
                        </Card>
                        <Card className="p-4 flex items-center gap-4 dark:bg-gray-800">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400"><Gift size={24} /></div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Rewards</p>
                                <p className="font-bold text-lg dark:text-white">1,250 pts</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                    <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">View All</button>
                </div>

                <div className="space-y-4">
                    {recentTransactions.map((tx) => (
                        <Card key={tx.id} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer dark:bg-gray-800">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{tx.to}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {tx.type === 'credit' ? '+' : '-'} {Math.abs(tx.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{tx.status}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

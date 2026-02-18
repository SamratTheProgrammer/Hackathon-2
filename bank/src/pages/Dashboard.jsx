import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, TrendingDown, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { useTransactions } from "../context/TransactionContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { balance, transactions, user } = useTransactions();
    const recentTransactions = transactions.slice(0, 3);

    const income = transactions
        .filter(t => t.type === 'credit' && t.status === 'Success')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const expense = transactions
        .filter(t => t.type === 'debit' && t.status === 'Success')
        .reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0);

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Welcome & Balance Section */}
            <div className="gap-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                            <p className="text-gray-500 dark:text-gray-400">Welcome back, {user.name}!</p>
                            <p className="text-sm font-mono text-gray-500 dark:text-gray-500">Ac No: {user.accountNumber || 'N/A'}</p>
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
                                <p className="font-bold text-lg dark:text-white">{income.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                            </div>
                        </Card>
                        <Card className="p-4 flex items-center gap-4 dark:bg-gray-800">
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400"><TrendingDown size={24} /></div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Expense</p>
                                <p className="font-bold text-lg dark:text-white">{expense.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                            </div>
                        </Card>
                        <Card className="p-4 flex items-center gap-4 dark:bg-gray-800">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400"><Gift size={24} /></div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Rewards</p>
                                <p className="font-bold text-lg dark:text-white">{user.points || 0} pts</p>
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
                                <div className="flex flex-col items-end">
                                    <p className={`text-xs font-semibold ${tx.status === 'Success' ? 'text-green-500' :
                                        tx.status === 'Pending' ? 'text-yellow-500' :
                                            'text-red-500'
                                        }`}>
                                        {tx.status}
                                    </p>
                                    {tx.status === 'Failed' && tx.rejectionReason && (
                                        <p className="text-xs text-red-400 max-w-[150px] truncate" title={tx.rejectionReason}>
                                            {tx.rejectionReason}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

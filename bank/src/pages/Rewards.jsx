import Card from "../components/Card";
import Button from "../components/Button";
import { Gift, Award, TrendingUp, Loader2 } from "lucide-react";
import { useTransactions } from "../context/TransactionContext";
import { useEffect, useState } from "react";
import axios from 'axios';

const Rewards = () => {
    const { user, transactions: allTransactions, token } = useTransactions();
    const [cashbackHistory, setCashbackHistory] = useState([]);
    const [stats, setStats] = useState({ totalCashback: 0 });

    useEffect(() => {
        if (allTransactions) {
            const cashbackTx = allTransactions.filter(tx =>
                tx.type === 'credit' &&
                tx.to === 'Cashback Reward' // Or however we identify callback transactions
                // Actually in fetchTransactions we mapped 'to' field. 
                // In backend create: to: 'Cashback Reward'
            );

            // If the standard fetchTransactions doesn't cover "Cashback Reward" naming perfectly or if we need more specifics,
            // we can rely on the fact that we just created them with text 'Cashback Reward'

            const earned = cashbackTx.reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

            setCashbackHistory(cashbackTx);
            setStats({ totalCashback: earned });
        }
    }, [allTransactions]);

    if (!user) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <p className="text-purple-100 mb-2 font-medium">Total Reward Points</p>
                        <h1 className="text-5xl font-bold mb-4">{user.points || 0}</h1>
                        <p className="text-sm opacity-80">Value: ₹{((user.points || 0) / 10).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button className="bg-white text-purple-700 hover:bg-purple-50 border-none">Redeem Now</Button>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Rewards</h2>
                {cashbackHistory.length > 0 ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {cashbackHistory.map((tx, i) => (
                            <Card key={tx.id || i} className="bg-gradient-to-br from-amber-200 to-yellow-400 border-none text-yellow-900 relative overflow-hidden group hover:-translate-y-1">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-20 rounded-full blur-xl"></div>
                                <div className="relative z-10">
                                    <div className="bg-white/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                        <Gift size={24} className="text-yellow-900" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">Cashback</h3>
                                    <p className="text-sm opacity-80 mb-4">Won on {tx.date}</p>
                                    <p className="font-bold text-2xl">₹ {tx.amount}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                        <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No rewards yet. Make transactions to earn points and cashback!</p>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 flex items-center gap-6 dark:bg-gray-800">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Award size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-1 dark:text-white">Referral Bonus</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Earn ₹100 for every friend you invite.</p>
                        <button className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">Invite Friends</button>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-6 dark:bg-gray-800">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-1 dark:text-white">Cashback Earned</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Total cashback earned this month.</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₹ {stats.totalCashback}</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Rewards;

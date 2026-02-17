import Card from "../components/Card";
import Button from "../components/Button";
import { Gift, Award, TrendingUp } from "lucide-react";

const Rewards = () => {
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <p className="text-purple-100 mb-2 font-medium">Total Reward Points</p>
                        <h1 className="text-5xl font-bold mb-4">1,250</h1>
                        <p className="text-sm opacity-80">Value: ₹250.00</p>
                    </div>
                    <div className="flex gap-4">
                        <Button className="bg-white text-purple-700 hover:bg-purple-50 border-none">Redeem Now</Button>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Rewards</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="bg-gradient-to-br from-amber-200 to-yellow-400 border-none text-yellow-900 relative overflow-hidden group hover:-translate-y-1">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-20 rounded-full blur-xl"></div>
                            <div className="relative z-10">
                                <div className="bg-white/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                    <Gift size={24} className="text-yellow-900" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">Scratch Card</h3>
                                <p className="text-sm opacity-80 mb-4">Won on Feb {10 + i}, 2026</p>
                                <p className="font-bold text-2xl">₹ {50 * i}</p>
                            </div>
                        </Card>
                    ))}
                </div>
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
                        <h3 className="text-lg font-bold mb-1 dark:text-white">Cashback</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Total cashback earned this month.</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₹ 850</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Rewards;

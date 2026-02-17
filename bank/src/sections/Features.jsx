import SectionWrapper from "../components/SectionWrapper";
import Card from "../components/Card";
import { ArrowUpRight, Send, History, Download, Gift, Users } from "lucide-react";

const features = [
    {
        icon: <ArrowUpRight className="text-blue-600" size={32} />,
        title: "Add Money",
        description: "Instantly add funds via UPI, Debit Card, or Net Banking with 0% fees.",
    },
    {
        icon: <Send className="text-green-600" size={32} />,
        title: "Send Money",
        description: "Transfer money to any bank account or mobile number in seconds.",
    },
    {
        icon: <History className="text-purple-600" size={32} />,
        title: "Transaction History",
        description: "Track your spending with detailed insights and monthly reports.",
    },
    {
        icon: <Download className="text-orange-600" size={32} />,
        title: "Download Receipts",
        description: "Get instant PDF receipts for all your transactions.",
    },
    {
        icon: <Gift className="text-red-600" size={32} />,
        title: "Rewards & Cashback",
        description: "Earn scratch cards and assured cashback on every transaction.",
    },
    {
        icon: <Users className="text-teal-600" size={32} />,
        title: "Referral Bonus",
        description: "Invite friends and earn ₹100 for each successful referral.",
    },
];

const Features = () => {
    return (
        <SectionWrapper id="features" className="bg-gray-50 dark:bg-gray-900">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Core Banking Features</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Everything you need to manage your finances, all in one place.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="flex flex-col items-start gap-4 hover:border-blue-200 dark:hover:border-blue-500/30 dark:bg-gray-800">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl mb-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {feature.description}
                        </p>
                    </Card>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Features;

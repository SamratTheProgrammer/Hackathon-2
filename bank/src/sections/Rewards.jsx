import SectionWrapper from "../components/SectionWrapper";
import Card from "../components/Card";
import { Gift, Zap, Users, Star } from "lucide-react";

const rewards = [
    {
        icon: <Gift className="text-white" size={32} />,
        title: "Welcome Bonus",
        description: "Get ₹50 instantly when you sign up and link your bank account.",
        gradient: "from-pink-500 to-rose-500",
    },
    {
        icon: <Zap className="text-white" size={32} />,
        title: "Flat ₹100 Cashback",
        description: "On your first electricity bill payment of ₹500 or more.",
        gradient: "from-purple-500 to-indigo-500",
    },
    {
        icon: <Users className="text-white" size={32} />,
        title: "Refer & Earn",
        description: "Earn up to ₹10,000 by inviting your friends to DigitalDhan.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: <Star className="text-white" size={32} />,
        title: "Loyalty Points",
        description: "Earn points on every transaction and redeem them for exciting rewards.",
        gradient: "from-amber-400 to-orange-500",
    },
];

const Rewards = () => {
    return (
        <SectionWrapper id="rewards" className="bg-gray-50 dark:bg-gray-900">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

            <div className="text-center mb-16 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Rewards & Benefits</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    We love rewarding our users. Save more with every transaction.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {rewards.map((reward, index) => (
                    <Card
                        key={index}
                        className={`bg-gradient-to-br ${reward.gradient} text-white border-none transform hover:-translate-y-2`}
                    >
                        <div className="bg-white/20 p-3 rounded-xl w-fit mb-4 backdrop-blur-sm">
                            {reward.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{reward.title}</h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                            {reward.description}
                        </p>
                    </Card>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Rewards;

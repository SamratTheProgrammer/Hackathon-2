import SectionWrapper from "../components/SectionWrapper";
import Card from "../components/Card";
import { ShieldCheck, Lock, Fingerprint, Eye, AlertTriangle, FileCheck } from "lucide-react";

const securityFeatures = [
    {
        icon: <ShieldCheck className="text-blue-600" size={32} />,
        title: "Bank-Grade Security",
        description: "Your money is protected with 256-bit encryption and advanced fraud detection systems.",
    },
    {
        icon: <Lock className="text-green-600" size={32} />,
        title: "Secure Payments",
        description: "Every transaction is verified with OTP and 2-factor authentication.",
    },
    {
        icon: <Fingerprint className="text-purple-600" size={32} />,
        title: "Biometric Access",
        description: "Login securely with Fingerprint or Face ID. No more forgotten passwords.",
    },
    {
        icon: <Eye className="text-orange-600" size={32} />,
        title: "Privacy Controls",
        description: "You control your data. We never share your personal information with third parties.",
    },
    {
        icon: <AlertTriangle className="text-red-600" size={32} />,
        title: "Fraud Alerts",
        description: "Get instant notifications for suspicious activities on your account.",
    },
    {
        icon: <FileCheck className="text-teal-600" size={32} />,
        title: "KYC Verified",
        description: "Fully compliant with RBI guidelines. Secure KYC verification via Aadhaar/PAN.",
    },
];

const Security = () => {
    return (
        <SectionWrapper id="security" className="bg-white dark:bg-gray-900">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Unmatched Security</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    We prioritize your safety with state-of-the-art security measures.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {securityFeatures.map((feature, index) => (
                    <Card key={index} className="flex flex-col items-center text-center hover:border-blue-200 dark:hover:border-blue-500/30 dark:bg-gray-800">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4 text-blue-600 dark:text-blue-400">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </Card>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Security;

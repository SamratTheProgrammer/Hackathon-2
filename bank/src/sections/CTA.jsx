import SectionWrapper from "../components/SectionWrapper";
import Button from "../components/Button";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useTransactions } from "../context/TransactionContext";

const CTA = () => {
    const { user } = useTransactions();
    return (
        <SectionWrapper className="bg-white dark:bg-gray-900">
            <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                {/* Background Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Start Managing Money Smarter Today
                    </h2>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        Join thousands of users who have switched to DigitalDhan for a secure, fast, and rewarding banking experience. Download the app now!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {user ? (
                            <Link to="/dashboard">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 border-none shadow-lg shadow-black/20">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/signup">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 border-none shadow-lg shadow-black/20">
                                    Create Free Account
                                </Button>
                            </Link>
                        )}
                        <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                            Contact Sales
                        </Button>
                    </div>

                    <p className="mt-6 text-sm text-blue-100 opacity-80">
                        Available on iOS and Android. No credit card required.
                    </p>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default CTA;

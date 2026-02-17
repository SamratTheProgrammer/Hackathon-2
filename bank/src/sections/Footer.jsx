import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 dark:bg-black text-gray-300 py-16">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                {/* Brand & Description */}
                <div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 mb-4">
                        DigitalDhan
                    </h3>
                    <p className="text-sm leading-relaxed mb-6">
                        The smartest way to bank, invest, and grow your wealth. Secure, seamless, and rewarding.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-blue-400 transition"><Facebook size={20} /></a>
                        <a href="#" className="hover:text-blue-400 transition"><Twitter size={20} /></a>
                        <a href="#" className="hover:text-pink-500 transition"><Instagram size={20} /></a>
                        <a href="#" className="hover:text-blue-600 transition"><Linkedin size={20} /></a>
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-white font-bold mb-6">Company</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-white transition">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition">Press</a></li>
                        <li><a href="#" className="hover:text-white transition">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Support</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                        <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition">Security</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                    <p className="text-sm mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
                    <div className="flex bg-gray-800 rounded-lg overflow-hidden border border-gray-700 focus-within:border-blue-500 transition">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-transparent px-4 py-2 w-full outline-none text-white placeholder-gray-500"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 px-4 text-white transition">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
                <p>&copy; 2026 DigitalDhan. All rights reserved. Made for the Future of India.</p>
            </div>
        </footer>
    );
};

export default Footer;

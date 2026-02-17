import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-950 -z-20" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg border border-white/20 dark:border-gray-700 rounded-2xl shadow-xl z-10 mx-4"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                        DigitalDhan
                    </Link>
                </div>
                <Outlet />
            </motion.div>
        </div>
    );
};

export default AuthLayout;

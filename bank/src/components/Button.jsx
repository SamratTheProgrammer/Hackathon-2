import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const Button = ({ children, variant = "primary", size = "md", className, ...props }) => {
    const baseStyles = "rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105",
        secondary: "bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300",
        outline: "bg-transparent border-2 border-gray-300 dark:border-white/30 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 backdrop-blur-sm",
        ghost: "bg-transparent text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;

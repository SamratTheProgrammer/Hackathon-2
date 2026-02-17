import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const Card = ({ children, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={cn(
                "bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg border border-white/20 dark:border-gray-700 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;

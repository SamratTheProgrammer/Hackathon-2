import { cn } from "../lib/utils";

const SectionWrapper = ({ children, id, className }) => {
    return (
        <section id={id} className={cn("py-10 md:py-20 px-6 w-full relative overflow-hidden", className)}>
            <div className="max-w-7xl mx-auto relative z-10">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;

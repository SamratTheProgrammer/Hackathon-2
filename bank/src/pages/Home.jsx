import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import DashboardPreview from "../sections/DashboardPreview";
import Security from "../sections/Security";
import Rewards from "../sections/Rewards";
import Testimonials from "../sections/Testimonials";
import CTA from "../sections/CTA";
import Footer from "../sections/Footer";

const Home = () => {
    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <Hero />
            <Features />
            <DashboardPreview />
            <Security />
            <Rewards />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
};

export default Home;

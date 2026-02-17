import SectionWrapper from "../components/SectionWrapper";
import Card from "../components/Card";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Priya Singh",
        role: "Freelancer",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        review: "DigitalDhan has completely changed how I manage my freelance payments. It's fast, secure, and the rewards are amazing!",
    },
    {
        name: "Arjun Mehta",
        role: "Small Business Owner",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        review: "The best fintech app in India! The transaction success rate is 100%, and I love the detailed expense reports.",
    },
    {
        name: "Sneha Kapoor",
        role: "Student",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        review: "Super easy to use for splitting bills with friends. The cashback offers are a cherry on top!",
    },
];

const Testimonials = () => {
    return (
        <SectionWrapper id="testimonials" className="bg-white/50 dark:bg-gray-900">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Loved by 10,000+ Users</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    See what our community has to say about their experience.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="flex flex-col gap-4 dark:bg-gray-800">
                        <Quote className="text-blue-200 dark:text-blue-900/50 rotate-180 mb-2" size={40} />
                        <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">"{testimonial.review}"</p>
                        <div className="flex items-center gap-4 mt-auto">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                            />
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                                <p className="text-xs text-blue-500 dark:text-blue-400 font-medium">{testimonial.role}</p>
                                <div className="flex text-yellow-400 mt-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Testimonials;

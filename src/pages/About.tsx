import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-teal-50 to-white py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900"
            >
              About Simply Finds
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              Your trusted source for curated product recommendations
            </motion.p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Simply Finds was born out of a simple frustration: there are too many products and too little time. 
                We understand that life moves fast, and you shouldn't have to spend hours scrolling through endless 
                options to find what you actually need.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our mission is to curate the best products for real-life situations. Whether you're starting college, 
                moving to a new home, or planning your next adventure, we've done the research so you don't have to.
              </p>
              <h2 className="text-3xl font-bold mb-6 mt-12 text-gray-900">What We Do</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We create curated product lists based on where you are in life and what you're doing. Our team of 
                experts researches, tests, and compiles the best products across various categories, ensuring that 
                every recommendation is trustworthy and relevant.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                From travel essentials to home setup guides, from productivity tools to thoughtful gifts - we've 
                got you covered with carefully selected options that save you time and help you make better decisions.
              </p>
              <h2 className="text-3xl font-bold mb-6 mt-12 text-gray-900">Why Choose Simply Finds</h2>
              <ul className="list-none space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 mt-1">✓</span>
                  <span className="text-gray-700">Curated by experts who understand real needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 mt-1">✓</span>
                  <span className="text-gray-700">Organized by life situations, not just categories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 mt-1">✓</span>
                  <span className="text-gray-700">Regularly updated with latest trends and products</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 mt-1">✓</span>
                  <span className="text-gray-700">Save time - find what you need faster</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default About;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const AffiliateDisclosure = () => {
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
              Affiliate Disclosure
            </motion.h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <p className="text-gray-700 mb-6 leading-relaxed">
                SimplyFinds is a product discovery and comparison platform.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Some of the links on our website are affiliate links, including links to Amazon.in. This means that when you click on a product link and make a purchase, we may earn a small commission at no extra cost to you.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                SimplyFinds is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by linking to Amazon.in.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Product prices and availability are subject to change and are determined by Amazon at the time of purchase.
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default AffiliateDisclosure;

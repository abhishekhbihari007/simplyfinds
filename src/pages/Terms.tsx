import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Terms = () => {
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
              Terms of Service
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Last updated: January 2026
            </motion.p>
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
              <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                By accessing and using Simply Finds, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8">2. Use License</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Permission is granted to temporarily access the materials on Simply Finds for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
                and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8">3. Product Recommendations</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Simply Finds provides curated product recommendations based on our research and analysis. 
                We are not responsible for the quality, availability, or pricing of products recommended. 
                All purchases are made through third-party retailers at your own discretion.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8">4. Disclaimer</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                The materials on Simply Finds are provided on an 'as is' basis. Simply Finds makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties including, without 
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
                or non-infringement of intellectual property or other violation of rights.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8">5. Limitations</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                In no event shall Simply Finds or its suppliers be liable for any damages (including, without 
                limitation, damages for loss of data or profit, or due to business interruption) arising out of 
                the use or inability to use the materials on Simply Finds.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8">6. Contact Information</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                For questions regarding these Terms of Service, please contact us at vinaympsimplynow@gmail.com
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Terms;

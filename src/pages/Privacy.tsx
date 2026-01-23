import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Privacy = () => {
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
              Privacy Policy
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
              <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Information We Collect</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We collect information that you provide directly to us, such as when you subscribe to our newsletter, 
                contact us, or interact with our services. This may include your name, email address, and any other 
                information you choose to provide.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Provide, maintain, and improve our services</li>
                <li>Send you newsletters and updates (with your consent)</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze usage patterns</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8">3. Information Sharing</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information 
                only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8">4. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and hold certain 
                information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8">5. Your Rights</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. You can also 
                opt-out of receiving marketing communications from us.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8">6. Contact Us</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at vinaympsimplynow@gmail.com
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Privacy;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const Contact = () => {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-display font-bold mb-4"
            >
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl opacity-90"
            >
              We'd love to hear from you. Get in touch with us!
            </motion.p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Get in Touch</h2>
              <p className="text-gray-600 mb-12 leading-relaxed">
                Have a question or feedback? We're here to help. Reach out to us via email.
              </p>
              <div className="flex justify-center">
                <div className="flex items-center gap-4 bg-teal-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-8 h-8 text-teal-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold mb-2 text-gray-900 text-lg">Email</h3>
                    <a 
                      href="mailto:vinaympsimplynow@gmail.com" 
                      className="text-teal-600 hover:text-teal-700 text-lg font-medium"
                    >
                      vinaympsimplynow@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;

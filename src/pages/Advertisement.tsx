import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Target, Smartphone, Brain, Link2, DollarSign, Image, ShoppingBag, Users, Package, Star, CheckCircle2, AlertTriangle, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";

const Advertisement = () => {
  const whyAdvertise = [
    { icon: Target, text: "High-intent, product-focused visitors" },
    { icon: Smartphone, text: "Mobile-first audience (Reels & Shorts inspired)" },
    { icon: Brain, text: "Content-driven placements, not intrusive ads" },
    { icon: Link2, text: "Direct traffic to your product or landing page" },
    { icon: DollarSign, text: "Affordable pricing for growing brands" },
  ];

  const displayAds = [
    { placement: "Homepage Banner", size: "728×90 / 970×90", duration: "30 Days", price: "₹5,000" },
    { placement: "Sidebar Banner", size: "300×250", duration: "30 Days", price: "₹3,000" },
    { placement: "Category Page Banner", size: "300×250", duration: "30 Days", price: "₹3,000" },
  ];

  const sponsoredFeatures = [
    "Featured product placement",
    "Product summary & highlights",
    "CTA button (Buy / Explore)",
    "Do-follow link",
    "\"Sponsored\" disclosure",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-teal-50/30 pt-16 pb-12 px-4 md:px-8 border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Advertise With SimplyFinds
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
                Reach Shoppers Who Love Smart Finds
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                SimplyFinds is a curated product discovery platform where users explore useful, trending, and value-driven products.
                We help brands connect with an audience that is already interested in discovering and buying everyday solutions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Advertise Section */}
        <section className="py-12 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              Why Advertise With SimplyFinds?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyAdvertise.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Audience Section */}
        <section className="py-12 px-4 md:px-8 bg-teal-50/30">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              Our Audience
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "Daily-use product seekers",
                "Lifestyle & utility buyers",
                "Gift & gadget explorers",
                "Budget-conscious online shoppers"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <p className="text-gray-700">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advertising Options & Pricing */}
        <section className="py-12 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center"
            >
              Advertising Options & Pricing
            </motion.h2>

            {/* Display Advertising */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-16"
            >
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                    <Image className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">Display Advertising</h3>
                </div>
                <p className="text-gray-600 mt-2">Perfect for brand visibility and traffic.</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-teal-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Placement</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Size</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayAds.map((ad, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-800">{ad.placement}</td>
                          <td className="px-6 py-4 text-gray-700">{ad.size}</td>
                          <td className="px-6 py-4 text-gray-700">{ad.duration}</td>
                          <td className="px-6 py-4 text-teal-600 font-semibold">{ad.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Pricing Packages - Three in a Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
              {/* Sponsored Product Listing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Sponsored Product Listing</h3>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">Best for direct conversions.</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex-1 flex flex-col">
                  <div className="space-y-3 mb-6 flex-1">
                    {sponsoredFeatures.map((feature, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-lg text-gray-900">
                      <span className="font-semibold">Price:</span> ₹7,500 <span className="text-gray-600 text-base">(One-time / 30 days live)</span>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Featured Brand Package */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                      <Star className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Featured Brand Package</h3>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">Ideal for brand awareness + long-term exposure.</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex-1 flex flex-col">
                  <div className="space-y-3 mb-6 flex-1">
                    {[
                      "Brand logo placement",
                      "Brand description",
                      "Featured across categories",
                      "Sponsored product listing",
                      "Homepage visibility"
                    ].map((feature, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-lg text-gray-900">
                      <span className="font-semibold">Price:</span> ₹15,000 <span className="text-gray-600 text-base">/ month</span>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Starter Combo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Starter Combo <span className="text-teal-600 text-base">(Most Popular)</span></h3>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex-1 flex flex-col">
                  <div className="space-y-3 mb-6 flex-1">
                    {[
                      "Homepage banner (30 days)",
                      "1 Sponsored product listing",
                      "Category page visibility"
                    ].map((feature, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-lg text-gray-900">
                      <span className="font-semibold">Price:</span> ₹10,000 <span className="text-gray-600 text-base">/ month</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How Advertising Works */}
        <section className="py-12 px-4 md:px-8 bg-teal-50/30">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              How Advertising Works
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[
                "Choose an advertising plan",
                "Share product link or creatives",
                "Quality review & approval",
                "Campaign goes live"
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-teal-600 font-bold text-lg">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{step}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-gray-600 italic">
              All ads are published only after review to maintain site quality.
            </p>
          </div>
        </section>

        {/* Disclosure & Trust */}
        <section className="py-12 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Disclosure & Trust</h3>
                  <p className="text-gray-700 leading-relaxed">
                    SimplyFinds may display sponsored or affiliate content.
                    All paid placements are clearly marked to maintain transparency and user trust.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 px-4 md:px-8 bg-teal-50/30">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              Contact for Advertising
            </motion.h2>
            <div className="text-center space-y-4">
              <a 
                href="mailto:vinaympsimplynow@gmail.com" 
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 text-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                vinaympsimplynow@gmail.com
              </a>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Response time: 24–48 hours</span>
              </div>
            </div>
          </div>
        </section>

        {/* Notes for Advertisers */}
        <section className="py-12 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100"
            >
              <div className="flex items-start gap-4 mb-4">
                <FileText className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <h3 className="text-xl font-bold text-gray-900">Notes for Advertisers</h3>
              </div>
              <ul className="space-y-2 text-gray-700 ml-10">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">•</span>
                  <span>Prices exclude applicable taxes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">•</span>
                  <span>Discounts available for long-term campaigns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">•</span>
                  <span>We accept limited ads only to avoid clutter</span>
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

export default Advertisement;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories } from "@/data/categories";
import {
  ClipboardList,
  Search,
  Smartphone,
  MessageCircle,
  Mail,
  Package,
  Headphones,
  Sparkles,
  Link2,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

// Configure where leads are sent: set your WhatsApp number (with country code, no +) and email.
// Form submissions open WhatsApp or mailto with the lead details so you receive them here.
const LEAD_WHATSAPP_NUMBER = ""; // e.g. "919876543210"
const LEAD_EMAIL = "vinaympsimplynow@gmail.com";

const howItWorks = [
  {
    icon: ClipboardList,
    title: "Tell us your needs",
    description: "Choose category, budget tier, and preferences.",
  },
  {
    icon: Search,
    title: "We curate for you",
    description: "Handpicked products based on your requirements.",
  },
  {
    icon: Smartphone,
    title: "Get click-to-buy recommendations",
    description:
      "You'll receive a curated list with product links and reasons for each pick.",
  },
];

const budgetTiers = [
  { id: "standard", label: "Standard", range: "₹500 - ₹3,000 per product" },
  { id: "premium", label: "Premium", range: "₹3,000 - ₹10,000 per product" },
  { id: "luxury", label: "Luxury", range: "₹10,000+ per product" },
];

const pricingTiers = [
  { name: "Quick Picks", products: "5 products curated", price: "₹99" },
  { name: "Smart Picks", products: "8-10 products curated", price: "₹399" },
  { name: "Deep Curation", products: "12-15 products curated", price: "₹999" },
];

const FindForMe = () => {
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [selectedTier, setSelectedTier] = useState<string>("quick");
  const [selectedPackage, setSelectedPackage] = useState<string>("Quick Picks");
  const [submitted, setSubmitted] = useState(false);

  const scrollToForm = () => {
    document.getElementById("find-for-me-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const body = [
      `Name: ${data.fullName}`,
      `Contact: ${data.contactMethod}`,
      data.whatsapp ? `WhatsApp: ${data.whatsapp}` : "",
      data.email ? `Email: ${data.email}` : "",
      `Category: ${data.category}`,
      `Budget: ${data.budget}`,
      data.package ? `Package: ${data.package}` : "",
      data.preferences ? `Preferences: ${data.preferences}` : "",
      data.anythingElse ? `Anything else: ${data.anythingElse}` : "",
    ].filter(Boolean).join("\n");

    if (LEAD_WHATSAPP_NUMBER) {
      const url = `https://wa.me/${LEAD_WHATSAPP_NUMBER}?text=${encodeURIComponent("New Find For Me lead:\n\n" + body)}`;
      window.open(url, "_blank");
    } else {
      const mailto = `mailto:${LEAD_EMAIL}?subject=Find For Me - New Lead&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Mobile-only sticky header below main nav */}
      <div className="md:hidden fixed top-[5rem] left-0 right-0 z-40 border-b border-border bg-white/95 backdrop-blur py-2 px-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <span className="font-display font-bold text-primary text-lg">Find For Me</span>
          <Button size="sm" onClick={scrollToForm} className="bg-accent hover:bg-accent/90">
            Find For Me
          </Button>
        </div>
      </div>

      {/* Spacer so content isn't hidden under mobile sticky bar */}
      <div className="md:hidden h-14 flex-shrink-0" aria-hidden />
      <div className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50/80 to-cyan-50/30 py-14 md:py-20 px-4 md:px-8 border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-[2.75rem] font-display font-bold text-primary mb-1.5 tracking-tight">
                Find For Me
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-3 font-medium">
                By SimplyFinds
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Tell us what you're looking for. We'll curate the best products for you.
              </p>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow rounded-xl px-8 text-base"
                onClick={scrollToForm}
              >
                Find For Me
              </Button>
            </motion.div>
            {/* Hero illustration - curation concept */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden md:flex relative items-center justify-center w-full max-w-sm lg:max-w-md"
              aria-hidden
            >
              <div className="relative">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100/80 flex items-center justify-center border border-teal-200/50 shadow-sm">
                    <Package className="w-7 h-7 text-teal-600" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-100/80 flex items-center justify-center border border-amber-200/50 shadow-sm">
                    <Headphones className="w-7 h-7 text-amber-700" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-cyan-100/80 flex items-center justify-center border border-cyan-200/50 shadow-sm">
                    <Sparkles className="w-7 h-7 text-cyan-600" />
                  </div>
                </div>
                <div className="flex items-center justify-center my-4">
                  <ChevronRight className="w-8 h-8 text-teal-400 rotate-90" />
                </div>
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-gray-200 shadow-md px-5 py-4">
                  <Smartphone className="w-10 h-10 text-teal-600" />
                  <Link2 className="w-5 h-5 text-teal-500" />
                  <span className="text-sm font-medium text-gray-700">Click to buy</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works - 3 points (click to buy recommendations) */}
        <section className="py-14 md:py-16 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3 text-center">
              How It Works
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
              Get click-to-buy recommendations on 3 simple steps.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center md:border-0 md:bg-gray-50/80 md:rounded-2xl md:py-8 md:px-5"
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-[260px]">
                    {step.description}
                  </p>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2">
                      <ChevronRight className="w-5 h-5 text-teal-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Two columns: Form + Pricing */}
        <section id="find-for-me-form" className="py-14 md:py-16 px-4 md:px-8 bg-gray-50/60 scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
              {/* Form */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                  Fill Out The Form
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Share your details and we’ll send personalised recommendations to you.
                </p>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-teal-50 border border-teal-200 rounded-2xl p-6"
                  >
                    <p className="text-teal-800 font-medium mb-2">Thank you for submitting!</p>
                    <p className="text-gray-700">
                      Our team will connect with you shortly on the contact details you shared.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        required
                        placeholder="Your name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Preferred Contact Method *</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="contactMethod"
                            value="whatsapp"
                            checked={contactMethod === "whatsapp"}
                            onChange={() => setContactMethod("whatsapp")}
                            className="text-primary"
                          />
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="contactMethod"
                            value="email"
                            checked={contactMethod === "email"}
                            onChange={() => setContactMethod("email")}
                            className="text-primary"
                          />
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="whatsapp">WhatsApp Number (for delivery){contactMethod === "whatsapp" ? " *" : ""}</Label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        required={contactMethod === "whatsapp"}
                        placeholder="e.g. 9876543210"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email ID (for delivery){contactMethod === "email" ? " *" : ""}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required={contactMethod === "email"}
                        placeholder="you@example.com"
                        className="mt-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We'll use this only to share your personalised recommendations.
                    </p>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        name="category"
                        required
                        className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label>Package *</Label>
                      <div className="space-y-2 mt-2">
                        {pricingTiers.map((tier) => (
                          <label
                            key={tier.name}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                              selectedPackage === tier.name
                                ? "border-primary bg-teal-50"
                                : "border-border hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="package"
                                value={tier.name}
                                checked={selectedPackage === tier.name}
                                onChange={() => setSelectedPackage(tier.name)}
                                className="text-primary"
                              />
                              <span className="font-medium">{tier.name}</span>
                            </div>
                            <span className="text-sm font-semibold text-primary">{tier.price}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Budget Preference *</Label>
                      <div className="space-y-2 mt-2">
                        {budgetTiers.map((tier) => (
                          <label
                            key={tier.id}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                              selectedTier === tier.id
                                ? "border-primary bg-teal-50"
                                : "border-border hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="budget"
                                value={tier.id}
                                checked={selectedTier === tier.id}
                                onChange={() => setSelectedTier(tier.id)}
                                className="text-primary"
                              />
                              <span className="font-medium">{tier.label}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{tier.range}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="preferences">Preferences (optional)</Label>
                      <textarea
                        id="preferences"
                        name="preferences"
                        rows={3}
                        placeholder="Any specific requirements..."
                        className="mt-1.5 flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-y ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="anythingElse">Anything else in your mind?</Label>
                      <textarea
                        id="anythingElse"
                        name="anythingElse"
                        rows={3}
                        placeholder="Describe anything else you'd like us to consider..."
                        className="mt-1.5 flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-y ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    <p className="text-sm text-gray-600">
                      Once you submit, our team will connect with you.
                    </p>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-md"
                    >
                      Find For Me
                    </Button>
                  </form>
                )}
              </div>

              {/* Pricing */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                  Get Tailored Recommendations
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Choose how many products you’d like us to curate for you.
                </p>
                <div className="space-y-3 mb-6">
                  {pricingTiers.map((tier) => (
                    <div
                      key={tier.name}
                      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-teal-200/50 transition-all"
                    >
                      <p className="font-semibold text-gray-900">{tier.name}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{tier.products}</p>
                      <p className="text-xl font-bold text-primary mt-3">{tier.price}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Prices and availability may change. Recommendations are based on current
                  listings and user preferences.
                </p>
                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-md"
                  asChild
                >
                  <Link to="#find-for-me-form" onClick={(e) => { e.preventDefault(); scrollToForm(); }}>
                    Find For Me
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Once you submit, our team will connect with you.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default FindForMe;

import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { categories } from "@/data/categories";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('selectCategory', { detail: categoryId }));
        }, 300);
      }, 100);
    } else {
      document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('selectCategory', { detail: categoryId }));
      }, 300);
    }
  };

  const scrollToCategories = () => {
    if (location.pathname !== "/") {
      navigate("/#categories");
      setTimeout(() => {
        document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="Simply Finds - Home">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" aria-hidden="true">
                <img 
                  src="/logo-icon.svg" 
                  alt="Simply Finds Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback if logo fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <span className="text-xl font-display font-bold">
                simply <span className="text-primary">finds</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted source for curated product recommendations. 
              We help you find the best picks for every moment of your life.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => {
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className="text-sm transition-colors text-left text-muted-foreground hover:text-primary"
                      aria-label={`Expand ${cat.title} category`}
                    >
                      {cat.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`text-sm transition-colors ${
                    location.pathname === "/"
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  aria-label="Go to home page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className={`text-sm transition-colors ${
                    location.pathname === "/about"
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/advertise" 
                  className={`text-sm transition-colors ${
                    location.pathname === "/advertise"
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`text-sm transition-colors ${
                    location.pathname === "/contact"
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Contact
                </Link>
              </li>
              <li>
                <button
                  onClick={scrollToCategories}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Browse Collections
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified about new collections and deals.
            </p>
            <form 
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                // Form submission will be handled when backend is ready
                const form = e.target as HTMLFormElement;
                const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
                if (emailInput) {
                  emailInput.value = '';
                }
              }}
              aria-label="Newsletter subscription form"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for newsletter subscription
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                aria-required="true"
                aria-label="Email address"
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm whitespace-nowrap"
                aria-label="Subscribe to newsletter"
              >
                Join
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col gap-4">
            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center mb-2">
              Disclaimer: As an Amazon Associate, SimplyFinds earns from qualifying purchases.
            </p>
            
            {/* Links and Copyright Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {/* Footer Links */}
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <Link 
                  to="/privacy" 
                  className={`transition-colors ${
                    location.pathname === "/privacy"
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`}
                >
                  Privacy Policy
                </Link>
                <span className="text-muted-foreground/40">•</span>
                <Link 
                  to="/terms" 
                  className={`transition-colors ${
                    location.pathname === "/terms"
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`}
                >
                  Terms of Service
                </Link>
                <span className="text-muted-foreground/40">•</span>
                <Link 
                  to="/affiliate-disclosure" 
                  className={`transition-colors ${
                    location.pathname === "/affiliate-disclosure"
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`}
                >
                  Affiliate Disclosure
                </Link>
              </div>
              
              {/* Copyright */}
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                © {new Date().getFullYear()} SimplyFinds. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

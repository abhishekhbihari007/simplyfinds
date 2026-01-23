import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { categories } from "@/data/categories";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll to categories section
  const scrollToCategories = () => {
    if (location.pathname !== "/") {
      navigate("/#categories");
      setTimeout(() => {
        document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  // Handle category navigation - navigate to category page
  const handleCategoryClick = (categoryId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    navigate(`/category/${categoryId}`);
    setIsOpen(false);
  };

  useEffect(() => {
    // Set active based on current path
    if (location.pathname === "/") {
      setActiveSection("home");
    } else if (location.pathname.startsWith("/category/")) {
      const pathParts = location.pathname.split("/category/")[1];
      const categoryId = pathParts.split("/")[0]; // Get category ID, ignore subcategory
      setActiveSection(categoryId);
    } else {
      // Set active for other pages
      const page = location.pathname.substring(1); // Remove leading /
      setActiveSection(page || null);
    }
  }, [location]);

  useEffect(() => {
    // Handle navbar transparency on scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const navbarHeight = 100; // Approximate navbar height
      
      // Check if scrolled past navbar
      setIsScrolled(currentScrollY > navbarHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* White background cover for the gap area */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-white"></div>
      <div className="relative mt-4 px-4 md:px-0">
        <div className={`w-full px-4 sm:px-6 lg:px-12 py-3 md:py-4 rounded-2xl border border-border shadow-sm transition-all duration-300 ${
          isScrolled 
            ? "bg-card/90 backdrop-blur-xl" 
            : "bg-white"
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3" aria-label="Simply Finds - Home">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                aria-hidden="true"
              >
                <img 
                  src="/logo-icon.svg" 
                  alt="Simply Finds Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback if logo fails to load
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add('bg-primary');
                      parent.innerHTML = '<span style="color: white; font-size: 18px;">★</span>';
                    }
                  }}
                />
              </motion.div>
              <span className="text-lg md:text-xl font-display font-bold whitespace-nowrap">
                simply <span className="text-primary">finds</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 relative">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    to={`/category/${cat.id}`}
                    className={`text-sm font-medium transition-colors relative flex items-center gap-1 ${
                      activeSection === cat.id
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    aria-label={`Navigate to ${cat.title} category`}
                  >
                    {cat.title}
                    <ChevronDown className={`w-3 h-3 transition-transform ${hoveredCategory === cat.id ? 'rotate-180' : ''}`} />
                    {activeSection === cat.id && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                  
                  {/* Subcategories Dropdown */}
                  <AnimatePresence>
                    {hoveredCategory === cat.id && cat.subcategories.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                        onMouseEnter={() => setHoveredCategory(cat.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        {cat.subcategories.map((subcat) => (
                          <Link
                            key={subcat.slug}
                            to={`/category/${cat.id}/${subcat.slug}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                            onClick={() => setHoveredCategory(null)}
                          >
                            {subcat.name}
                          </Link>
                        ))}
                        <Link
                          to={`/category/${cat.id}`}
                          className="block px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 border-t border-gray-100 mt-1 transition-colors"
                          onClick={() => setHoveredCategory(null)}
                        >
                          View All
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === "about"
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                About
                {activeSection === "about" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
              <Link
                to="/advertise"
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === "advertise"
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Advertise
                {activeSection === "advertise" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === "contact"
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Contact
                {activeSection === "contact" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <motion.nav
            id="mobile-navigation"
            initial={false}
            animate={{ height: isOpen ? "auto" : 0 }}
            className="md:hidden overflow-hidden"
            aria-label="Mobile navigation menu"
          >
            <div className="pt-6 pb-2 space-y-2">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <button
                    onClick={() => setExpandedMobileCategory(expandedMobileCategory === cat.id ? null : cat.id)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors ${
                      activeSection === cat.id
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-secondary"
                    }`}
                    aria-label={`Toggle ${cat.title} subcategories`}
                    aria-expanded={expandedMobileCategory === cat.id}
                  >
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true">{cat.emoji}</span>
                      <span className="font-medium">{cat.title}</span>
                    </div>
                    {cat.subcategories.length > 0 && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobileCategory === cat.id ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  
                  {/* Mobile Subcategories */}
                  <AnimatePresence>
                    {expandedMobileCategory === cat.id && cat.subcategories.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-8 pr-4 py-2 space-y-1">
                          {cat.subcategories.map((subcat) => (
                            <Link
                              key={subcat.slug}
                              to={`/category/${cat.id}/${subcat.slug}`}
                              onClick={() => {
                                setIsOpen(false);
                                setExpandedMobileCategory(null);
                              }}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors"
                            >
                              {subcat.name}
                            </Link>
                          ))}
                          <Link
                            to={`/category/${cat.id}`}
                            onClick={() => {
                              setIsOpen(false);
                              setExpandedMobileCategory(null);
                            }}
                            className="block px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border-t border-gray-100 mt-1 pt-3"
                          >
                            View All
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <div className="border-t border-border/50 my-2"></div>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors ${
                  activeSection === "about"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-secondary"
                }`}
              >
                <span className="font-medium">About</span>
              </Link>
              <Link
                to="/advertise"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors ${
                  activeSection === "advertise"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-secondary"
                }`}
              >
                <span className="font-medium">Advertise</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors ${
                  activeSection === "contact"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-secondary"
                }`}
              >
                <span className="font-medium">Contact</span>
              </Link>
            </div>
          </motion.nav>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

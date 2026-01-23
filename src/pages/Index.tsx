import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedBanner from "@/components/FeaturedBanner";
import TrendingCarousel from "@/components/TrendingCarousel";
import CategoriesSection from "@/components/CategoriesSection";
import Footer from "@/components/Footer";
import { categories } from "@/data/categories";

const Index = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Handle hash navigation
    if (location.hash) {
      const hash = location.hash.substring(1);
      
      // Check if hash is a category selection
      if (hash.startsWith('category-')) {
        const categoryId = hash.replace('category-', '');
        setTimeout(() => {
          document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            setSelectedCategory(categoryId);
          }, 300);
        }, 100);
      } else {
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }
    }

    // Listen for category selection events from navbar/footer
    const handleCategorySelect = (e: CustomEvent) => {
      const categoryId = e.detail;
      // Toggle: if same category is already selected, collapse it
      setSelectedCategory((prev) => prev === categoryId ? null : categoryId);
    };

    window.addEventListener('selectCategory', handleCategorySelect as EventListener);
    return () => window.removeEventListener('selectCategory', handleCategorySelect as EventListener);
  }, [location]);

  const handleCategoryClick = (categoryId: string) => {
    // Toggle: if same category is clicked, collapse it
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleImageError = (slug: string) => {
    setImageErrors((prev) => ({ ...prev, [slug]: true }));
  };

  const getFallbackImage = (categoryId: string) => {
    const colors: Record<string, string> = {
      travel: "from-blue-400 to-cyan-500",
      "life-stages": "from-pink-400 to-orange-500",
      productivity: "from-cyan-400 to-teal-500",
      gifting: "from-rose-400 to-coral-500",
      tech: "from-indigo-400 to-purple-500",
    };
    const cat = categories.find((c) => c.id === categoryId);
    const gradient = colors[categoryId] || "from-gray-400 to-gray-500";
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-3xl opacity-80">{cat?.emoji || "📦"}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <Hero />
        <FeaturedBanner />
        <TrendingCarousel 
          title="Trending Finds"
          description="Popular products people are discovering right now"
        />
        <CategoriesSection 
          onCategoryClick={handleCategoryClick} 
          selectedCategory={selectedCategory}
          imageErrors={imageErrors}
          onImageError={handleImageError}
          getFallbackImage={getFallbackImage}
        />

        <Footer />
      </div>
    </div>
  );
};

export default Index;

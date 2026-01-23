import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Heart } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { getTrendingProducts, type Product } from "@/data/products";

interface TrendingCarouselProps {
  title?: string;
  description?: string;
  products?: Product[];
}

const TrendingCarousel = ({ 
  title = "Trending Finds", 
  description = "Popular products people are discovering right now",
  products = getTrendingProducts()
}: TrendingCarouselProps) => {
  // Reorder products: Doll first, Printer second, Nike Shoe third, Table fourth, then rest
  const finalOrder = useMemo(() => {
    const reorderedProducts = [...products];
    const orderedIds = ["trending-1", "trending-2", "trending-3", "trending-4"]; // Update IDs to match new structure
    
    const orderedItems: Product[] = [];
    const remainingItems: Product[] = [];
    
    // First, collect the ordered items
    orderedIds.forEach(id => {
      const index = reorderedProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        orderedItems.push(reorderedProducts[index]);
      }
    });
    
    // Then, collect all remaining items (not in the ordered list)
    reorderedProducts.forEach(item => {
      if (!orderedIds.includes(item.id)) {
        remainingItems.push(item);
      }
    });
    
    // Combine: ordered items first, then remaining items
    return [...orderedItems, ...remainingItems];
  }, [products]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldRestart, setShouldRestart] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % finalOrder.length);
    // Trigger restart of auto-scroll
    setShouldRestart((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + finalOrder.length) % finalOrder.length);
    // Trigger restart of auto-scroll
    setShouldRestart((prev) => prev + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // Trigger restart of auto-scroll
    setShouldRestart((prev) => prev + 1);
  };

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Start auto-scroll if not paused and we have products
    if (!isPaused && finalOrder.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % finalOrder.length;
          return nextIndex;
        });
      }, 3000); // Auto-scroll every 3 seconds
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, finalOrder.length, shouldRestart]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Safety check: if no products, don't render carousel
  if (!finalOrder || finalOrder.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-teal-50/30 via-white to-teal-50/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 text-gray-900">
            {title}
          </h2>
          <p className="text-gray-600 text-lg">{description}</p>
        </div>

        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl bg-white">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {finalOrder.map((item) => (
                <div key={item.id} className="min-w-full w-full relative flex-shrink-0">
                  <div className="flex flex-col md:flex-row h-auto md:h-[450px] lg:h-[500px] bg-white">
                    {/* Image Section - Left Side */}
                    <div className="w-full md:w-1/2 h-[350px] md:h-full relative overflow-hidden bg-white flex items-center justify-center p-4 md:p-6 lg:p-8">
                      {item.image_url ? (
                          <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-contain object-center transition-transform duration-700 ease-out"
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%',
                            objectFit: 'contain'
                          }}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-4xl opacity-50">📦</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section - Right Side */}
                    <div className="w-full md:w-1/2 bg-white flex flex-col p-6 md:p-8 lg:p-10 border-l-0 md:border-l border-t md:border-t-0 border-gray-200">
                      <div className="flex flex-col h-full justify-center">
                        {item.lovedBy && (
                          <div className="mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm font-medium text-gray-800 bg-gray-50 rounded-full border border-gray-200 shadow-sm">
                              <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 fill-red-500 text-red-500" />
                              <span>loved by {item.lovedBy}</span>
                            </span>
                          </div>
                        )}
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight text-gray-900">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm md:text-base mb-6 text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <a
                          href={item.product_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-teal-600 hover:text-teal-700 transition-colors group w-fit"
                        >
                          <span>View on Amazon</span>
                          <ExternalLink className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all z-10 backdrop-blur-sm border border-gray-100 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all z-10 backdrop-blur-sm border border-gray-100 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
          </button>

          {/* Enhanced Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {finalOrder.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-teal-600 w-10 h-3 shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;

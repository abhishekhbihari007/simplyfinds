import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/data/categories";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getProductsBySubcategory } from "@/data/products";

interface CategoryCardProps {
  category: Category;
  index: number;
  onCategoryClick: (categoryId: string) => void;
  selectedCategory?: string | null;
  imageErrors?: Record<string, boolean>;
  onImageError?: (slug: string) => void;
  getFallbackImage?: (categoryId: string) => JSX.Element;
}

const CategoryCard = ({ 
  category, 
  index, 
  onCategoryClick, 
  selectedCategory,
  imageErrors = {},
  onImageError,
  getFallbackImage
}: CategoryCardProps) => {
  const isExpanded = selectedCategory === category.id;
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [productImageErrors, setProductImageErrors] = useState<Record<string, boolean>>({});

  const handleClick = () => {
    onCategoryClick(category.id);
  };

  const handleImageError = (slug: string) => {
    if (onImageError) {
      onImageError(slug);
    }
  };

  const handleSubcategoryClick = (subcategorySlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSubcategory === subcategorySlug) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategorySlug);
    }
  };

  const handleProductImageError = (productId: string) => {
    setProductImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="group">
      {/* Category Header Card */}
      <div
        data-category-id={category.id}
        className={`relative rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 cursor-pointer ${
          isExpanded 
            ? "bg-teal-50 border-2 border-teal-300 rounded-b-none" 
            : "bg-white border border-gray-200 hover:border-teal-200"
        }`}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={`${category.title} category, ${category.subcategories.length} collections available`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <span className="text-4xl" role="img" aria-label={category.title}>
              {category.emoji}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className={`text-xl font-bold mb-1 ${
                  isExpanded ? "text-teal-600" : "text-gray-800"
                }`}>
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {category.description}
                </p>
              </div>
              
              {/* Expand/Collapse Icon */}
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isExpanded
                    ? "bg-teal-500 text-white rotate-180"
                    : "bg-gray-200 text-gray-700"
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories - Inline Expansion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white border-2 border-teal-300 border-t-0 rounded-b-2xl p-6">
              <div className="space-y-6">
                {category.subcategories.map((subcategory) => {
                  const products = getProductsBySubcategory(category.id, subcategory.slug);
                  const previewProducts = products.slice(0, 3);
                  const isSubcategoryExpanded = selectedSubcategory === subcategory.slug;
                  
                  return (
                    <div key={subcategory.slug} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Subcategory Header - Clickable */}
                      <div
                        onClick={(e) => handleSubcategoryClick(subcategory.slug, e)}
                        className="bg-gray-50 hover:bg-gray-100 p-4 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative w-12 h-12 overflow-hidden bg-gray-100 rounded-lg flex-shrink-0">
                            {subcategory.image && !imageErrors[subcategory.slug] ? (
                              <img
                                src={subcategory.image}
                                alt={subcategory.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={() => handleImageError(subcategory.slug)}
                              />
                            ) : getFallbackImage ? (
                              <div className="w-full h-12 overflow-hidden">
                                {getFallbackImage(category.id)}
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="text-xl opacity-50">{category.emoji}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 leading-tight">
                              {subcategory.name}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {products.length} {products.length === 1 ? 'product' : 'products'} available
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/category/${category.id}/${subcategory.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
                          >
                            View All
                          </Link>
                          <ChevronDown 
                            className={`w-4 h-4 text-gray-500 transition-transform ${isSubcategoryExpanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </div>

                      {/* Products Preview - Expandable */}
                      <AnimatePresence>
                        {isSubcategoryExpanded && previewProducts.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-white border-t border-gray-200">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {previewProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all group/product"
                                  >
                                    {/* Product Image */}
                                    <div className="relative w-full h-32 overflow-hidden bg-gray-100 flex items-center justify-center">
                                      {product.image_url && !productImageErrors[product.id] ? (
                                        <img
                                          src={product.image_url}
                                          alt={product.title}
                                          className="w-full h-full object-contain p-2 group-hover/product:scale-105 transition-transform duration-500"
                                          loading="lazy"
                                          onError={() => handleProductImageError(product.id)}
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                          <span className="text-2xl opacity-50">{category.emoji}</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Product Content */}
                                    <div className="p-3">
                                      <h5 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
                                        {product.title}
                                      </h5>
                                      <p className="text-[10px] text-gray-600 mb-2 line-clamp-2">
                                        {product.description}
                                      </p>
                                      <a
                                        href={product.product_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 text-[10px] bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1.5 px-2.5 rounded transition-colors"
                                      >
                                        View
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {products.length > 3 && (
                                <div className="mt-4 text-center">
                                  <Link
                                    to={`/category/${category.id}/${subcategory.slug}`}
                                    className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium"
                                  >
                                    View All {products.length} Products
                                    <ChevronRight className="w-4 h-4" />
                                  </Link>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryCard;

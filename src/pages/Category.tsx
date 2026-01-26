import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { categories } from "@/data/categories";
import { getProductsBySubcategory } from "@/data/products";
import { getProductImageUrl } from "@/lib/productImage";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const category = categories.find((cat) => cat.id === id);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [productImageErrors, setProductImageErrors] = useState<Record<string, boolean>>({});

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  if (!category) {
    return <NotFound />;
  }

  const handleImageError = (slug: string) => {
    setImageErrors((prev) => ({ ...prev, [slug]: true }));
  };

  const handleProductImageError = (productId: string) => {
    setProductImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const getFallbackImage = (categoryId: string, subcategoryName: string) => {
    // Generate a gradient-based placeholder based on category
    const colors: Record<string, string> = {
      travel: "from-blue-400 to-cyan-500",
      "home-360": "from-emerald-400 to-teal-500",
      productivity: "from-cyan-400 to-teal-500",
      gifting: "from-rose-400 to-coral-500",
      tech: "from-indigo-400 to-purple-500",
    };
    
    const gradient = colors[categoryId] || "from-gray-400 to-gray-500";
    
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-6xl opacity-80">{category.emoji}</span>
      </div>
    );
  };

  const getGradientClass = (categoryId: string) => {
    const colors: Record<string, string> = {
      travel: "from-blue-400 to-cyan-500",
      "home-360": "from-emerald-400 to-teal-500",
      productivity: "from-cyan-400 to-teal-500",
      gifting: "from-rose-400 to-coral-500",
      tech: "from-indigo-400 to-purple-500",
    };
    return colors[categoryId] || "from-gray-400 to-gray-500";
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header Section */}
      <section className="bg-teal-50/30 pt-24 pb-12 px-4 md:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-8"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>

          <div className="flex items-start gap-6">
            <div className="text-7xl" role="img" aria-label={category.title}>
              {category.emoji}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                {category.title}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections with Product Previews */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse Collections
            </h2>
            <p className="text-gray-600">
              {category.subcategories.length} curated collections available
            </p>
          </div>

          <div className="space-y-16">
            {category.subcategories.map((subcategory) => {
              const products = getProductsBySubcategory(category.id, subcategory.slug);
              const previewProducts = products.slice(0, 4); // Show first 4 products
              const hasProducts = products.length > 0;

              return (
                <div key={subcategory.slug} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100">
                  {/* Subcategory Header */}
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {subcategory.image && !imageErrors[subcategory.slug] ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={subcategory.image}
                              alt={subcategory.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={() => handleImageError(subcategory.slug)}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-200 to-cyan-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">{category.emoji}</span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {subcategory.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {products.length} {products.length === 1 ? 'product' : 'products'} available
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Preview Grid */}
                  {previewProducts.length > 0 ? (
                    <>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {previewProducts.map((product) => (
                            <div
                              key={product.id}
                              className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 flex flex-col group"
                            >
                              {/* Product Image — use getProductImageUrl for correct first image or subcategory fallback */}
                              <div className="relative w-full h-40 overflow-hidden bg-gray-100 flex items-center justify-center">
                                {!productImageErrors[product.id] && getProductImageUrl(product) ? (
                                    <img
                                    src={getProductImageUrl(product)!}
                                    alt={product.title}
                                    className="w-full h-full object-contain object-center transition-transform duration-700 ease-out p-2 group-hover:scale-105"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    loading="lazy"
                                    onError={() => handleProductImageError(product.id)}
                                  />
                                ) : (
                                  <div className={`w-full h-full bg-gradient-to-br ${getGradientClass(category.id)} flex items-center justify-center`}>
                                    <span className="text-3xl opacity-60">{category.emoji}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Content */}
                              <div className="p-4 flex flex-col flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                                  {product.title}
                                </h4>
                                <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-1">
                                  {product.description}
                                </p>
                                <a
                                  href={product.product_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors duration-200"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* View All Button */}
                      {hasProducts && (
                        <div className="px-6 pb-6">
                          <Link
                            to={`/category/${category.id}/${subcategory.slug}`}
                            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
                          >
                            View All Products ({products.length})
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-6 text-center text-gray-600">
                      <p>Products coming soon...</p>
                      <Link
                        to={`/category/${category.id}/${subcategory.slug}`}
                        className="inline-flex items-center gap-2 mt-4 text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Explore Collection
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Category;

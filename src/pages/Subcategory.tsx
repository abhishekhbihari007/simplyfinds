import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { categories } from "@/data/categories";
import { getProductsBySubcategoryGrouped } from "@/data/products";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";

const Subcategory = () => {
  const { id, subcategorySlug } = useParams<{ id: string; subcategorySlug: string }>();
  const navigate = useNavigate();
  const category = categories.find((cat) => cat.id === id);
  const subcategory = category?.subcategories.find((sub) => sub.slug === subcategorySlug);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Scroll to top when subcategory changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id, subcategorySlug]);

  if (!category || !subcategory) {
    return <NotFound />;
  }

  const productsByCategory = getProductsBySubcategoryGrouped(id!, subcategorySlug!);
  const hasProducts = Object.keys(productsByCategory).length > 0;

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const getFallbackImage = () => {
    const colors: Record<string, string> = {
      travel: "from-blue-400 to-cyan-500",
      "life-stages": "from-pink-400 to-orange-500",
      productivity: "from-cyan-400 to-teal-500",
      gifting: "from-rose-400 to-coral-500",
      tech: "from-indigo-400 to-purple-500",
    };
    
    const gradient = colors[id!] || "from-gray-400 to-gray-500";
    
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-6xl opacity-80">{category.emoji}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header Section */}
      <section className="bg-teal-50/30 pt-24 pb-12 px-4 md:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(`/category/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-8"
            aria-label="Go back to category"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to {category.title}</span>
          </button>

          <div className="flex items-start gap-6">
            <div className="text-7xl" role="img" aria-label={subcategory.name}>
              {category.emoji}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                {subcategory.name}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Curated selection of the best products in this category
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      {hasProducts ? (
        <section className="py-12 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {Object.entries(productsByCategory).map(([categoryName, products]) => (
              <div key={categoryName} className="mb-16 last:mb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200 hover:-translate-y-1 flex flex-col"
                    >
                      {/* Image Section */}
                      <div className="relative w-full h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-full object-contain object-center transition-transform duration-700 ease-out p-3 hover:scale-105"
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '100%',
                              objectFit: 'contain'
                            }}
                            loading="lazy"
                            onError={(e) => {
                              handleImageError(product.id);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          getFallbackImage()
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                          {product.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 flex-1 leading-relaxed">
                          {product.description}
                        </p>
                        
                        <a
                          href={product.product_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 mt-auto"
                        >
                          View on Amazon
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="py-12 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600 text-lg">
              No products available for this subcategory yet.
            </p>
          </div>
        </section>
      )}

      {/* Secret Santa Content Section */}
      {subcategorySlug === 'secret-santa' && (
        <section className="py-8 px-4 md:px-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 md:p-8 border border-teal-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tips Before Buying Secret Santa Gifts
              </h2>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                  <span>Keep the gift useful and neutral</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                  <span>Stick to the budget limit</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                  <span>Avoid overly personal items</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                  <span>Choose compact and easy-to-wrap gifts</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                  <span>Décor and utility is always a safe combo</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Festive Decor Content Section */}
      {subcategorySlug === 'festive-decor' && (
        <section className="py-8 px-4 md:px-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 md:p-8 border border-teal-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                What You Can Do With These
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                These décor items can be mixed and matched to create festive vibes for any celebration:
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                  <span>Brighten your living room or entrance with lights and garlands</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                  <span>Decorate mandir or pooja area with backdrop kits and torans</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                  <span>Add candle light warmth for evening ambience</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                  <span>Use DIY kits to invite creativity with kids or family before festivities</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Home Decor Content Section */}
      {subcategorySlug === 'home-decor' && (
        <section className="py-8 px-4 md:px-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 md:p-8 border border-teal-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Tips for Choosing Home Décor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="text-sm text-gray-700"><span className="font-semibold">1. Decide a style first</span> (modern, minimalist, boho, ethnic, luxe)</div>
                <div className="text-sm text-gray-700"><span className="font-semibold">2. Choose one focal piece</span> (big wall art, sculpture, mirror, lamp)</div>
                <div className="text-sm text-gray-700"><span className="font-semibold">3. Mind the scale</span> — Big room needs big décor, small room needs light and airy pieces</div>
                <div className="text-sm text-gray-700"><span className="font-semibold">4. Stick to a color palette</span> — 1 base + 1–2 accent colors</div>
                <div className="text-sm text-gray-700"><span className="font-semibold">5. Mix textures</span> — Wood + metal + ceramic + fabric</div>
                <div className="text-sm text-gray-700"><span className="font-semibold">6. Use odd numbers</span> — Group décor in 3s or 5s for balance</div>
                <div className="text-sm text-gray-700"><span className="font-semibold">7. Layer visually</span> — Wall to mid-level to table or shelf accents</div>
                <div className="text-sm text-gray-700"><span className="font-semibold">8. Leave empty space</span> — Negative space = premium look</div>
                <div className="text-sm text-gray-700"><span className="font-semibold">9. Add something natural</span> — Plants, dried grass, stone, wood</div>
                <div className="text-sm text-gray-700"><span className="font-semibold">10. Avoid clutter</span> — Fewer meaningful pieces are better than many random ones</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-gray-800 font-semibold text-sm mb-1">One-Line Rule</p>
                <p className="text-gray-700 text-sm">If it doesn't add balance, character, or purpose, skip it.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Vastu Decor Content Section */}
      {subcategorySlug === 'vastu-decor' && (
        <section className="py-8 px-4 md:px-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 md:p-8 border border-teal-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Quick Vastu Placement Tips
                </h2>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span><span className="font-semibold">North / North-East:</span> Best for wealth, spirituality and positive energy.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span><span className="font-semibold">East:</span> Good for overall harmony and health.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span><span className="font-semibold">South-East:</span> Fire or energy corner. Lights and salt lamps here can dissolve negativity.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span><span className="font-semibold">Centre (Brahmasthan):</span> Keep open and uncluttered. Pyramids and crystals here are said to balance energy.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">General Benefits of Vastu Decor</h3>
                <p className="text-gray-600 mb-3 text-sm">According to traditional beliefs:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Increases peace and mental clarity</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Enhances prosperity and opportunities</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Balances energy flow throughout home</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Improves harmony among family members</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Work From Home Comfort Essentials Content Section */}
      {subcategorySlug === 'wfh-comfort' && (
        <section className="py-8 px-4 md:px-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 md:p-8 border border-teal-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Why These Matter for Comfort
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">
                      Ergonomic seating
                    </h3>
                    <p className="text-gray-600 text-sm">Supports spine and reduces fatigue. One of the most impactful comfort upgrades.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">
                      Right desk setup
                    </h3>
                    <p className="text-gray-600 text-sm">Adjustable desks and table options let you mix sitting and standing, which is healthier for long workdays.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">
                      Laptop and monitor positioning
                    </h3>
                    <p className="text-gray-600 text-sm">Raising screens helps maintain neutral neck posture, reducing stress on shoulders and eyes.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">
                      Flexible accessories
                    </h3>
                    <p className="text-gray-600 text-sm">Lap desks and foldable tables let you work comfortably from sofa or bed when needed.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Comfort Setup Tips</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span><span className="font-semibold">Chair first</span> — invest in a supportive seat (your back will thank you).</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span><span className="font-semibold">Desk and stand combo</span> — align your screen at eye level.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span><span className="font-semibold">Alternate stand and sit periods</span> during the day.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Use footrests or pillow support if your feet don't touch the floor comfortably.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Keep accessories like wrist rests or lap desks handy for flexible work zones.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Smart Gadgets Content Section */}
      {subcategorySlug === 'smart-gadgets' && (
        <section className="py-8 px-4 md:px-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 md:p-8 border border-teal-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why These Smart Gadgets Are Actually Useful
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">Automation Made Simple</h3>
                  <p className="text-gray-600 text-sm">
                    Smart plugs and power strips help you control appliances remotely and save energy.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">Better Entertainment</h3>
                  <p className="text-gray-600 text-sm">
                    Fire TV Stick and Echo Dot turn your TV and speakers into intelligent entertainment stations with voice search and streaming.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">Safety & Monitoring</h3>
                  <p className="text-gray-600 text-sm">
                    Smart cameras and doorbells offer real-time alerts and peace of mind, making daily life safer.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">Health & Lifestyle</h3>
                  <p className="text-gray-600 text-sm">
                    Fitness bands track daily activity trends, keeping users motivated and informed.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Before You Buy Tips</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Check Wi-Fi and voice assistant compatibility before buying smart gadgets</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Look for strong app control and scheduling features in smart home devices</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Choose smart devices with high ratings and long battery life</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Prioritize warranty and brand support for smart home technology</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                    <span>Evaluate use case and room size for the best smart gadget experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default Subcategory;

import { categories } from "@/data/categories";
import CategoryCard from "./CategoryCard";

interface CategoriesSectionProps {
  onCategoryClick: (categoryId: string) => void;
  selectedCategory?: string | null;
  imageErrors?: Record<string, boolean>;
  onImageError?: (slug: string) => void;
  getFallbackImage?: (categoryId: string) => JSX.Element;
}

const CategoriesSection = ({ 
  onCategoryClick, 
  selectedCategory,
  imageErrors,
  onImageError,
  getFallbackImage
}: CategoriesSectionProps) => {
  return (
    <section id="categories" className="py-12 px-4 md:px-8 bg-teal-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-gray-800">
            exactly what you need.
          </h2>
        </div>

        {/* Categories grid - Single column for inline expansion */}
        <div className="space-y-4">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              index={index}
              onCategoryClick={onCategoryClick}
              selectedCategory={selectedCategory}
              imageErrors={imageErrors}
              onImageError={onImageError}
              getFallbackImage={getFallbackImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

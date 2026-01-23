import subcategoryProductsData from "./subcategoryProducts.json";

export interface SubcategoryProduct {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  amazonImageUrl?: string;
  category: string;
}

export interface SubcategoryProducts {
  [categoryId: string]: {
    [subcategorySlug: string]: {
      [priceRange: string]: SubcategoryProduct[];
    };
  };
}

// Export the JSON data with proper typing
export const subcategoryProducts: SubcategoryProducts = subcategoryProductsData as SubcategoryProducts;

// Helper function to get products for a specific subcategory
export const getSubcategoryProducts = (
  categoryId: string,
  subcategorySlug: string
): SubcategoryProduct[] => {
  const category = subcategoryProducts[categoryId];
  if (!category) return [];
  
  const subcategory = category[subcategorySlug];
  if (!subcategory) return [];
  
  // Flatten all price ranges into a single array
  return Object.values(subcategory).flat();
};

// Helper function to get products grouped by category
export const getSubcategoryProductsByCategory = (
  categoryId: string,
  subcategorySlug: string
): { [category: string]: SubcategoryProduct[] } => {
  const category = subcategoryProducts[categoryId];
  if (!category) return {};
  
  const subcategory = category[subcategorySlug];
  if (!subcategory) return {};
  
  const grouped: { [category: string]: SubcategoryProduct[] } = {};
  
  Object.values(subcategory).forEach((products) => {
    products.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
  });
  
  return grouped;
};

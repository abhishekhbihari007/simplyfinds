/**
 * Products Data Module
 * Reads product data from products.json - the single source of truth
 * 
 * Structure:
 * - id: Unique identifier
 * - title: Product name
 * - product_link: Amazon affiliate link
 * - image_url: Product image URL (exact URL from JSON, no scraping)
 * - category: Main category ID
 * - subcategory: Subcategory slug
 * - description: Product description (optional)
 * - isTrending: Whether product appears in trending section (optional)
 */

import productsData from "./products.json";

export interface Product {
  id: string;
  title: string;
  product_link: string;
  image_url: string;
  category: string;
  subcategory: string;
  description?: string;
  isTrending?: boolean;
  lovedBy?: string; // Optional: For trending products display
}

// Export all products from JSON
export const products: Product[] = productsData as Product[];

/**
 * Get all products
 */
export const getAllProducts = (): Product[] => {
  return products;
};

/**
 * Get product by ID
 */
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

/**
 * Get products by category
 */
export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.category === categoryId);
};

/**
 * Get products by category and subcategory
 */
export const getProductsBySubcategory = (
  categoryId: string,
  subcategorySlug: string
): Product[] => {
  return products.filter(
    product => 
      product.category === categoryId && 
      product.subcategory === subcategorySlug
  );
};

/**
 * Get trending products
 */
export const getTrendingProducts = (): Product[] => {
  return products.filter(product => product.isTrending === true);
};

/**
 * Get product by link (useful for validation)
 */
export const getProductByLink = (link: string): Product | undefined => {
  return products.find(product => product.product_link === link);
};

/**
 * Search products by title
 */
export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(product =>
    product.title.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get products by subcategory grouped by price_range
 * (For backward compatibility with Subcategory page)
 */
export const getProductsBySubcategoryGrouped = (
  categoryId: string,
  subcategorySlug: string
): { [categoryName: string]: Product[] } => {
  const filteredProducts = getProductsBySubcategory(categoryId, subcategorySlug);
  
  // Return all products in a single group (no grouping by description)
  return { 'All Products': filteredProducts };
};

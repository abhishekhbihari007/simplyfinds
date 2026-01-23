import trendingProductsData from "./trendingProducts.json";

export interface TrendingItem {
  id: string;
  image: string;
  amazonImageUrl?: string;
  title: string;
  link: string;
  category?: string;
  asin?: string;
  description?: string;
  lovedBy?: string;
}

// Export the JSON data with proper typing
export const trendingProducts: TrendingItem[] = trendingProductsData as TrendingItem[];

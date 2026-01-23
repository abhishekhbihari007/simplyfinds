/**
 * Product Import Script for Affiliate Website (TypeScript Version)
 * Imports product details from a list of Amazon URLs
 * 
 * FIXED: Stale variable bug - imageUrl is now explicitly reset at the start of each iteration
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

// Default placeholder image if no product image is found
const DEFAULT_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/500x500?text=No+Image+Available';

interface ProductDetails {
  url: string;
  title: string | null;
  imageUrl: string | null;
  price: string | null;
  description: string;
  extractedAt: string;
  error?: string;
}

interface ImportOptions {
  usePlaceholder?: boolean;
  placeholderImage?: string;
  delayBetweenRequests?: number;
}

interface Product {
  id: string;
  url: string;
  title: string | null;
  imageUrl: string | null;
  price: string | null;
  description: string | null;
  extractedAt: string;
  error?: string;
}

/**
 * Extract product details from an Amazon URL
 * @param url - Amazon product URL
 * @returns Product details object
 */
async function extractProductDetails(url: string): Promise<ProductDetails> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract product title
    const title = $('#productTitle').text().trim() || 
                  $('h1.a-size-large').text().trim() || 
                  'Product Title Not Found';
    
    // CRITICAL FIX: Explicitly reset imageUrl to null at the start
    let imageUrl: string | null = null; // ← EXPLICITLY RESET TO NULL
    
    // Try multiple selectors to find the main product image
    const imageSelectors = [
      '#landingImage',
      '#main-image',
      '#imgBlkFront',
      '.a-dynamic-image',
      '[data-a-image-name="landingImage"]',
      'img[data-old-src]',
      'img[data-src]'
    ];
    
    for (const selector of imageSelectors) {
      const imgElement = $(selector).first();
      if (imgElement.length) {
        // Try data-src first (lazy loaded), then src, then data-old-src
        const foundUrl = imgElement.attr('data-src') || 
                         imgElement.attr('src') || 
                         imgElement.attr('data-old-src') || 
                         null;
        
        // If we found an image URL, break out of the loop
        if (foundUrl) {
          // Clean up the URL - remove query parameters and get base image URL
          imageUrl = foundUrl.split('?')[0];
          // Ensure it's a full URL
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `https:${imageUrl}`;
          }
          break;
        }
      }
    }
    
    // If still no image found, try to extract from meta tags
    if (!imageUrl) {
      imageUrl = $('meta[property="og:image"]').attr('content') || 
                 $('meta[name="twitter:image"]').attr('content') || 
                 null;
    }
    
    // CRITICAL: If no image found, explicitly return null (not undefined or previous value)
    // This ensures Product A's data never leaks into Product B
    if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
      imageUrl = null; // Explicitly null
    }
    
    // Extract price
    const price = $('#priceblock_ourprice').text().trim() || 
                  $('.a-price-whole').first().text().trim() || 
                  null;
    
    // Extract description
    const description = $('#feature-bullets ul li span').first().text().trim() || 
                       $('#productDescription p').first().text().trim() || 
                       '';
    
    return {
      url,
      title,
      imageUrl, // Will be null if not found - no stale data
      price,
      description,
      extractedAt: new Date().toISOString()
    };
    
  } catch (error: any) {
    console.error(`Error extracting product from ${url}:`, error.message);
    return {
      url,
      title: null,
      imageUrl: null, // Explicitly null on error
      price: null,
      description: '',
      error: error.message,
      extractedAt: new Date().toISOString()
    };
  }
}

/**
 * Process multiple product URLs
 * FIXED: Each iteration explicitly resets imageUrl to null
 * 
 * @param urls - Array of Amazon product URLs
 * @param options - Processing options
 * @returns Array of product details
 */
async function importProducts(
  urls: string[], 
  options: ImportOptions = {}
): Promise<Product[]> {
  const {
    usePlaceholder = false,
    placeholderImage = DEFAULT_PLACEHOLDER_IMAGE,
    delayBetweenRequests = 1000 // 1 second delay to avoid rate limiting
  } = options;
  
  const products: Product[] = [];
  
  // Process each URL - CRITICAL: Each iteration is isolated
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    
    // EXPLICITLY RESET imageUrl to null at the start of each iteration
    // This prevents stale data from previous iterations
    let imageUrl: string | null = null; // ← CRITICAL FIX: Reset at start of each loop
    
    console.log(`Processing product ${i + 1}/${urls.length}: ${url}`);
    
    try {
      // Extract product details
      const productDetails = await extractProductDetails(url);
      
      // CRITICAL: Ensure imageUrl is explicitly set (not relying on closure)
      imageUrl = productDetails.imageUrl;
      
      // If no image found and placeholder is enabled, use placeholder
      if (!imageUrl && usePlaceholder) {
        imageUrl = placeholderImage;
      }
      
      // Build product object - imageUrl is guaranteed to be fresh for this product
      const product: Product = {
        id: `product-${i + 1}`,
        url: productDetails.url,
        title: productDetails.title,
        imageUrl: imageUrl, // Fresh value for this product only
        price: productDetails.price,
        description: productDetails.description,
        extractedAt: productDetails.extractedAt
      };
      
      // Validate that imageUrl is not from a previous product
      if (i > 0 && imageUrl && imageUrl === products[i - 1]?.imageUrl && !productDetails.title) {
        console.warn(`⚠️  WARNING: Possible stale image detected for product ${i + 1}`);
        // Force reset to null if we detect potential stale data
        product.imageUrl = null;
      }
      
      products.push(product);
      
      // Add delay between requests to avoid rate limiting
      if (i < urls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
      }
      
    } catch (error: any) {
      console.error(`Failed to process ${url}:`, error.message);
      
      // On error, explicitly set imageUrl to null (not previous product's image)
      products.push({
        id: `product-${i + 1}`,
        url,
        title: null,
        imageUrl: null, // Explicitly null on error
        price: null,
        description: null,
        error: error.message,
        extractedAt: new Date().toISOString()
      });
    }
    
    // CRITICAL: Explicitly clear imageUrl at end of iteration to prevent closure issues
    imageUrl = null;
  }
  
  return products;
}

/**
 * Alternative implementation using map (functional approach)
 * This version is safer as each iteration gets a fresh scope
 */
async function importProductsFunctional(
  urls: string[], 
  options: ImportOptions = {}
): Promise<Product[]> {
  const {
    usePlaceholder = false,
    placeholderImage = DEFAULT_PLACEHOLDER_IMAGE,
    delayBetweenRequests = 1000
  } = options;
  
  // Use map to ensure each iteration has isolated scope
  const productPromises = urls.map(async (url, index): Promise<Product> => {
    // CRITICAL: imageUrl is scoped to this iteration only
    let imageUrl: string | null = null; // Fresh variable for each product
    
    try {
      const productDetails = await extractProductDetails(url);
      
      // Explicitly assign (no closure issues with map)
      imageUrl = productDetails.imageUrl;
      
      // Use placeholder if needed
      if (!imageUrl && usePlaceholder) {
        imageUrl = placeholderImage;
      }
      
      return {
        id: `product-${index + 1}`,
        url: productDetails.url,
        title: productDetails.title,
        imageUrl: imageUrl, // Guaranteed fresh for this product
        price: productDetails.price,
        description: productDetails.description,
        extractedAt: productDetails.extractedAt
      };
      
    } catch (error: any) {
      console.error(`Failed to process ${url}:`, error.message);
      return {
        id: `product-${index + 1}`,
        url,
        title: null,
        imageUrl: null, // Explicitly null on error
        price: null,
        description: null,
        error: error.message,
        extractedAt: new Date().toISOString()
      };
    }
  });
  
  // Process with delays between requests
  const products: Product[] = [];
  for (let i = 0; i < productPromises.length; i++) {
    const product = await productPromises[i];
    products.push(product);
    
    if (i < productPromises.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }
  }
  
  return products;
}

// Example usage
async function main() {
  const urls = [
    'https://amzn.to/3NhWXon',
    'https://amzn.to/3Nz38nT',
    'https://amzn.to/4r2i2Sk',
    // Add more URLs here
  ];
  
  console.log('Starting product import...');
  console.log(`Processing ${urls.length} products\n`);
  
  // Use the fixed version
  const products = await importProducts(urls, {
    usePlaceholder: false, // Set to true to use placeholder images
    delayBetweenRequests: 2000 // 2 second delay
  });
  
  console.log('\n=== Import Results ===');
  products.forEach((product, index) => {
    console.log(`\nProduct ${index + 1}:`);
    console.log(`  Title: ${product.title || 'N/A'}`);
    console.log(`  Image: ${product.imageUrl || 'NULL (No image found)'}`);
    console.log(`  Price: ${product.price || 'N/A'}`);
    if (product.error) {
      console.log(`  Error: ${product.error}`);
    }
  });
  
  return products;
}

// Export for use in other modules
export {
  extractProductDetails,
  importProducts,
  importProductsFunctional,
  DEFAULT_PLACEHOLDER_IMAGE,
  type Product,
  type ProductDetails,
  type ImportOptions
};

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

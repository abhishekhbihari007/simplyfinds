/**
 * Convert Tech Products from subcategoryProducts.json to products.json format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const subcategoryFile = path.join(__dirname, '..', 'src', 'data', 'subcategoryProducts.json');
const productsFile = path.join(__dirname, '..', 'src', 'data', 'products.json');

try {
  // Read subcategoryProducts.json
  const subcategoryData = JSON.parse(fs.readFileSync(subcategoryFile, 'utf8'));
  
  // Read existing products.json
  let existingProducts = [];
  try {
    existingProducts = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
  } catch (e) {
    console.log('Creating new products.json');
  }
  
  // Filter out old tech products
  const nonTechProducts = existingProducts.filter(p => p.category !== 'tech');
  
  // Extract tech products
  const techProducts = [];
  
  if (subcategoryData.tech) {
    const tech = subcategoryData.tech;
    
    // Iterate through all subcategories
    for (const subcategorySlug in tech) {
      const subcategory = tech[subcategorySlug];
      
      // Iterate through price ranges
      for (const priceRange in subcategory) {
        const products = subcategory[priceRange];
        
        // Convert each product
        products.forEach(product => {
          techProducts.push({
            id: product.id,
            title: product.title,
            product_link: product.link,
            image_url: product.amazonImageUrl || product.image || 'default.png',
            description: product.description || '',
            category: 'tech',
            subcategory: subcategorySlug,
            price_range: priceRange
          });
        });
      }
    }
  }
  
  // Combine: non-tech products + new tech products
  const updatedProducts = [...nonTechProducts, ...techProducts];
  
  // Write to products.json
  fs.writeFileSync(productsFile, JSON.stringify(updatedProducts, null, 2), 'utf8');
  
  console.log('✅ Successfully updated products.json');
  console.log(`   Removed: ${existingProducts.length - nonTechProducts.length} old tech products`);
  console.log(`   Added: ${techProducts.length} tech products from subcategoryProducts.json`);
  console.log(`   Kept: ${nonTechProducts.length} non-tech products`);
  console.log(`   Total: ${updatedProducts.length} products`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

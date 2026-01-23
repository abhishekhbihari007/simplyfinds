/**
 * Extract Tech Product URLs from subcategoryProducts.json
 * This script extracts all tech product URLs for scraping
 */

const fs = require('fs');
const path = require('path');

const subcategoryFile = path.join(__dirname, '..', 'src', 'data', 'subcategoryProducts.json');
const outputFile = path.join(__dirname, 'tech_urls.txt');

try {
  const data = JSON.parse(fs.readFileSync(subcategoryFile, 'utf8'));
  const urls = [];
  
  if (data.tech) {
    const tech = data.tech;
    
    // Iterate through all subcategories
    for (const subcategorySlug in tech) {
      const subcategory = tech[subcategorySlug];
      
      // Iterate through price ranges
      for (const priceRange in subcategory) {
        const products = subcategory[priceRange];
        
        // Extract URLs
        products.forEach(product => {
          if (product.link) {
            urls.push(product.link);
          }
        });
      }
    }
  }
  
  // Write URLs to file
  fs.writeFileSync(outputFile, urls.join('\n'), 'utf8');
  
  console.log(`✅ Extracted ${urls.length} tech product URLs`);
  console.log(`   Output: ${outputFile}`);
  console.log('\nURLs:');
  urls.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));
  
} catch (error) {
  console.error('Error:', error.message);
}

/**
 * Update Product Images Script (Node.js)
 * Extracts product images from Amazon links and updates products.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFile = path.join(__dirname, '..', 'src', 'data', 'products.json');

async function extractImageFromAmazon(url) {
  try {
    // Follow redirects for short URLs
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Try multiple methods to find the main product image
    let imageUrl = null;

    // Method 1: Try data-a-dynamic-image attribute (Amazon's new format)
    const dynamicImage = $('img[data-a-dynamic-image]').first();
    if (dynamicImage.length) {
      const dynamicData = dynamicImage.attr('data-a-dynamic-image');
      if (dynamicData) {
        try {
          const imageData = JSON.parse(dynamicData);
          const firstKey = Object.keys(imageData)[0];
          if (firstKey) {
            imageUrl = firstKey;
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
    }

    // Method 2: Try multiple selectors for the main product image
    if (!imageUrl) {
      const imageSelectors = [
        '#landingImage',
        '#main-image',
        '#imgBlkFront',
        '.a-dynamic-image',
        '[data-a-image-name="landingImage"]',
        'img[data-old-src]',
        '#main-image-container img',
        '.a-button-selected img',
      ];

      for (const selector of imageSelectors) {
        const imgElement = $(selector).first();
        if (imgElement.length) {
          imageUrl = imgElement.attr('data-src') || 
                     imgElement.attr('src') || 
                     imgElement.attr('data-old-src') ||
                     imgElement.attr('data-lazy-src') ||
                     null;

          if (imageUrl) break;
        }
      }
    }

    // Method 3: Extract from JavaScript data
    if (!imageUrl) {
      const scriptTags = $('script').toArray();
      for (const script of scriptTags) {
        const scriptContent = $(script).html() || '';
        // Look for image URLs in script content
        const imageMatch = scriptContent.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+_-]+\._SL\d+_\.jpg/g);
        if (imageMatch && imageMatch.length > 0) {
          imageUrl = imageMatch[0];
          break;
        }
      }
    }

    // Method 4: Fallback to Open Graph image
    if (!imageUrl) {
      imageUrl = $('meta[property="og:image"]').attr('content') ||
                 $('meta[name="twitter:image"]').attr('content') ||
                 null;
    }

    if (imageUrl) {
      // Clean up the URL - remove query parameters and get high-res version
      imageUrl = imageUrl.split('?')[0];
      
      // Convert to high-resolution version if it's a small thumbnail
      if (imageUrl.includes('_SY300_') || imageUrl.includes('_SX300_')) {
        imageUrl = imageUrl.replace(/_SY\d+_/g, '_SL1500_').replace(/_SX\d+_/g, '_SL1500_');
      }
      
      // Ensure it's a full URL
      if (imageUrl && !imageUrl.startsWith('http')) {
        if (imageUrl.startsWith('//')) {
          imageUrl = `https:${imageUrl}`;
        } else {
          imageUrl = `https://${imageUrl}`;
        }
      }

      // Validate it's an Amazon media image
      if (imageUrl && (imageUrl.includes('media-amazon.com') || imageUrl.includes('images-amazon.com'))) {
        return imageUrl;
      }
    }

    return null;
  } catch (error) {
    console.error(`  ⚠️  Error extracting image: ${error.message}`);
    return null;
  }
}

async function updateProductsWithImages() {
  try {
    // Read existing products
    const productsData = fs.readFileSync(productsFile, 'utf-8');
    const products = JSON.parse(productsData);

    console.log(`Found ${products.length} products to check`);
    console.log('='.repeat(60));

    let updatedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productLink = product.product_link;
      const productTitle = product.title || 'Unknown';
      const currentImage = product.image_url || '';

      // Skip if already has a valid non-placeholder image
      if (currentImage && !currentImage.includes('51nBTTG3hNL')) {
        skippedCount++;
        continue;
      }

      if (!productLink) {
        console.log(`[${i + 1}/${products.length}] ⚠️  ${productTitle.substring(0, 50)}... (no link)`);
        failedCount++;
        continue;
      }

      console.log(`[${i + 1}/${products.length}] Processing: ${productTitle.substring(0, 50)}...`);
      console.log(`  Link: ${productLink}`);

      // Extract image from Amazon
      const newImageUrl = await extractImageFromAmazon(productLink);

      if (newImageUrl) {
        product.image_url = newImageUrl;
        updatedCount++;
        console.log(`  ✅ Updated image: ${newImageUrl.substring(0, 80)}...`);
      } else {
        failedCount++;
        console.log(`  ❌ Failed to extract image`);
      }

      // Delay to avoid rate limiting
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Write updated products back to file
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf-8');

    console.log('='.repeat(60));
    console.log('✅ Update complete!');
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Failed: ${failedCount}`);
    console.log(`   Skipped (already had images): ${skippedCount}`);
    console.log(`   Total: ${products.length}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

console.log('🚀 Starting product image update...');
console.log('This will update all products with placeholder images (51nBTTG3hNL)');
console.log('⚠️  This may take a while (2 seconds delay between requests)');
console.log('='.repeat(60));
updateProductsWithImages();

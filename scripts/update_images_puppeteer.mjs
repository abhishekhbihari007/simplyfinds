/**
 * Update Product Images Script using Puppeteer (Node.js)
 * Uses a real browser to extract product images from Amazon links
 * This handles JavaScript-rendered pages properly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFile = path.join(__dirname, '..', 'src', 'data', 'products.json');

async function extractImageFromAmazon(url, page) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for the main product image to load
    await page.waitForSelector('#landingImage, #main-image, img[data-a-dynamic-image], .a-dynamic-image', { timeout: 10000 }).catch(() => {});
    
    // Try multiple methods to extract the image
    const imageUrl = await page.evaluate(() => {
      // Method 1: Try data-a-dynamic-image (Amazon's new format)
      const dynamicImg = document.querySelector('img[data-a-dynamic-image]');
      if (dynamicImg) {
        const dynamicData = dynamicImg.getAttribute('data-a-dynamic-image');
        if (dynamicData) {
          try {
            const imageData = JSON.parse(dynamicData);
            const firstKey = Object.keys(imageData)[0];
            if (firstKey) return firstKey;
          } catch (e) {}
        }
      }
      
      // Method 2: Try landingImage
      const landingImg = document.querySelector('#landingImage');
      if (landingImg) {
        return landingImg.src || landingImg.getAttribute('data-src') || landingImg.getAttribute('data-old-src');
      }
      
      // Method 3: Try main-image
      const mainImg = document.querySelector('#main-image');
      if (mainImg) {
        return mainImg.src || mainImg.getAttribute('data-src');
      }
      
      // Method 4: Try Open Graph
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        return ogImage.getAttribute('content');
      }
      
      // Method 5: Try any large product image
      const allImages = document.querySelectorAll('img');
      for (const img of allImages) {
        const src = img.src || img.getAttribute('data-src');
        if (src && src.includes('media-amazon.com') && src.includes('_SL')) {
          return src;
        }
      }
      
      return null;
    });

    if (imageUrl) {
      // Clean up the URL
      let cleanUrl = imageUrl.split('?')[0];
      
      // Convert to high-resolution version
      if (cleanUrl.includes('_SY') || cleanUrl.includes('_SX')) {
        cleanUrl = cleanUrl.replace(/_SY\d+_/g, '_SL1500_').replace(/_SX\d+_/g, '_SL1500_');
      }
      
      // Ensure it's a full URL
      if (cleanUrl && !cleanUrl.startsWith('http')) {
        if (cleanUrl.startsWith('//')) {
          cleanUrl = `https:${cleanUrl}`;
        } else {
          cleanUrl = `https://${cleanUrl}`;
        }
      }

      if (cleanUrl && (cleanUrl.includes('media-amazon.com') || cleanUrl.includes('images-amazon.com'))) {
        return cleanUrl;
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

    // Launch browser
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    let updatedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productLink = product.product_link;
      const productTitle = product.title || 'Unknown';
      const currentImage = product.image_url || '';

      // NO SKIPPING - Verify ALL products regardless of existing image
      // This ensures all images are correct and up-to-date

      if (!productLink) {
        console.log(`[${i + 1}/${products.length}] ⚠️  ${productTitle.substring(0, 50)}... (no link)`);
        failedCount++;
        continue;
      }

      console.log(`[${i + 1}/${products.length}] Processing: ${productTitle.substring(0, 50)}...`);
      console.log(`  Link: ${productLink}`);

      // Extract image from Amazon
      const newImageUrl = await extractImageFromAmazon(productLink, page);

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

    // Close browser
    await browser.close();

    // Write updated products back to file
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf-8');

    console.log('='.repeat(60));
    console.log('✅ Update complete!');
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Failed: ${failedCount}`);
    console.log(`   Total processed: ${products.length}`);
    console.log(`   Success rate: ${((updatedCount / products.length) * 100).toFixed(1)}%`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

console.log('🚀 Starting product image update with Puppeteer...');
console.log('This will use a real browser to extract images from Amazon');
console.log('⚠️  This may take a while (2 seconds delay between requests)');
console.log('='.repeat(60));
updateProductsWithImages();

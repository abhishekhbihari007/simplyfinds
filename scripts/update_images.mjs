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

/** Fetches Amazon page once; returns { imageUrl, title }. */
async function fetchAmazonPage(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    timeout: 30000,
    maxRedirects: 7,
    validateStatus: (status) => status >= 200 && status < 400,
  });
  return cheerio.load(response.data);
}

async function extractImageFromAmazon(url) {
  try {
    const $ = await fetchAmazonPage(url);

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

function extractTitleFromPage($) {
  let title = $('#productTitle').text().trim() || $('meta[property="og:title"]').attr('content') || '';
  if (title) title = title.replace(/\s*[\-\|]\s*Amazon\.?(\s*in)?\.?\s*$/i, '').trim();
  return (title && title.length > 10 && title.length < 200) ? title : null;
}

async function updateProductsWithImages() {
  try {
    // Read existing products
    const productsData = fs.readFileSync(productsFile, 'utf-8');
    const allProducts = JSON.parse(productsData);
    const products = idList?.length
      ? allProducts.filter((p) => idList.includes(p.id))
      : allProducts;
    if (idList?.length) {
      console.log(`Target IDs: ${idList.join(', ')} (${products.length} product(s))`);
    }

    console.log(`Processing ${products.length} products`);
    console.log('='.repeat(60));

    let updatedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;
    const isTargetedRun = idList?.length > 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const globalIndex = allProducts.findIndex((p) => p.id === product.id);
      const productLink = product.product_link;
      const productTitle = product.title || 'Unknown';
      const currentImage = product.image_url || '';

      // Skip if already has a valid non-placeholder image (unless targeted by --ids)
      if (!isTargetedRun) {
        const isPlaceholder =
          !currentImage ||
          currentImage.includes('51nBTTG3hNL') ||
          currentImage === '/placeholder.svg' ||
          currentImage.endsWith('/placeholder.svg') ||
          currentImage.includes('unsplash.com');
        if (currentImage && !isPlaceholder) {
          skippedCount++;
          continue;
        }
      }

      if (!productLink) {
        console.log(`[${i + 1}/${products.length}] ⚠️  ${productTitle.substring(0, 50)}... (no link)`);
        failedCount++;
        continue;
      }

      console.log(`[${i + 1}/${products.length}] Processing: ${productTitle.substring(0, 50)}...`);
      console.log(`  Link: ${productLink}`);

      let $;
      try {
        $ = await fetchAmazonPage(productLink);
      } catch (err) {
        console.log(`  ❌ Failed to fetch page: ${err.message}`);
        failedCount++;
        if (i < products.length - 1) await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      let imageUrl = null;
      const tryExtract = (cheerio$) => {
        let url = cheerio$('meta[property="og:image"]').attr('content') || cheerio$('meta[name="twitter:image"]').attr('content') || null;
        if (url) return url;
        const dynamicImage = cheerio$('img[data-a-dynamic-image]').first();
        if (dynamicImage.length) {
          try {
            const d = dynamicImage.attr('data-a-dynamic-image');
            if (d) {
              const imageData = JSON.parse(d);
              url = Object.keys(imageData)[0] || null;
              if (url) return url;
            }
          } catch (e) {}
        }
        const sel = ['#landingImage', '#main-image', '.a-dynamic-image', '#main-image-container img'];
        for (const s of sel) {
          const el = cheerio$(s).first();
          url = el.attr('data-src') || el.attr('src') || null;
          if (url) return url;
        }
        const scripts = cheerio$('script').toArray();
        for (const sc of scripts) {
          const content = cheerio$(sc).html() || '';
          const m = content.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+_-]+\._SL\d+_\.jpg/g);
          if (m && m[0]) return m[0];
        }
        // Fallback: scan full HTML for any Amazon product image (various size tokens)
        const fullHtml = cheerio$.html() || '';
        const anyImg = fullHtml.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+_-]+\.(?:_SL\d+_|_AC_[A-Z0-9]+_|_S[XY]\d+_)\.?[a-zA-Z]*/g);
        if (anyImg && anyImg[0]) return anyImg[0].replace(/\.[a-zA-Z]*$/, '.jpg');
        return cheerio$('meta[property="og:image"]').attr('content') || null;
      };
      imageUrl = tryExtract($);
      // Retry for home-360 or targeted run if first fetch didn't get image
      const shouldRetry = !imageUrl && (product.category === 'home-360' || isTargetedRun);
      if (shouldRetry) {
        for (let attempt = 0; attempt < (isTargetedRun ? 2 : 1); attempt++) {
          await new Promise((r) => setTimeout(r, isTargetedRun ? 5000 : 4000));
          try {
            $ = await fetchAmazonPage(productLink);
            imageUrl = tryExtract($);
            if (imageUrl) break;
          } catch (e) {}
        }
      }
      if (imageUrl) {
        imageUrl = imageUrl.split('?')[0];
        if (imageUrl.includes('m.media-amazon.com')) {
          imageUrl = imageUrl
            .replace(/_S[XY]\d+_/g, '_SL1500_')
            .replace(/_SL\d+_/g, '_SL1500_')
            .replace(/_AC_[A-Z0-9]+_/g, '_SL1500_');
          if (!imageUrl.endsWith('.jpg')) imageUrl = imageUrl.replace(/\.[a-zA-Z]*$/, '.jpg');
        }
        product.image_url = imageUrl;
        updatedCount++;
        console.log(`  ✅ Updated image: ${imageUrl.substring(0, 80)}...`);
      } else {
        failedCount++;
        console.log(`  ❌ Failed to extract image`);
      }

      // Update title from Amazon for home-360 so display shows actual product name
      const home360Subcategories = [
        'cinematic-home-screens',
        'cooltech-refrigerators',
        'laundry-intelligence',
        'modern-kitchen-powerhouse',
        'pure-water-systems',
        'autoclean-systems',
        'dishcare-appliances',
      ];
      if (product.category === 'home-360' && home360Subcategories.includes(product.subcategory)) {
        const amazonTitle = extractTitleFromPage($);
        if (amazonTitle) {
          product.title = amazonTitle;
          console.log(`  📝 Updated title: ${amazonTitle.substring(0, 60)}...`);
        }
      }

      // Delay to avoid rate limiting
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Write updated products back to file (always save full list)
    fs.writeFileSync(productsFile, JSON.stringify(allProducts, null, 2), 'utf-8');

    console.log('='.repeat(60));
    console.log('✅ Update complete!');
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Failed: ${failedCount}`);
    console.log(`   Skipped (already had images): ${skippedCount}`);
    console.log(`   Processed: ${products.length}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

const targetIds = process.argv.find((a) => a.startsWith('--ids='));
const idList = targetIds
  ? targetIds.replace('--ids=', '').split(',').map((s) => s.trim()).filter(Boolean)
  : null;

console.log('🚀 Starting product image update...');
if (idList?.length) {
  console.log(`Target IDs only: ${idList.join(', ')}`);
} else {
  console.log('This will update all products with placeholder images (51nBTTG3hNL)');
}
console.log('⚠️  This may take a while (2 seconds delay between requests)');
console.log('='.repeat(60));
updateProductsWithImages();

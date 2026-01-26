# Product images from your links

Products that still use the **generic placeholder** image (`51nBTTG3hNL`) are shown a **subcategory fallback** image (from `src/lib/productImage.ts`). To use the **real product image** from each product link, you can do either of the following.

## Option 1: Run the image + description update script (recommended)

Use the script to visit each product link, extract the **product title** (as on the Amazon page), the **first product image only** (main hero image; thumbnails are skipped), and optionally the **real description** from Amazon, and update `src/data/products.json`.

**Node (follows redirects, works with amzn.to):**
```bash
cd c:\Users\bihar\Desktop\simplyfinds-main
npm install axios cheerio   # if not already installed
node scripts/update_images.mjs
```

To refresh **only title + image** and keep your custom “Why this” descriptions (e.g. for Micro-Startup and Home 360), run:
```bash
node scripts/update_images.mjs --no-description
```

To **re-fetch the main product image for every product** (fix wrong or duplicate images so each link shows its own image), run:
```bash
node scripts/update_images.mjs --no-description --force-all
```

If many products fail with “title mismatch” (e.g. amzn.to lands on the right product but wording differs), run with **relaxed title check** (still requires a real product page: `/dp/` or `/gp/product/`):
```bash
node scripts/update_images.mjs --no-description --relax-title
```

**Python:**
```bash
cd c:\Users\bihar\Desktop\simplyfinds-main
pip install -r scripts/requirements.txt
python scripts/update_product_images.py
```

- The script only processes products whose `image_url` is the generic placeholder.
- It uses each product’s `product_link` (including amzn.to). From the Amazon page it extracts:
  - **Title:** main product name (`#productTitle` or `h1`).
  - **Image:** same as importProducts.js (Gifting & Tech) — `#landingImage` first, then DOM selectors, then `og:image` last. Only saved when page is a real product (`/dp/` or `/gp/product/`) and title matches, so wrong/captcha pages don't overwrite. Thumbnails never used.
  - **Description:** from feature bullets, product description, or meta tags (only when not using `--no-description`).
- On the website, thumbnail-sized Amazon URLs are treated as “no image” and the subcategory fallback is shown instead.
- Saves after each successful update. 2-second delay between requests.

After a run, updated products show the real Amazon image and description; the UI already uses `getProductImageUrl(product)` and `product.description`.

**If your updates don’t show on the website:** Restart the dev server (`npm run dev`) or do a hard refresh (Ctrl+Shift+R). For production, run `npm run build` again.

**How to know if images were updated:** After the script runs it prints “Updated: X” (products that got a new image from their link). It also lists **product IDs that still use the placeholder** at the end — those need a better product link or a manual `image_url` in `products.json`. In the JSON, any `image_url` that is not `51nBTTG3hNL` is a real product image.

## Option 2: Manual copy for one product

1. Open the product’s link (e.g. open the amzn.to URL in the browser and go to the Amazon product page).
2. Right‑click the **main product image** → **Copy image address**.
3. In `src/data/products.json`, find that product by `id` and set `image_url` to the copied URL (e.g. `https://m.media-amazon.com/images/I/xxxx._SL1500_.jpg`).

The same format as other products (e.g. `micro-startup-1`, `home360-fridge-7`) is used automatically when you paste an Amazon media URL.

## Notes

- **Generic placeholder:** If `image_url` is exactly  
  `https://m.media-amazon.com/images/I/51nBTTG3hNL._SL1500_.jpg`,  
  the app treats it as “no image” and uses the subcategory fallback. Any other Amazon media URL you set is used as the product image.
- **Direct Amazon links:** If you have a direct link like `https://www.amazon.in/dp/B0DK5MNPY8`, the script can use it as-is. For amzn.to links, the script relies on redirects; if you get interstitials or errors, run the script from your machine or add images manually as in Option 2.

### Remaining placeholders
Some products may keep the generic placeholder (and show the subcategory fallback) if the script never gets a valid product page (e.g. location/captcha after amzn.to). For those, use Option 2 (manual image URL) or replace the link in `products.json` with a direct `https://www.amazon.in/dp/...` and run the script again. The feature is **complete**: script, app logic, and docs are aligned with Gifting & Tech; any remaining placeholders are due to link/redirect limits, not code.

### Code recheck (image behaviour)
- **Single source of truth:** Category and Subcategory pages use `products.json` only. Product images are resolved by `getProductImageUrl()` in `src/lib/productImage.ts`.
- **Resolution order:** The helper uses (in order) `image`, `amazonImageUrl`, `image_url`, so it works with both Product (`image_url`) and SubcategoryProduct (`image` / `amazonImageUrl`) shapes.
- **Why “same image” for many products:** Any product whose resolved URL is the generic placeholder (`51nBTTG3hNL`) gets the **subcategory fallback** image. So all such products in the same subcategory (e.g. Micro-Startup Toolkit, Robot Vacuums) show the same fallback until `products.json` is updated with real Amazon image URLs for each.
- **Fix for wrong/duplicate images:** Run the update script so each product gets the first product image from its link. Recommended:  
  `node scripts/update_images.mjs --no-description --relax-title`  
  Optionally add `--force-all` to re-fetch every product image.  
  If many products still show the same or wrong image, check the script output for “Updated: N” and any product IDs that still use the placeholder; fix those via Option 2 or by correcting the product link and re-running the script.

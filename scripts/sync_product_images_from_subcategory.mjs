/**
 * Sync product images from subcategoryProducts.json into products.json.
 * For every product in products.json whose id exists in subcategoryProducts,
 * set image_url to that product's first image (image or amazonImageUrl).
 * Only applies when subcategoryProducts has a non-placeholder image.
 * This ensures: no wrong/placeholder in products.json for tech products,
 * and same image as on Subcategory page (which uses subcategoryProducts).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, "..", "src", "data", "products.json");
const subPath = path.join(__dirname, "..", "src", "data", "subcategoryProducts.json");

const GENERIC_PLACEHOLDER = "https://m.media-amazon.com/images/I/51nBTTG3hNL._SL1500_.jpg";

function collectSubcategoryImages(data) {
  const byId = {};
  if (!data || typeof data !== "object") return byId;
  for (const categoryId of Object.keys(data)) {
    const subcats = data[categoryId];
    if (!subcats || typeof subcats !== "object") continue;
    for (const subSlug of Object.keys(subcats)) {
      const groups = subcats[subSlug];
      if (!groups || typeof groups !== "object") continue;
      for (const groupName of Object.keys(groups)) {
        const list = groups[groupName];
        if (!Array.isArray(list)) continue;
        for (const p of list) {
          if (p && p.id) {
            const img = (p.image || p.amazonImageUrl || "").trim();
            if (img && img !== GENERIC_PLACEHOLDER) {
              byId[p.id] = img;
            }
          }
        }
      }
    }
  }
  return byId;
}

function main() {
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  const sub = JSON.parse(fs.readFileSync(subPath, "utf-8"));
  const imageById = collectSubcategoryImages(sub);

  let updated = 0;
  for (const p of products) {
    if (!p.id) continue;
    const subImage = imageById[p.id];
    if (!subImage) continue;
    const current = (p.image_url || "").trim();
    if (current === subImage) continue;
    p.image_url = subImage;
    updated++;
  }

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), "utf-8");
  console.log(`Synced ${updated} product image(s) from subcategoryProducts to products.json.`);
}

main();

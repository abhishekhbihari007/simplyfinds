/**
 * Product image helpers: treat generic placeholder as missing and use
 * subcategory-specific placeholder images so cards show relevant visuals.
 */

const GENERIC_PLACEHOLDER =
  "https://m.media-amazon.com/images/I/51nBTTG3hNL._SL1500_.jpg";

// Thumbnail/small sizes (e.g. _AC_SS115_, _AC_US40_) — treat as no image so fallback shows
const THUMBNAIL_PATTERN = /_AC_(?:SS|US)\d+_/;

// Small/medium Amazon size tokens (_SY450_, _SX342_, etc.) — normalize to main image size
// so we show the product's first/main image at full quality instead of a gallery thumb
const SMALL_SIZE_PATTERN = /_(?:SY|SX)\d+_/;
const MAIN_IMAGE_SIZE = "_SL1500_";

const SUBCATEGORY_IMAGES: Record<string, string> = {
  "micro-startup-toolkit":
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80",
  "cinematic-home-screens":
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80",
  "cooltech-refrigerators":
    "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80",
  "laundry-intelligence":
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80",
  "modern-kitchen-powerhouse":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  "pure-water-systems":
    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80",
  "autoclean-systems":
    "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80",
  "dishcare-appliances":
    "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80",
  "smart-tvs":
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80",
  refrigerators:
    "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80",
  "washing-machines":
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80",
  "kitchen-appliances":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  "water-purifiers":
    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80",
  "robot-vacuums":
    "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80",
  dishwashers:
    "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80",
  "smart-home-security":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "wfh-comfort":
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
  "budget-laptops":
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  "gaming-laptops":
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80",
  "audio-gadgets":
    "https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&q=80",
  "smart-gadgets":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
};

export const PLACEHOLDER_IMAGE_URL = GENERIC_PLACEHOLDER;

export interface ProductForImage {
  image_url?: string;
  /** SubcategoryProduct / import shape: preferred when present */
  image?: string;
  amazonImageUrl?: string;
  subcategory?: string;
  category?: string;
}

/**
 * Resolves the best image URL. Uses (in order): image, amazonImageUrl, image_url.
 * Same concept as Gifting & Tech: real Amazon first-image from the product link.
 * If resolved URL is generic placeholder or missing, returns subcategory fallback.
 */
export function getProductImageUrl(product: ProductForImage): string | undefined {
  const raw =
    product.image?.trim() ||
    product.amazonImageUrl?.trim() ||
    product.image_url?.trim();
  const sub = product.subcategory ?? "";
  const subcategoryPlaceholder = SUBCATEGORY_IMAGES[sub];
  const isGenericPlaceholder =
    !raw ||
    raw === GENERIC_PLACEHOLDER ||
    (raw.includes("unsplash.com") && raw === subcategoryPlaceholder);
  if (isGenericPlaceholder) {
    return subcategoryPlaceholder ?? undefined;
  }
  // Don’t use thumbnail/small Amazon URLs — show subcategory fallback instead
  if (THUMBNAIL_PATTERN.test(raw)) {
    return subcategoryPlaceholder ?? undefined;
  }
  let finalUrl = raw;
  if (raw.includes("m.media-amazon.com") && SMALL_SIZE_PATTERN.test(raw)) {
    finalUrl = raw.replace(/_(?:SY|SX)\d+_/g, MAIN_IMAGE_SIZE);
  }
  return finalUrl;
}

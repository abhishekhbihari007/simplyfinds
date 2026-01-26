# Product Import Scripts

## Overview
Scripts for importing product details from Amazon URLs for affiliate websites. These scripts are designed to prevent stale variable bugs where image URLs from previous products leak into current products.

## Key Features

### ✅ Fixed Stale Variable Bug
- **Explicit variable reset**: `imageUrl` is explicitly set to `null` at the start of each iteration
- **Isolated scope**: Each product processing is isolated to prevent data leakage
- **Null safety**: If no image is found, returns `null` (not previous product's image)

### 🔧 Two Implementation Approaches

1. **`importProducts`** - Traditional for loop with explicit resets
2. **`importProductsFunctional`** - Functional approach using `map()` for better scope isolation

## Installation

### JavaScript/TypeScript Version
```bash
npm install axios cheerio
# For TypeScript
npm install axios cheerio @types/cheerio @types/node
```

### Python Version
```bash
pip install -r scripts/requirements.txt
# or
pip install requests beautifulsoup4 lxml
```

## Usage

### JavaScript Version

```javascript
const { importProducts } = require('./scripts/importProducts.js');

const urls = [
  'https://amzn.to/3NhWXon',
  'https://amzn.to/3Nz38nT',
  // ... more URLs
];

const products = await importProducts(urls, {
  usePlaceholder: false,        // Use placeholder if no image found
  placeholderImage: 'https://...', // Custom placeholder
  delayBetweenRequests: 2000    // Delay in ms between requests
});
```

### TypeScript Version

```typescript
import { importProducts } from './scripts/importProducts';

const urls: string[] = [
  'https://amzn.to/3NhWXon',
  'https://amzn.to/3Nz38nT',
];

const products = await importProducts(urls, {
  usePlaceholder: false,
  delayBetweenRequests: 2000
});
```

## Critical Fixes Applied

### 1. Explicit Variable Reset
```javascript
// ❌ BEFORE (Buggy):
let imageUrl; // Undefined, can hold previous value

// ✅ AFTER (Fixed):
let imageUrl = null; // Explicitly reset at start of each iteration
```

### 2. Isolated Processing
```javascript
// Each iteration explicitly resets imageUrl
for (let i = 0; i < urls.length; i++) {
  let imageUrl = null; // ← CRITICAL: Reset at start
  // ... process product
  imageUrl = null; // ← CRITICAL: Clear at end
}
```

### 3. Null Safety
```javascript
// If no image found, explicitly return null
if (!imageUrl || imageUrl === 'undefined') {
  imageUrl = null; // Not previous product's image
}
```

## Output Format

```javascript
{
  id: "product-1",
  url: "https://amzn.to/...",
  title: "Product Name",
  imageUrl: "https://m.media-amazon.com/images/I/..." | null,
  price: "₹1,000",
  description: "Product description",
  extractedAt: "2026-01-22T16:50:00.000Z"
}
```

## Error Handling

- If a product fails to process, `imageUrl` is explicitly set to `null`
- Previous product's image will NEVER leak into failed products
- Error details are included in the returned object

## Best Practices

1. **Always use explicit null initialization**: `let imageUrl = null;`
2. **Clear variables at end of iteration**: Prevents closure issues
3. **Use functional approach for better isolation**: `importProductsFunctional()`
4. **Add delays between requests**: Avoid rate limiting
5. **Validate extracted data**: Check for stale data before saving

## Testing

Test with a mix of URLs:
- URLs with images
- URLs without images
- Invalid URLs
- URLs that timeout

Verify that each product gets its own image or `null`, never a previous product's image.

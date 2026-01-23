"""
Update All Product Images Script
Reads products.json, visits each Amazon link, extracts the correct product image,
and updates products.json with the correct image URLs.
This script specifically targets products with placeholder images (51nBTTG3hNL).
"""

import json
import os
import time
import requests
from bs4 import BeautifulSoup

def extract_image_from_amazon(url):
    """
    Extract the main product image from an Amazon product page
    Returns the image URL or None if not found
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Try multiple selectors for the main product image
        image_selectors = [
            {'id': 'landingImage'},
            {'id': 'main-image'},
            {'id': 'imgBlkFront'},
            {'class': 'a-dynamic-image'},
        ]
        
        for selector in image_selectors:
            img_element = soup.find('img', selector)
            if img_element:
                # Try data-src first (lazy loaded), then src
                image_url = (
                    img_element.get('data-src') or
                    img_element.get('src') or
                    None
                )
                
                if image_url:
                    # Clean up the URL - remove query parameters
                    image_url = image_url.split('?')[0]
                    # Ensure it's a full URL
                    if image_url and not image_url.startswith('http'):
                        if image_url.startswith('//'):
                            image_url = f'https:{image_url}'
                        else:
                            image_url = f'https://{image_url}'
                    
                    # Validate it's an Amazon media image
                    if 'media-amazon.com' in image_url or 'images-amazon.com' in image_url:
                        return image_url
        
        # Fallback to Open Graph image
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            og_image_url = og_image.get('content').strip()
            if og_image_url:
                return og_image_url.split('?')[0]
        
        return None
        
    except Exception as error:
        print(f"  ⚠️  Error extracting image: {str(error)}")
        return None


def update_products_with_images():
    """
    Update products.json with correct product images
    """
    file_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'products.json')
    
    try:
        # Read existing products
        with open(file_path, 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        print(f"Found {len(products)} products to check")
        print("=" * 60)
        
        updated_count = 0
        failed_count = 0
        skipped_count = 0
        
        for i, product in enumerate(products, 1):
            product_link = product.get('product_link')
            product_title = product.get('title', 'Unknown')
            current_image = product.get('image_url', '')
            
            # Skip if already has a valid non-placeholder image
            if current_image and '51nBTTG3hNL' not in current_image:
                skipped_count += 1
                continue
            
            if not product_link:
                print(f"[{i}/{len(products)}] ⚠️  {product_title[:50]}... (no link)")
                failed_count += 1
                continue
            
            print(f"[{i}/{len(products)}] Processing: {product_title[:50]}...")
            print(f"  Link: {product_link}")
            
            # Extract image from Amazon
            new_image_url = extract_image_from_amazon(product_link)
            
            if new_image_url:
                product['image_url'] = new_image_url
                updated_count += 1
                print(f"  ✅ Updated image: {new_image_url[:80]}...")
            else:
                failed_count += 1
                print(f"  ❌ Failed to extract image")
            
            # Delay to avoid rate limiting
            if i < len(products):
                time.sleep(2)
        
        # Write updated products back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        
        print("=" * 60)
        print(f"✅ Update complete!")
        print(f"   Updated: {updated_count}")
        print(f"   Failed: {failed_count}")
        print(f"   Skipped (already had images): {skipped_count}")
        print(f"   Total: {len(products)}")
        
    except FileNotFoundError:
        print(f"❌ Error: File not found at {file_path}")
    except json.JSONDecodeError:
        print(f"❌ Error: Invalid JSON in {file_path}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")


if __name__ == '__main__':
    print("🚀 Starting product image update...")
    print("This will update all products with placeholder images (51nBTTG3hNL)")
    print("=" * 60)
    update_products_with_images()

"""
Product Scraping Script for Affiliate Website
Scrapes product data from Amazon URLs and exports to products.json

FIXED BUGS:
1. Stale Data: Explicitly resets product_title, product_description, and product_image to None at start of each iteration
2. Weak Selectors: Added Open Graph (og:title, og:description, og:image) fallback for reliable extraction
3. Image Validation: Validates image URLs and uses placeholder if invalid or missing
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from typing import List, Dict, Optional
from urllib.parse import urlparse
from datetime import datetime

# Default placeholder image if no valid image is found
DEFAULT_PLACEHOLDER_IMAGE = "default.png"

# Placeholder string for missing data
PLACEHOLDER_IMAGE = "default.png"


def is_valid_image_url(url: str) -> bool:
    """
    Validate if a URL is a valid image URL
    
    Args:
        url: URL to validate
        
    Returns:
        True if valid image URL, False otherwise
    """
    if not url or not isinstance(url, str):
        return False
    
    # Check if it's a valid URL format
    try:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return False
    except Exception:
        return False
    
    # Check if URL ends with valid image extension
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
    url_lower = url.lower()
    
    # Check if URL contains image extension
    has_extension = any(url_lower.endswith(ext) for ext in valid_extensions)
    
    # Also check if it's an Amazon media URL (common pattern)
    is_amazon_media = 'media-amazon.com' in url_lower or 'images-amazon.com' in url_lower
    
    return has_extension or is_amazon_media


def extract_product_details(url: str) -> Dict:
    """
    Extract product details from an Amazon URL
    
    CRITICAL FIX: All variables are explicitly reset to None at the start
    
    Args:
        url: Amazon product URL
        
    Returns:
        Dictionary with product details
    """
    # CRITICAL FIX #1: Explicitly reset all variables to None at the start
    product_title: Optional[str] = None
    product_description: Optional[str] = None
    product_image: Optional[str] = None
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # ============================================
        # EXTRACT PRODUCT TITLE
        # ============================================
        # CRITICAL FIX #1: Reset to None (already done above)
        product_title = None
        
        # Try multiple selectors for title
        title_selectors = [
            {'id': 'productTitle'},
            {'class': 'a-size-large'},
            {'data-automation-id': 'product-title'},
            {'class': 'a-size-large product-title-word-break'},
            {'id': 'title'},
        ]
        
        for selector in title_selectors:
            element = soup.find('h1', selector) or soup.find('span', selector)
            if element:
                product_title = element.get_text(strip=True)
                if product_title:
                    break
        
        # CRITICAL FIX #2: Fallback to Open Graph tags if main scraping fails
        if not product_title:
            og_title = soup.find('meta', property='og:title')
            if og_title and og_title.get('content'):
                product_title = og_title.get('content').strip()
        
        # If still no title, use placeholder
        if not product_title:
            product_title = "Product Title Not Found"
        
        # ============================================
        # EXTRACT PRODUCT DESCRIPTION
        # ============================================
        # CRITICAL FIX #1: Reset to None
        product_description = None
        
        # Try multiple selectors for description
        desc_selectors = [
            {'id': 'feature-bullets'},
            {'id': 'productDescription'},
            {'class': 'a-unordered-list'},
            {'data-automation-id': 'feature-bullets'},
        ]
        
        for selector in desc_selectors:
            element = soup.find('div', selector) or soup.find('ul', selector)
            if element:
                # Try to get first bullet point or paragraph
                desc_text = element.find('span') or element.find('li') or element.find('p')
                if desc_text:
                    product_description = desc_text.get_text(strip=True)
                    if product_description:
                        break
        
        # CRITICAL FIX #2: Fallback to Open Graph description
        if not product_description:
            og_desc = soup.find('meta', property='og:description')
            if og_desc and og_desc.get('content'):
                product_description = og_desc.get('content').strip()
        
        # Also try meta description
        if not product_description:
            meta_desc = soup.find('meta', {'name': 'description'})
            if meta_desc and meta_desc.get('content'):
                product_description = meta_desc.get('content').strip()
        
        # If still no description, use empty string
        if not product_description:
            product_description = ""
        
        # ============================================
        # EXTRACT PRODUCT IMAGE
        # ============================================
        # CRITICAL FIX #1: Reset to None
        product_image = None
        
        # Try multiple selectors for image
        image_selectors = [
            {'id': 'landingImage'},
            {'id': 'main-image'},
            {'id': 'imgBlkFront'},
            {'class': 'a-dynamic-image'},
            {'data-a-image-name': 'landingImage'},
            {'data-old-src': True},
            {'data-src': True},
        ]
        
        for selector in image_selectors:
            img_element = soup.find('img', selector)
            if img_element:
                # Try data-src first (lazy loaded), then src, then data-old-src
                image_url = (
                    img_element.get('data-src') or
                    img_element.get('src') or
                    img_element.get('data-old-src') or
                    None
                )
                
                if image_url:
                    # Clean up the URL
                    image_url = image_url.split('?')[0]
                    # Ensure it's a full URL
                    if image_url and not image_url.startswith('http'):
                        if image_url.startswith('//'):
                            image_url = f'https:{image_url}'
                        else:
                            image_url = f'https://{image_url}'
                    
                    # CRITICAL FIX #3: Validate image URL
                    if is_valid_image_url(image_url):
                        product_image = image_url
                        break
        
        # CRITICAL FIX #2: Fallback to Open Graph image
        if not product_image:
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                og_image_url = og_image.get('content').strip()
                # CRITICAL FIX #3: Validate Open Graph image URL
                if is_valid_image_url(og_image_url):
                    product_image = og_image_url
        
        # Also try Twitter card image
        if not product_image:
            twitter_image = soup.find('meta', {'name': 'twitter:image'})
            if twitter_image and twitter_image.get('content'):
                twitter_image_url = twitter_image.get('content').strip()
                # CRITICAL FIX #3: Validate Twitter image URL
                if is_valid_image_url(twitter_image_url):
                    product_image = twitter_image_url
        
        # CRITICAL FIX #3: Use placeholder if no valid image found
        if not product_image or not is_valid_image_url(product_image):
            product_image = PLACEHOLDER_IMAGE
        
        return {
            'url': url,
            'title': product_title,
            'description': product_description,
            'image_url': product_image,  # Always has a value (either valid URL or placeholder)
            'extracted_at': datetime.now().isoformat()
        }
        
    except Exception as error:
        print(f"Error extracting product from {url}: {str(error)}")
        
        # CRITICAL FIX #1: On error, explicitly return None/placeholder values
        return {
            'url': url,
            'title': None,
            'description': None,
            'image_url': PLACEHOLDER_IMAGE,  # CRITICAL FIX #3: Always use placeholder on error
            'error': str(error),
            'extracted_at': datetime.now().isoformat()
        }


def scrape_products(urls: List[str], delay_between_requests: float = 2.0) -> List[Dict]:
    """
    Process multiple product URLs and scrape their data
    
    CRITICAL FIX #1: Each iteration explicitly resets all variables to None
    
    Args:
        urls: List of Amazon product URLs
        delay_between_requests: Delay in seconds between requests
        
    Returns:
        List of product dictionaries ready for JSON export
    """
    products = []
    
    print(f"Starting to scrape {len(urls)} products...")
    print("=" * 60)
    
    # Process each URL - CRITICAL: Each iteration is isolated
    for i, url in enumerate(urls, 1):
        # CRITICAL FIX #1: Explicitly reset all variables to None at the start of each iteration
        # This prevents stale data from previous iterations
        product_title: Optional[str] = None
        product_description: Optional[str] = None
        product_image: Optional[str] = None
        
        print(f"\n[{i}/{len(urls)}] Processing: {url}")
        
        try:
            # Extract product details
            product_data = extract_product_details(url)
            
            # CRITICAL FIX #1: Explicitly assign values (not relying on closure)
            product_title = product_data.get('title')
            product_description = product_data.get('description')
            product_image = product_data.get('image_url')
            
            # Build product object for JSON export
            product = {
                'id': f'product-{i}',
                'title': product_title if product_title else "Product Title Not Found",
                'product_link': url,
                'image_url': product_image,  # Always has a value (valid URL or placeholder)
                'description': product_description if product_description else "",
                'category': '',  # You can add category mapping logic here
                'subcategory': '',  # You can add subcategory mapping logic here
                'extracted_at': product_data.get('extracted_at')
            }
            
            # Validation: Check for potential stale data
            if i > 1:
                prev_product = products[i - 2]
                if (product_image == prev_product.get('image_url') and 
                    product_title == prev_product.get('title') and
                    not product_data.get('title')):
                    print(f"⚠️  WARNING: Possible stale data detected for product {i}")
                    # Force reset to placeholder
                    product['image_url'] = PLACEHOLDER_IMAGE
                    product['title'] = "Product Title Not Found"
            
            products.append(product)
            
            print(f"✅ Success: Title='{product_title[:50] if product_title else 'N/A'}...'")
            print(f"   Image: {product_image}")
            
            # Add delay between requests to avoid rate limiting
            if i < len(urls):
                time.sleep(delay_between_requests)
                
        except Exception as error:
            print(f"❌ Failed: {str(error)}")
            
            # CRITICAL FIX #1: On error, explicitly set all fields (not previous product's data)
            products.append({
                'id': f'product-{i}',
                'title': None,
                'product_link': url,
                'image_url': PLACEHOLDER_IMAGE,  # CRITICAL FIX #3: Always use placeholder
                'description': None,
                'category': '',
                'subcategory': '',
                'error': str(error),
                'extracted_at': datetime.now().isoformat()
            })
        
        # CRITICAL FIX #1: Explicitly clear variables at end of iteration
        product_title = None
        product_description = None
        product_image = None
    
    print("\n" + "=" * 60)
    print(f"Scraping complete! Processed {len(products)} products.")
    
    return products


def export_to_json(products: List[Dict], output_file: str = "products.json"):
    """
    Export products to JSON file
    
    Args:
        products: List of product dictionaries
        output_file: Output file path
    """
    output_path = f"../src/data/{output_file}"
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Successfully exported {len(products)} products to {output_path}")
        return True
    except Exception as error:
        print(f"\n❌ Error exporting to JSON: {str(error)}")
        return False


def main():
    """
    Main function - Example usage
    """
    # Example list of Amazon URLs
    urls = [
        "https://amzn.to/3NhWXon",
        "https://amzn.to/3Nz38nT",
        "https://amzn.to/4r2i2Sk",
        # Add more URLs here
    ]
    
    # Scrape products
    products = scrape_products(urls, delay_between_requests=2.0)
    
    # Export to JSON
    export_to_json(products, "products.json")
    
    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY:")
    print(f"Total products: {len(products)}")
    print(f"Products with valid images: {sum(1 for p in products if p.get('image_url') != PLACEHOLDER_IMAGE)}")
    print(f"Products with placeholders: {sum(1 for p in products if p.get('image_url') == PLACEHOLDER_IMAGE)}")
    print("=" * 60)


if __name__ == '__main__':
    main()

"""
Update Tech Products Script
Extracts URLs from subcategoryProducts.json (tech category) and scrapes fresh data
Updates products.json with the scraped data
"""

import json
import os
import sys
from scrape_products import scrape_products, export_to_json

def extract_tech_urls_from_subcategory():
    """
    Extract all product URLs from subcategoryProducts.json for tech category
    """
    # Path to subcategoryProducts.json
    subcategory_file = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'subcategoryProducts.json')
    
    try:
        with open(subcategory_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        urls = []
        product_info = {}  # Store additional info like id, category, subcategory
        
        # Extract from tech category
        if 'tech' in data:
            tech_data = data['tech']
            
            # Iterate through all subcategories in tech
            for subcategory_slug, price_ranges in tech_data.items():
                # Iterate through price ranges (high-end, mid-range, etc.)
                for price_range, products in price_ranges.items():
                    # Iterate through products
                    for product in products:
                        if 'link' in product:
                            url = product['link']
                            urls.append(url)
                            
                            # Store product info for later use
                            product_info[url] = {
                                'id': product.get('id', ''),
                                'category': 'tech',
                                'subcategory': subcategory_slug,
                                'original_title': product.get('title', ''),
                                'original_description': product.get('description', ''),
                                'original_image': product.get('amazonImageUrl') or product.get('image', ''),
                                'price_range': price_range
                            }
        
        return urls, product_info
    
    except Exception as e:
        print(f"Error reading subcategoryProducts.json: {str(e)}")
        return [], {}


def merge_scraped_data_with_info(scraped_products, product_info):
    """
    Merge scraped data with original product info (id, category, subcategory)
    """
    merged_products = []
    
    for scraped in scraped_products:
        url = scraped.get('url') or scraped.get('product_link')
        info = product_info.get(url, {})
        
        # Use scraped data, but preserve original IDs and category info
        merged_product = {
            'id': info.get('id', scraped.get('id', '')),
            'title': scraped.get('title') or info.get('original_title', 'Product Title Not Found'),
            'product_link': url,
            'image_url': scraped.get('image_url', info.get('original_image', 'default.png')),
            'description': scraped.get('description') or info.get('original_description', ''),
            'category': info.get('category', 'tech'),
            'subcategory': info.get('subcategory', ''),
            'extracted_at': scraped.get('extracted_at', '')
        }
        
        # Add price_range if available
        if info.get('price_range'):
            merged_product['price_range'] = info.get('price_range')
        
        merged_products.append(merged_product)
    
    return merged_products


def update_products_json(new_tech_products):
    """
    Update products.json by:
    1. Reading existing products.json
    2. Removing old tech products
    3. Adding new scraped tech products
    4. Keeping non-tech products intact
    """
    products_file = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'products.json')
    
    try:
        # Read existing products
        with open(products_file, 'r', encoding='utf-8') as f:
            existing_products = json.load(f)
        
        # Filter out old tech products
        non_tech_products = [p for p in existing_products if p.get('category') != 'tech']
        
        # Combine: non-tech products + new tech products
        updated_products = non_tech_products + new_tech_products
        
        # Write back to file
        with open(products_file, 'w', encoding='utf-8') as f:
            json.dump(updated_products, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Successfully updated products.json")
        print(f"   Removed: {len(existing_products) - len(non_tech_products)} old tech products")
        print(f"   Added: {len(new_tech_products)} new tech products")
        print(f"   Kept: {len(non_tech_products)} non-tech products")
        print(f"   Total: {len(updated_products)} products")
        
        return True
    
    except Exception as e:
        print(f"\n❌ Error updating products.json: {str(e)}")
        return False


def main():
    print("=" * 60)
    print("TECH PRODUCTS UPDATE SCRIPT")
    print("=" * 60)
    
    # Step 1: Extract URLs from subcategoryProducts.json
    print("\n[Step 1] Extracting tech product URLs from subcategoryProducts.json...")
    urls, product_info = extract_tech_urls_from_subcategory()
    
    if not urls:
        print("❌ No tech product URLs found!")
        return
    
    print(f"✅ Found {len(urls)} tech product URLs")
    
    # Step 2: Scrape products
    print(f"\n[Step 2] Scraping {len(urls)} products...")
    print("This may take a while. Please wait...\n")
    
    scraped_products = scrape_products(urls, delay_between_requests=2.0)
    
    # Step 3: Merge scraped data with original product info
    print(f"\n[Step 3] Merging scraped data with product info...")
    merged_products = merge_scraped_data_with_info(scraped_products, product_info)
    
    # Step 4: Update products.json
    print(f"\n[Step 4] Updating products.json...")
    update_products_json(merged_products)
    
    print("\n" + "=" * 60)
    print("UPDATE COMPLETE!")
    print("=" * 60)


if __name__ == '__main__':
    main()

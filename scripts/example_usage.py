"""
Example usage of scrape_products.py

This script demonstrates how to use the product scraping script
to scrape Amazon URLs and export to products.json
"""

from scrape_products import scrape_products, export_to_json

def main():
    # List of Amazon affiliate URLs to scrape
    urls = [
        "https://amzn.to/3NhWXon",
        "https://amzn.to/3Nz38nT",
        "https://amzn.to/4r2i2Sk",
        # Add more URLs here as needed
    ]
    
    print("=" * 60)
    print("PRODUCT SCRAPING EXAMPLE")
    print("=" * 60)
    
    # Scrape products with 2 second delay between requests
    # Increase delay if you encounter rate limiting
    products = scrape_products(urls, delay_between_requests=2.0)
    
    # Export to products.json in src/data directory
    success = export_to_json(products, "products.json")
    
    if success:
        print("\n✅ Products successfully exported!")
        print(f"   File: src/data/products.json")
        print(f"   Products: {len(products)}")
    else:
        print("\n❌ Failed to export products")
    
    return products

if __name__ == '__main__':
    main()

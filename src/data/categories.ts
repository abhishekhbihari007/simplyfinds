export interface SubCategory {
  name: string;
  slug: string;
  image?: string;
}

export interface Category {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: "travel",
    title: "Travel & Adventure",
    emoji: "✈️",
    description: "Gear up for your next adventure with curated travel essentials",
    color: "from-teal-400/20 to-cyan-500/20",
    subcategories: [
      { 
        name: "Snow & Cold Travel Essentials", 
        slug: "snow-cold-travel",
        image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Himalayan Trek Essentials", 
        slug: "himalayan-trek",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Mountain Trek Essentials", 
        slug: "mountain-trek",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Flight Travel Must-Haves", 
        slug: "flight-travel",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Monsoon Essentials for India", 
        slug: "monsoon-essentials",
        image: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
    ],
  },
  {
    id: "home-360",
    title: "Home 360",
    emoji: "🏠",
    description: "Cinematic screens, cooltech appliances, laundry, kitchen, water, cleaning & dishcare",
    color: "from-emerald-400/20 to-teal-500/20",
    subcategories: [
      {
        name: "Smart TVs – From compact to big screen",
        slug: "cinematic-home-screens",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      {
        name: "CoolTech Appliances – Refrigerators",
        slug: "cooltech-refrigerators",
        image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      {
        name: "Laundry Intelligence",
        slug: "laundry-intelligence",
        image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      {
        name: "Modern Kitchen Powerhouse",
        slug: "modern-kitchen-powerhouse",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      {
        name: "Pure Water Systems",
        slug: "pure-water-systems",
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      {
        name: "AutoClean Systems",
        slug: "autoclean-systems",
        image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      {
        name: "DishCare Appliances",
        slug: "dishcare-appliances",
        image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
    ],
  },
  {
    id: "productivity",
    title: "Work, Setup & Productivity",
    emoji: "💻",
    description: "Optimize your workspace and boost productivity",
    color: "from-cyan-400/20 to-teal-500/20",
    subcategories: [
      { 
        name: "Work From Home Comfort Essentials", 
        slug: "wfh-comfort",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Micro-Startup Toolkit (ideas)", 
        slug: "micro-startup-toolkit",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
    ],
  },
  {
    id: "gifting",
    title: "Gifting & Decor",
    emoji: "🎁",
    description: "Perfect gifts and stunning home decor ideas",
    color: "from-rose-400/20 to-coral-500/20",
    subcategories: [
      { 
        name: "Secret Santa Gift Ideas", 
        slug: "secret-santa",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Festive Decor", 
        slug: "festive-decor",
        image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Unique Home Decoration Items", 
        slug: "home-decor",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Vastu Decor", 
        slug: "vastu-decor",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
    ],
  },
  {
    id: "tech",
    title: "Tech Picks",
    emoji: "🎮",
    description: "The latest and greatest in technology and gadgets",
    color: "from-sky-400/20 to-indigo-500/20",
    subcategories: [
      { 
        name: "Best Laptops Under ₹30,000", 
        slug: "budget-laptops",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Gaming Laptops", 
        slug: "gaming-laptops",
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Audio Gadgets for Everyday Use", 
        slug: "audio-gadgets",
        image: "https://images.unsplash.com/photo-1545127398-14699f92334b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      { 
        name: "Smart Gadgets That Are Actually Useful", 
        slug: "smart-gadgets",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
    ],
  },
];

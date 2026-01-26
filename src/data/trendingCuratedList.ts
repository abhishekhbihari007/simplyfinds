/**
 * Trending curated list links for the home page.
 * Trek and Secret Santa vary by season/month.
 */

export interface CuratedListItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  subcategorySlug: string;
  emoji: string;
  /** Show only when condition is met (e.g. month or season). If absent, always show. */
  showWhen?: () => boolean;
}

const getMonth = () => new Date().getMonth(); // 0–11

/** Secret Santa: show in November (10) and December (11) */
const isSecretSantaSeason = () => {
  const m = getMonth();
  return m === 10 || m === 11;
};

/** Trek: seasonal focus. Winter = Snow & Cold; Jun–Sep = Monsoon; else Himalayan/Mountain. */
const getTrekSubcategory = (): { slug: string; title: string } => {
  const m = getMonth();
  if (m >= 11 || m <= 1) {
    return { slug: "snow-cold-travel", title: "Snow & Cold Travel" };
  }
  if (m >= 5 && m <= 8) {
    return { slug: "monsoon-essentials", title: "Monsoon Essentials" };
  }
  if (m >= 2 && m <= 4) {
    return { slug: "himalayan-trek", title: "Himalayan Trek" };
  }
  return { slug: "mountain-trek", title: "Mountain Trek" };
};

/** Build list with seasonal/month-based entries included only when active. */
export function getTrendingCuratedList(): CuratedListItem[] {
  const trek = getTrekSubcategory();
  const list: CuratedListItem[] = [
    {
      id: "startup",
      title: "Startup one",
      description: "Micro-startup toolkit & ideas",
      categoryId: "productivity",
      subcategorySlug: "micro-startup-toolkit",
      emoji: "💡",
    },
    {
      id: "smart-things",
      title: "Smart things you need",
      description: "Smart gadgets that are actually useful",
      categoryId: "tech",
      subcategorySlug: "smart-gadgets",
      emoji: "📱",
    },
    {
      id: "trek",
      title: "Trek ones",
      description: trek.title,
      categoryId: "travel",
      subcategorySlug: trek.slug,
      emoji: "🥾",
    },
    {
      id: "secret-santa",
      title: "Secret Santa",
      description: "Gift ideas for Secret Santa",
      categoryId: "gifting",
      subcategorySlug: "secret-santa",
      emoji: "🎁",
      showWhen: isSecretSantaSeason,
    },
    {
      id: "gaming-laptops",
      title: "Gaming laptops",
      description: "Best gaming laptops",
      categoryId: "tech",
      subcategorySlug: "gaming-laptops",
      emoji: "🎮",
    },
    {
      id: "home-tv",
      title: "Smart TVs",
      description: "From compact to big screen",
      categoryId: "home-360",
      subcategorySlug: "cinematic-home-screens",
      emoji: "📺",
    },
    {
      id: "home-dishcare",
      title: "DishCare",
      description: "Dishwashers & dishcare",
      categoryId: "home-360",
      subcategorySlug: "dishcare-appliances",
      emoji: "🍽️",
    },
    {
      id: "home-fridge",
      title: "Refrigerators",
      description: "CoolTech refrigerators",
      categoryId: "home-360",
      subcategorySlug: "cooltech-refrigerators",
      emoji: "🧊",
    },
  ];

  return list.filter((item) => (item.showWhen ? item.showWhen() : true));
}

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getTrendingCuratedList } from "@/data/trendingCuratedList";

const TrendingCuratedList = () => {
  const items = getTrendingCuratedList();

  return (
    <section className="py-10 px-4 md:px-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-2 text-center">
          Trending curated list
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto">
          Quick links to handpicked lists — seasonal picks update automatically.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/category/${item.categoryId}/${item.subcategorySlug}`}
              className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-teal-50 hover:border-teal-200 transition-all"
            >
              <span className="text-2xl flex-shrink-0" aria-hidden>
                {item.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-teal-700">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCuratedList;

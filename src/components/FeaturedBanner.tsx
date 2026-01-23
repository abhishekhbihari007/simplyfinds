import { TrendingUp, Zap, Award } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Trending Finds",
    description: "Popular products people are discovering right now",
  },
  {
    icon: Zap,
    title: "Smart Picks",
    description: "Useful products shortlisted for everyday needs",
  },
  {
    icon: Award,
    title: "Worth Buying",
    description: "Products that offer real value for money",
  },
];

const FeaturedBanner = () => {
  return (
    <section className="py-10 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-teal-50 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="w-16 h-16 rounded-xl bg-teal-100 flex items-center justify-center mb-4"
                  aria-hidden="true"
                >
                  <feature.icon className="w-8 h-8 text-teal-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBanner;

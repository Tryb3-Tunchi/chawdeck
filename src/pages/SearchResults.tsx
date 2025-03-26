import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import RestaurantCard from "../components/restaurant/RestaurantCard";
import { useApi } from "../hooks/useApi";
import { Restaurant } from "../services/api";
import { motion } from "framer-motion";

const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "deliveryTime", label: "Delivery Time" },
  { value: "minOrder", label: "Minimum Order" },
] as const;

interface Filters {
  cuisine: string;
  priceRange: string;
  dietary: string[];
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [sortBy, setSortBy] =
    useState<(typeof SORT_OPTIONS)[number]["value"]>("rating");
  const [filters, setFilters] = useState<Filters>({
    cuisine: "",
    priceRange: "",
    dietary: [],
  });

  const {
    data: restaurants,
    loading,
    error,
  } = useApi<Restaurant[]>("/restaurants");

  const filteredRestaurants = restaurants?.filter((restaurant) => {
    // Search query filter
    const matchesQuery =
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.menu.some(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );

    // Cuisine filter
    const matchesCuisine =
      !filters.cuisine || restaurant.cuisine === filters.cuisine;

    // Price range filter
    const matchesPriceRange =
      !filters.priceRange ||
      (() => {
        const avgPrice =
          restaurant.menu.reduce((sum, item) => sum + item.price, 0) /
          restaurant.menu.length;
        switch (filters.priceRange) {
          case "low":
            return avgPrice < 10;
          case "medium":
            return avgPrice >= 10 && avgPrice <= 20;
          case "high":
            return avgPrice > 20;
          default:
            return true;
        }
      })();

    return matchesQuery && matchesCuisine && matchesPriceRange;
  });

  const sortedRestaurants = filteredRestaurants?.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "deliveryTime":
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      case "minOrder":
        return a.minOrder - b.minOrder;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="md:w-72 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-semibold mb-6">Filters</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Type
                </label>
                <select
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  value={filters.cuisine}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, cuisine: e.target.value }))
                  }
                >
                  <option value="">All Cuisines</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Nigerian">Nigerian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  value={filters.priceRange}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: e.target.value,
                    }))
                  }
                >
                  <option value="">All Prices</option>
                  <option value="low">$ (Under $10)</option>
                  <option value="medium">$$ ($10-$20)</option>
                  <option value="high">$$$ (Over $20)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dietary Preferences
                </label>
                <div className="space-y-3">
                  {["Vegetarian", "Vegan", "Gluten-Free"].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary/20"
                        checked={filters.dietary.includes(option.toLowerCase())}
                        onChange={(e) => {
                          const value = option.toLowerCase();
                          setFilters((prev) => ({
                            ...prev,
                            dietary: e.target.checked
                              ? [...prev.dietary, value]
                              : prev.dietary.filter((item) => item !== value),
                          }));
                        }}
                      />
                      <span className="ml-2 text-gray-600">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {loading
                  ? "Searching..."
                  : error
                  ? "Error loading results"
                  : `Found ${
                      sortedRestaurants?.length || 0
                    } results for "${query}"`}
              </h1>
              <select
                className="w-full sm:w-auto rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 font-medium">
                Error loading restaurants
              </div>
              <p className="text-gray-500 mt-2">Please try again later</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : sortedRestaurants?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 font-medium">
                No restaurants found
              </div>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedRestaurants?.map((restaurant) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RestaurantCard
                    id={restaurant.id}
                    name={restaurant.name}
                    image={restaurant.image}
                    rating={restaurant.rating}
                    cuisine={restaurant.cuisine}
                    deliveryTime={restaurant.deliveryTime}
                    minOrder={restaurant.minOrder}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

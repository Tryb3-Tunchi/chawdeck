import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import RestaurantCard from "../components/restaurant/RestaurantCard";
import { useApi } from "../hooks/useApi";
import { Restaurant } from "../services/api";

const categories = [
  "All",
  "Nigerian",
  "Chinese",
  "Fast Food",
  "Italian",
  "Indian",
  "Japanese",
  "Mexican",
  "Beverages",
];

export default function Restaurants() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: restaurants,
    loading,
    error,
  } = useApi<Restaurant[]>("/restaurants");

  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];

    return restaurants.filter((restaurant) => {
      const matchesCategory =
        selectedCategory === "All" || restaurant.cuisine === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.menu.some(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [restaurants, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      {/* Search and Filters */}
      <div className="space-y-6 mb-8">
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary text-sm"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Categories */}
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">Loading restaurants...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Error loading restaurants
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium mb-2">No restaurants found</p>
          <p className="text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            Found {filteredRestaurants.length} restaurant
            {filteredRestaurants.length !== 1 ? "s" : ""}
            {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
            {searchQuery ? ` matching "${searchQuery}"` : ""}
          </p>

          {/* Restaurant Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
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
                  cuisine={restaurant.cuisine}
                  rating={restaurant.rating}
                  deliveryTime={restaurant.deliveryTime}
                  minOrder={restaurant.minOrder}
                />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

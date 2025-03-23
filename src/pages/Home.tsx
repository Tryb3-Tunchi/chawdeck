import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { api, Restaurant, FeaturedDish, CuisineType } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [featuredDishes, setFeaturedDishes] = useState<FeaturedDish[]>([]);
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restaurantsData, dishesData, cuisinesData] = await Promise.all([
          api.getRestaurants(),
          api.getFeaturedDishes(),
          api.getCuisineTypes()
        ]);

        setRestaurants(restaurantsData);
        setFeaturedDishes(dishesData);
        setCuisineTypes(cuisinesData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Carousel */}
      <FeaturedCarousel dishes={featuredDishes} />

      {/* Search Section */}
      <section className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold text-dark mb-8">
          Delicious Food Delivered To Your Door
        </h1>
        <SearchBar className="max-w-3xl mx-auto" />
      </section>

      {/* Cuisine Types */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Explore by Cuisine</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cuisineTypes.map((cuisine) => (
            <Link
              key={cuisine.name}
              to={`/search?cuisine=${cuisine.name}`}
              className="group relative overflow-hidden rounded-lg aspect-square"
            >
              <img
                src={cuisine.image}
                alt={cuisine.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-semibold">{cuisine.name}</h3>
                <p className="text-sm text-white/80">{cuisine.count} Restaurants</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Restaurants */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Popular Restaurants</h2>
          <Link to="/search" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
              <RestaurantCard {...restaurant} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
} 
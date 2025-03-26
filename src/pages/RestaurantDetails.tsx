import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Button from "../components/common/Button";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Restaurant, MenuItem } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data: restaurant,
    loading,
    error,
  } = useApi<Restaurant>(`/restaurants/${id}`);
  const { addItem } = useCart();

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      navigate("/auth/login", { state: { from: `/restaurants/${id}` } });
      return;
    }

    if (!restaurant) return;

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-12 text-red-500">
        Error loading restaurant
      </div>
    );
  if (!restaurant) return null;

  return (
    <div className="mt-16">
      {/* Hero Section */}
      <div
        className="h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurant.coverImage})` }}
      >
        <div className="h-full bg-black bg-opacity-50 flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-6 w-full">
            <h1 className="text-4xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-4 text-white">
              <span className="flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                {restaurant.rating}
              </span>
              <span>•</span>
              <span>{restaurant.cuisine}</span>
              <span>•</span>
              <span>{restaurant.deliveryTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurant.menu.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">${item.price}</span>
                  <Button onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} //

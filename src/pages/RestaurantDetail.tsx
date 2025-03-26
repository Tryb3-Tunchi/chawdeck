import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import { useApi } from "../hooks/useApi";
import { Restaurant } from "../services/api";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const MENU_CATEGORIES = [
  "Popular",
  "Main Course",
  "Appetizers",
  "Drinks",
  "Desserts",
];

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const {
    data: restaurant,
    loading,
    error,
  } = useApi<Restaurant>(`/restaurants/${id}`);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-12 text-red-500">
        Error loading restaurant
      </div>
    );
  if (!restaurant) return null;

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      navigate("/auth/login", { state: { from: `/restaurant/${id}` } });
      return;
    }

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });

    setAddedToCart((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const filteredMenuItems = restaurant.menu.filter(
    (item) =>
      selectedCategory === "Popular" || item.category === selectedCategory
  );

  return (
    <div className="space-y-6 mt-20">
      {/* Restaurant Header */}
      <div className="relative h-64 -mx-4">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <span>⭐ {restaurant.rating}</span>
            <span>•</span>
            <span>{restaurant.cuisine}</span>
            <span>•</span>
            <span>{restaurant.deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 sticky top-16 bg-white z-10 px-4 -mx-4">
        {MENU_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "primary" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid gap-6">
        {filteredMenuItems.map((item) => (
          <MenuItem
            key={item.id}
            {...item}
            onAddToCart={() => handleAddToCart(item)}
            isAdded={addedToCart[item.id]}
          />
        ))}
      </div>
    </div>
  );
}

interface MenuItemProps extends MenuItem {
  onAddToCart: () => void;
  isAdded: boolean;
}

function MenuItem({
  name,
  description,
  price,
  image,
  onAddToCart,
  isAdded,
}: MenuItemProps) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-medium">${price.toFixed(2)}</span>
          <Button
            variant={isAdded ? "secondary" : "primary"}
            size="sm"
            onClick={onAddToCart}
            disabled={isAdded}
          >
            {isAdded ? "Added ✓" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}

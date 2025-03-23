import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const MENU_CATEGORIES = ['Popular', 'Main Course', 'Appetizers', 'Drinks', 'Desserts'];

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem, items } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      navigate('/auth/login', { state: { from: `/restaurant/${id}` } });
      return;
    }

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: id!,
    });

    // Show feedback
    setAddedToCart(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  // Filter menu items by category
  const filteredMenuItems = menuItems.filter(
    item => selectedCategory === 'Popular' || item.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Restaurant Header */}
      <div className="relative h-64 -mx-4">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold">Restaurant Name</h1>
          <div className="flex items-center mt-2 space-x-4">
            <span>⭐ 4.5</span>
            <span>•</span>
            <span>Italian</span>
            <span>•</span>
            <span>25-35 min</span>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 sticky top-16 bg-white z-10 px-4 -mx-4">
        {MENU_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'outline'}
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

function MenuItem({ name, description, price, image, onAddToCart, isAdded }: MenuItemProps) {
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

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
    category: 'Popular',
  },
  {
    id: '2',
    name: 'Pasta Carbonara',
    description: 'Creamy sauce with pancetta and parmesan',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500',
    category: 'Main Course',
  },
  // Add more items...
]; 
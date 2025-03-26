import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
}

export default function RestaurantCard({
  id,
  name,
  image,
  cuisine,
  rating,
  deliveryTime,
  minOrder,
}: RestaurantCardProps) {
  return (
    <Link
      to={`/restaurants/${id}`}
      className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            {rating}
          </span>
          <span>•</span>
          <span>{cuisine}</span>
        </div>
        <div className="text-sm text-gray-500">
          <p>{deliveryTime}</p>
          <p>Min. order ${minOrder}</p>
        </div>
      </div>
    </Link>
  );
}

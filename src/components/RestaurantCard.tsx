interface RestaurantProps {
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  deliveryTime: string;
}

export default function RestaurantCard({ name, image, rating, cuisine, deliveryTime }: RestaurantProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">⭐ {rating}</span>
          <span className="mx-2">•</span>
          <span className="text-gray-600">{cuisine}</span>
        </div>
        <p className="text-gray-500 mt-1">{deliveryTime} delivery time</p>
      </div>
    </div>
  );
} 
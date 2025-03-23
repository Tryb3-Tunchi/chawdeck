import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './common/Button';

interface FeaturedDish {
  id: string;
  name: string;
  image: string;
  restaurant: string;
  price: number;
}

interface CarouselProps {
  dishes: FeaturedDish[];
}

export default function FeaturedCarousel({ dishes }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % dishes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [dishes.length]);

  return (
    <div className="relative h-[500px] -mx-4 overflow-hidden">
      <div 
        className="flex transition-transform duration-500 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {dishes.map((dish, index) => (
          <div
            key={dish.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-4xl font-bold mb-2">{dish.name}</h2>
              <p className="text-xl mb-4">From {dish.restaurant}</p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold">
                  ${dish.price.toFixed(2)}
                </span>
                <Link to={`/restaurant/${dish.id}`}>
                  <Button variant="primary" size="lg">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {dishes.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
} 
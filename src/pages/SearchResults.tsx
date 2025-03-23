import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating' },
  { value: 'deliveryTime', label: 'Delivery Time' },
  { value: 'minOrder', label: 'Minimum Order' },
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState('rating');
  const [filters, setFilters] = useState({
    cuisine: '',
    priceRange: '',
    dietary: [],
  });

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-4">Filters</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cuisine</label>
              <select
                className="input-field"
                value={filters.cuisine}
                onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
              >
                <option value="">All Cuisines</option>
                <option value="italian">Italian</option>
                <option value="chinese">Chinese</option>
                <option value="indian">Indian</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <select
                className="input-field"
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              >
                <option value="">All Prices</option>
                <option value="low">$ (Under $10)</option>
                <option value="medium">$$ ($10-$20)</option>
                <option value="high">$$$ (Over $20)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dietary</label>
              <div className="space-y-2">
                {['Vegetarian', 'Vegan', 'Gluten-Free'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.dietary.includes(option.toLowerCase())}
                      onChange={(e) => {
                        const value = option.toLowerCase();
                        setFilters(prev => ({
                          ...prev,
                          dietary: e.target.checked
                            ? [...prev.dietary, value]
                            : prev.dietary.filter(item => item !== value)
                        }));
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Search Results for "{query}"
          </h1>
          <select
            className="input-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example restaurants */}
          {[1, 2, 3, 4].map((i) => (
            <RestaurantCard
              key={i}
              id={i.toString()}
              name={`Restaurant ${i}`}
              image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500"
              rating={4.5}
              cuisine="Italian"
              deliveryTime="25-35 min"
            />
          ))}
        </div>
      </div>
    </div>
  );
} 
export const BASE_URL = "https://my-json-server.typicode.com/Tryb3-Tunchi/tryb3chaw/";

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  coverImage: string;
  rating: number;
  cuisine: string;
  deliveryTime: string;
  minOrder: number;
  featured: boolean;
  menu: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface FeaturedDish {
  id: string;
  name: string;
  image: string;
  restaurant: string;
  restaurantId: string;
  price: number;
  description: string;
}

export interface CuisineType {
  id: string;
  name: string;
  image: string;
  count: number;
}

export const api = {
  BASE_URL,
  async getRestaurants() {
    const response = await fetch(`${BASE_URL}/restaurants`);
    return response.json() as Promise<Restaurant[]>;
  },

  async getRestaurant(id: string) {
    const response = await fetch(`${BASE_URL}/restaurants/${id}`);
    return response.json() as Promise<Restaurant>;
  },

  async getFeaturedDishes() {
    const response = await fetch(`${BASE_URL}/featured_dishes`);
    return response.json() as Promise<FeaturedDish[]>;
  },

  async getCuisineTypes() {
    const response = await fetch(`${BASE_URL}/cuisine_types`);
    return response.json() as Promise<CuisineType[]>;
  },

  async searchRestaurants(query: string) {
    const response = await fetch(
      `${BASE_URL}/restaurants?q=${encodeURIComponent(query)}`
    );
    return response.json() as Promise<Restaurant[]>;
  },

  async getRestaurantsByCuisine(cuisine: string) {
    const response = await fetch(
      `${BASE_URL}/restaurants?cuisine=${encodeURIComponent(cuisine)}`
    );
    return response.json() as Promise<Restaurant[]>;
  },
};

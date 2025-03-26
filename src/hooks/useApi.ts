import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (endpoint === "/restaurants") {
          response = await api.getRestaurants();
        } else if (endpoint.startsWith("/restaurants/")) {
          const id = endpoint.split("/")[2];
          response = await api.getRestaurant(id);
        } else if (endpoint === "/featured_dishes") {
          response = await api.getFeaturedDishes();
        } else if (endpoint === "/cuisine_types") {
          response = await api.getCuisineTypes();
        } else {
          throw new Error("Invalid endpoint");
        }
        setData(response as T);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

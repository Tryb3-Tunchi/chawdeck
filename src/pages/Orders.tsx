import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { orders } from "../services/orders";
import LoadingSpinner from "../components/common/LoadingSpinner";

interface OrderStatus {
  status: string;
  label: string;
  color: string;
}

interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: "pending" | "processing" | "delivered";
  total: number;
  createdAt: string;
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
  };
}

const ORDER_STATUSES: Record<string, OrderStatus> = {
  pending: {
    status: "pending",
    label: "Order Placed",
    color: "bg-yellow-500",
  },
  confirmed: {
    status: "confirmed",
    label: "Confirmed",
    color: "bg-blue-500",
  },
  preparing: {
    status: "preparing",
    label: "Preparing",
    color: "bg-purple-500",
  },
  delivering: {
    status: "delivering",
    label: "Out for Delivery",
    color: "bg-orange-500",
  },
  delivered: {
    status: "delivered",
    label: "Delivered",
    color: "bg-green-500",
  },
  cancelled: {
    status: "cancelled",
    label: "Cancelled",
    color: "bg-red-500",
  },
};

export default function Orders() {
  const { user } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3001/api/orders/user/${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setUserOrders(data);
      } catch (error) {
        setError("Failed to fetch orders");
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!userOrders.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
        <p className="text-gray-600">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Orders</h1>
      <div className="space-y-4">
        {userOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  ORDER_STATUSES[order.status]?.color || "bg-gray-500"
                }`}
              >
                {ORDER_STATUSES[order.status]?.label || "Unknown"}
              </span>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Items</h4>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Delivery Address</h4>
              <p className="text-gray-600">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}{" "}
                {order.deliveryAddress.zipCode}
              </p>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-semibold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

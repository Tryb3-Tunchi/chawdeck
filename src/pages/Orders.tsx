import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orders } from '../services/orders';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface OrderStatus {
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  label: string;
  color: string;
}

const ORDER_STATUSES: Record<string, OrderStatus> = {
  pending: {
    status: 'pending',
    label: 'Order Placed',
    color: 'bg-yellow-500'
  },
  confirmed: {
    status: 'confirmed',
    label: 'Confirmed',
    color: 'bg-blue-500'
  },
  preparing: {
    status: 'preparing',
    label: 'Preparing',
    color: 'bg-purple-500'
  },
  delivering: {
    status: 'delivering',
    label: 'Out for Delivery',
    color: 'bg-orange-500'
  },
  delivered: {
    status: 'delivered',
    label: 'Delivered',
    color: 'bg-green-500'
  },
  cancelled: {
    status: 'cancelled',
    label: 'Cancelled',
    color: 'bg-red-500'
  }
};

export default function Orders() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orders.getUserOrders();
        setUserOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {userOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold">${order.total.toFixed(2)}</span>
                <span
                  className={`${
                    ORDER_STATUSES[order.status].color
                  } text-white text-sm px-3 py-1 rounded-full`}
                >
                  {ORDER_STATUSES[order.status].label}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Items</h4>
              <div className="space-y-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <h4 className="font-medium mb-2">Delivery Address</h4>
              <p className="text-gray-600">{order.deliveryAddress}</p>
            </div>

            {order.status === 'delivering' && (
              <div className="border-t mt-4 pt-4">
                <Link
                  to={`/orders/${order.id}/track`}
                  className="text-primary hover:underline"
                >
                  Track Order
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
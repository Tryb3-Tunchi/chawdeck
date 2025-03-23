import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orders } from '../services/orders';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TRACKING_STEPS = [
  { status: 'confirmed', label: 'Order Confirmed' },
  { status: 'preparing', label: 'Preparing Your Food' },
  { status: 'delivering', label: 'Out for Delivery' },
  { status: 'delivered', label: 'Delivered' }
];

export default function OrderTracking() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orders.getOrder(id!);
        setOrder(data);
        setCurrentStep(TRACKING_STEPS.findIndex(step => step.status === data.status));
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    
    // Set up real-time updates (you can use WebSocket here)
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Track Order #{id}</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative">
          {TRACKING_STEPS.map((step, index) => (
            <div key={step.status} className="flex items-center mb-8 last:mb-0">
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                {index < TRACKING_STEPS.length - 1 && (
                  <div
                    className={`absolute top-8 left-1/2 w-0.5 h-12 -translate-x-1/2 ${
                      index < currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="ml-4">
                <h3 className="font-medium">{step.label}</h3>
                {index === currentStep && (
                  <p className="text-gray-600 text-sm">
                    {getStepDescription(step.status)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-6">
          <h2 className="font-semibold mb-4">Delivery Details</h2>
          <p className="text-gray-600">{order.deliveryAddress}</p>
          {order.status === 'delivering' && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Estimated delivery time: {order.estimatedDeliveryTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStepDescription(status: string) {
  switch (status) {
    case 'confirmed':
      return 'We have received your order and are processing it.';
    case 'preparing':
      return 'Your food is being prepared fresh in the kitchen.';
    case 'delivering':
      return 'Your order is on its way to you.';
    case 'delivered':
      return 'Your order has been delivered. Enjoy!';
    default:
      return '';
  }
} 
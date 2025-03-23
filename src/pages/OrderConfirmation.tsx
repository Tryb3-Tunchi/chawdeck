import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function OrderConfirmation() {
  const orderNumber = Math.floor(Math.random() * 1000000);

  useEffect(() => {
    // TODO: Clear cart after successful order
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="text-5xl text-primary mb-6">✓</div>
        <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your order #{orderNumber} has been successfully placed.
        </p>
        
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Estimated Delivery Time</h3>
            <p className="text-gray-600">35-45 minutes</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <p className="text-gray-600">123 Main St, City, ZIP</p>
          </div>
        </div>

        <div className="space-x-4">
          <Link to="/orders">
            <Button variant="primary">Track Order</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 
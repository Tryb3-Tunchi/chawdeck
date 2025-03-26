import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orders } from "../services/orders";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

interface DeliveryAddress {
  street: string;
  city: string;
  zipCode: string;
  instructions: string;
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<DeliveryAddress>({
    street: "",
    city: "",
    zipCode: "",
    instructions: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const orderDetails = {
        items,
        deliveryAddress: address,
        paymentMethod,
      };

      const orderResponse = await orders.createOrder(orderDetails);

      const paymentDetails = {
        amount: total,
        email: user.email,
        currency: "NGN",
        orderId: orderResponse.id,
      };

      const paymentResponse = await orders.initiatePayment(paymentDetails);

      // Redirect to payment gateway
      window.location.href = paymentResponse.authorization_url;
    } catch (error) {
      console.error("Checkout failed:", error);
      setError("Failed to process order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Delivery Address */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <div className="space-y-4">
            <Input
              label="Street Address"
              value={address.street}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, street: e.target.value }))
              }
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={address.city}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, city: e.target.value }))
                }
                required
              />
              <Input
                label="ZIP Code"
                value={address.zipCode}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, zipCode: e.target.value }))
                }
                required
              />
            </div>
            <Input
              label="Delivery Instructions (Optional)"
              value={address.instructions}
              onChange={(e) =>
                setAddress((prev) => ({
                  ...prev,
                  instructions: e.target.value,
                }))
              }
              placeholder="E.g., Ring doorbell, call upon arrival..."
            />
          </div>
        </section>

        {/* Payment Method */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value as "card")}
                className="text-primary"
              />
              <span>Credit/Debit Card</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value as "cash")}
                className="text-primary"
              />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>$29.98</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>$3.99</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>$33.97</span>
            </div>
          </div>
        </section>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
}

import { BASE_URL } from "./api";
import { CartItem } from "../context/CartContext";

export interface OrderDetails {
  items: CartItem[];
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
    instructions?: string;
  };
  paymentMethod: "card" | "cash";
}

export interface PaymentDetails {
  amount: number;
  email: string;
  currency: string;
  // Add other payment gateway specific fields
}

export const orders = {
  async createOrder(orderDetails: OrderDetails) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderDetails),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return await response.json();
  },

  async initiatePayment(paymentDetails: PaymentDetails) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/payments/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentDetails),
    });

    if (!response.ok) {
      throw new Error("Failed to initiate payment");
    }

    return await response.json();
  },

  async verifyPayment(reference: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/payments/verify/${reference}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Payment verification failed");
    }

    return await response.json();
  },
};

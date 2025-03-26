import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import {
  UserCircleIcon,
  ClockIcon,
  MapPinIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "addresses" | "settings"
  >("profile");

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  const tabs = [
    { id: "profile", name: "Profile", icon: UserCircleIcon },
    { id: "orders", name: "Orders", icon: ClockIcon },
    { id: "addresses", name: "Addresses", icon: MapPinIcon },
    { id: "settings", name: "Settings", icon: CogIcon },
  ];

  // Mock data (replace with real data from your API)
  const recentOrders = [
    {
      id: "1",
      restaurant: "Burger House",
      date: "2024-03-15",
      total: 45.99,
      status: "Delivered",
    },
    {
      id: "2",
      restaurant: "Pizza Palace",
      date: "2024-03-10",
      total: 32.5,
      status: "Delivered",
    },
  ];

  const addresses = [
    {
      id: "1",
      type: "Home",
      street: "123 Main St",
      city: "Lagos",
      isDefault: true,
    },
    {
      id: "2",
      type: "Work",
      street: "456 Office Ave",
      city: "Lagos",
      isDefault: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                <UserCircleIcon className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            <nav className="space-y-1">
              {tabs.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
                    activeTab === id
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </button>
              ))}
            </nav>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Profile Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="mt-1 text-gray-900">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Member Since
                    </label>
                    <p className="mt-1 text-gray-900">March 2024</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Recent Orders</h3>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{order.restaurant}</h4>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${order.total.toFixed(2)}
                          </p>
                          <span className="text-sm text-green-600">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Delivery Addresses</h3>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{address.type}</h4>
                            {address.isDefault && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {address.street}
                          </p>
                          <p className="text-sm text-gray-500">
                            {address.city}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full">Add New Address</Button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">
                        Receive order updates and promotions
                      </p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">
                        Receive delivery updates via SMS
                      </p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

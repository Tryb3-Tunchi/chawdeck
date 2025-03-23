import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, Address } from '../services/auth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    street: '',
    city: '',
    zipCode: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await auth.updateProfile(formData);
      updateUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await auth.addAddress(newAddress as Address);
      updateUser(updatedUser);
      setShowAddressForm(false);
      setNewAddress({ street: '', city: '', zipCode: '' });
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <Button
            variant="outline"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        ) : (
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {user?.name}</p>
            <p><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">Phone:</span> {user?.phone}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Delivery Addresses</h2>
          <Button
            variant="outline"
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            Add New Address
          </Button>
        </div>

        {showAddressForm && (
          <form onSubmit={handleAddAddress} className="space-y-4 mb-6">
            <Input
              label="Street Address"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
              <Input
                label="ZIP Code"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
              />
            </div>
            <Button type="submit">Add Address</Button>
          </form>
        )}

        <div className="space-y-4">
          {user?.addresses.map((address) => (
            <div
              key={address.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p>{address.street}</p>
                <p className="text-gray-600">
                  {address.city}, {address.zipCode}
                </p>
              </div>
              <div className="flex gap-2">
                {address.isDefault ? (
                  <span className="text-primary text-sm">Default</span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => auth.setDefaultAddress(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => auth.deleteAddress(address.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
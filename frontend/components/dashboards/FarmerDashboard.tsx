'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { wasteAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';

interface WasteListing {
  id: number;
  type: string;
  quantity: number;
  price: number;
  location: string;
  description: string;
  status: string;
  created_at: string;
}

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    quantity: '',
    price: '',
    location: '',
    description: '',
    image: null as File | null,
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await wasteAPI.getMyListings();
      setListings(response.data.listings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('type', formData.type);
    data.append('quantity', formData.quantity);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingId) {
        await wasteAPI.update(editingId.toString(), data);
      } else {
        await wasteAPI.create(data);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ type: '', quantity: '', price: '', location: '', description: '', image: null });
      fetchListings();
    } catch (error) {
      console.error('Failed to save listing:', error);
    }
  };

  const handleEdit = (listing: WasteListing) => {
    setEditingId(listing.id);
    setFormData({
      type: listing.type,
      quantity: listing.quantity.toString(),
      price: listing.price.toString(),
      location: listing.location,
      description: listing.description || '',
      image: null,
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ type: '', quantity: '', price: '', location: '', description: '', image: null });
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await wasteAPI.delete(id.toString());
        fetchListings();
      } catch (error) {
        console.error('Failed to delete listing:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h2>
          <p className="mt-2 text-gray-600">Manage your agricultural waste listings</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              if (showForm && !editingId) {
                handleCancelEdit();
              } else {
                setShowForm(!showForm);
              }
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            {showForm ? 'Cancel' : '+ Create New Listing'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Waste Listing' : 'Create Waste Listing'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Waste Type</label>
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Corn Stalks, Rice Husks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Iowa, USA"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Describe your waste..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="mt-1 block w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingId ? 'Update Listing' : 'Create Listing'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full md:w-auto px-6 py-2 ml-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">My Listings</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : listings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No listings yet. Create your first listing!
            </div>
          ) : (
            <div className="divide-y">
              {listings.map((listing) => (
                <div key={listing.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{listing.type}</h4>
                      <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-700">📦 {listing.quantity} kg</span>
                        <span className="text-gray-700">💰 ${listing.price}</span>
                        <span className="text-gray-700">📍 {listing.location}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                      <button
                        onClick={() => handleEdit(listing)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        title="Edit listing"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        title="Delete listing"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

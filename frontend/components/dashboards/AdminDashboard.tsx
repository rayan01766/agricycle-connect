'use client';

import { useState, useEffect } from 'react';
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
  farmer_name: string;
  farmer_email: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<WasteListing | null>(null);

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const fetchListings = async () => {
    try {
      const params = filter === 'all' ? {} : { status: filter };
      const response = await wasteAPI.getAll(params);
      setListings(response.data.listings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    setProcessingIds(prev => new Set(prev).add(id));
    try {
      await wasteAPI.updateStatus(id.toString(), status);
      fetchListings();
      setSelectedListing(null);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update listing status. Please try again.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleQuickToggle = async (listing: WasteListing) => {
    const newStatus = listing.status === 'approved' ? 'rejected' : 'approved';
    await handleStatusUpdate(listing.id, newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter listings by search
  const filteredListings = listings.filter(listing => 
    searchTerm === '' ||
    listing.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: listings.length,
    pending: listings.filter(l => l.status === 'pending').length,
    approved: listings.filter(l => l.status === 'approved').length,
    rejected: listings.filter(l => l.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="mt-2 text-gray-600">Review and manage waste listings</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Listings</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-6 border-2 border-yellow-200">
            <div className="text-sm font-medium text-yellow-700">Pending Review</div>
            <div className="text-3xl font-bold text-yellow-900 mt-2">{stats.pending}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-green-700">Approved</div>
            <div className="text-3xl font-bold text-green-900 mt-2">{stats.approved}</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-red-700">Rejected</div>
            <div className="text-3xl font-bold text-red-900 mt-2">{stats.rejected}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by type, farmer, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ⏳ Pending {stats.pending > 0 && `(${stats.pending})`}
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ✅ Approved {stats.approved > 0 && `(${stats.approved})`}
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'rejected'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ❌ Rejected {stats.rejected > 0 && `(${stats.rejected})`}
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            📋 All Listings
          </button>
        </div>

        {/* Listings Review Panel */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Review Panel - {filteredListings.length} Listings</h3>
            {filter === 'pending' && stats.pending > 0 && (
              <span className="text-sm text-yellow-600 font-medium">
                {stats.pending} awaiting review
              </span>
            )}
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading listings...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {listings.length === 0 ? '📭 No listings found.' : '🔍 No listings match your search.'}
            </div>
          ) : (
            <div className="divide-y">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      {/* Header with Status */}
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{listing.type}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                          {listing.status.toUpperCase()}
                        </span>
                        {processingIds.has(listing.id) && (
                          <span className="text-xs text-blue-600 animate-pulse">Processing...</span>
                        )}
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3">{listing.description}</p>
                      
                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">📦 Quantity:</span>
                          <span className="font-medium">{listing.quantity} kg</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">💰 Price:</span>
                          <span className="font-medium">${listing.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm col-span-2">
                          <span className="text-gray-500">📍 Location:</span>
                          <span className="font-medium">{listing.location}</span>
                        </div>
                      </div>
                      
                      {/* Farmer Info */}
                      <div className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2">
                        <span className="text-gray-500">👨‍🌾 Farmer:</span>
                        <span className="font-medium">{listing.farmer_name}</span>
                        <span className="text-gray-400">•</span>
                        <a href={`mailto:${listing.farmer_email}`} className="text-blue-600 hover:underline">
                          {listing.farmer_email}
                        </a>
                      </div>
                    </div>
                    
                    {/* Action Panel */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      {listing.status === 'pending' ? (
                        // Pending Review Controls
                        <>
                          <button
                            onClick={() => handleStatusUpdate(listing.id, 'approved')}
                            disabled={processingIds.has(listing.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(listing.id, 'rejected')}
                            disabled={processingIds.has(listing.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            ❌ Reject
                          </button>
                          <button
                            onClick={() => setSelectedListing(listing)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium transition-colors text-sm"
                          >
                            👁️ Review Details
                          </button>
                        </>
                      ) : (
                        // Toggle Control for Approved/Rejected
                        <>
                          <div className="bg-gray-50 rounded-lg p-3 border">
                            <div className="text-xs text-gray-600 mb-2 text-center">Quick Toggle</div>
                            <button
                              onClick={() => handleQuickToggle(listing)}
                              disabled={processingIds.has(listing.id)}
                              className={`w-full px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 ${
                                listing.status === 'approved'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {listing.status === 'approved' ? '➡️ Reject' : '➡️ Approve'}
                            </button>
                          </div>
                          <button
                            onClick={() => handleStatusUpdate(listing.id, 'pending')}
                            disabled={processingIds.has(listing.id)}
                            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 font-medium transition-colors text-sm disabled:opacity-50"
                          >
                            ⏳ Mark Pending
                          </button>
                        </>
                      )}
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

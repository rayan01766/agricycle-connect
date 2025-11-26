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

export default function CompanyDashboard() {
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [interestedListings, setInterestedListings] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchListings();
    // Load interested listings from localStorage
    const saved = localStorage.getItem('interestedListings');
    if (saved) {
      setInterestedListings(new Set(JSON.parse(saved)));
    }
  }, []);

  const fetchListings = async () => {
    try {
      const response = await wasteAPI.getAll({ status: 'approved' });
      setListings(response.data.listings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique waste types for filter dropdown
  const wasteTypes = Array.from(new Set(listings.map(l => l.type)));

  // Filter and search logic
  const filteredListings = listings.filter(listing => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      listing.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.farmer_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === 'all' || listing.type === typeFilter;
    
    // Price filter
    let matchesPrice = true;
    if (priceFilter === 'low') matchesPrice = listing.price < 100;
    else if (priceFilter === 'medium') matchesPrice = listing.price >= 100 && listing.price < 300;
    else if (priceFilter === 'high') matchesPrice = listing.price >= 300;
    
    return matchesSearch && matchesType && matchesPrice;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'quantity-low':
        return a.quantity - b.quantity;
      case 'quantity-high':
        return b.quantity - a.quantity;
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleInterest = (listingId: number) => {
    const newInterested = new Set(interestedListings);
    if (newInterested.has(listingId)) {
      newInterested.delete(listingId);
    } else {
      newInterested.add(listingId);
    }
    setInterestedListings(newInterested);
    localStorage.setItem('interestedListings', JSON.stringify(Array.from(newInterested)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Company Dashboard</h2>
          <p className="mt-2 text-gray-600">Browse available agricultural waste listings</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by type, location, farmer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waste Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                {wasteTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Prices</option>
                <option value="low">Under $100</option>
                <option value="medium">$100 - $300</option>
                <option value="high">Over $300</option>
              </select>
            </div>
          </div>

          {/* Sort and Results Count */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{sortedListings.length}</span> of <span className="font-semibold">{listings.length}</span> listings
              {interestedListings.size > 0 && (
                <span className="ml-2">| <span className="font-semibold text-green-600">{interestedListings.size}</span> interested</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="quantity-low">Quantity: Low to High</option>
                <option value="quantity-high">Quantity: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Available Listings</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : sortedListings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {listings.length === 0 ? 'No listings available at the moment.' : 'No listings match your filters.'}
            </div>
          ) : (
            <div className="divide-y">
              {sortedListings.map((listing) => (
                <div key={listing.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">{listing.type}</h4>
                        {interestedListings.has(listing.id) && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            ⭐ Interested
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-700">📦 {listing.quantity} kg</span>
                        <span className="text-gray-700 font-semibold">💰 ${listing.price}</span>
                        <span className="text-gray-700">📍 {listing.location}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="text-gray-500">👨‍🌾 Farmer:</span>
                        <span className="font-medium text-gray-700">{listing.farmer_name}</span>
                        <span className="text-gray-400">•</span>
                        <a href={`mailto:${listing.farmer_email}`} className="text-green-600 hover:underline">
                          {listing.farmer_email}
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleInterest(listing.id)}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                          interestedListings.has(listing.id)
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {interestedListings.has(listing.id) ? '⭐ Interested' : '☆ Mark Interest'}
                      </button>
                      <a
                        href={`mailto:${listing.farmer_email}?subject=Interest in ${listing.type} Listing&body=Hello ${listing.farmer_name},%0D%0A%0D%0AI am interested in your ${listing.type} listing (${listing.quantity} kg at $${listing.price}).%0D%0A%0D%0APlease let me know if this is still available.%0D%0A%0D%0AThank you!`}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center font-medium"
                      >
                        📧 Contact
                      </a>
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

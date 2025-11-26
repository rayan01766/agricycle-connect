'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import FarmerDashboard from '@/components/dashboards/FarmerDashboard';
import CompanyDashboard from '@/components/dashboards/CompanyDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {user?.role === 'farmer' && <FarmerDashboard />}
        {user?.role === 'company' && <CompanyDashboard />}
        {user?.role === 'admin' && <AdminDashboard />}
      </div>
    </ProtectedRoute>
  );
}

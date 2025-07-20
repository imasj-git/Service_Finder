import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import ServiceProviders from '../components/admin/ServiceProviders';
import Customers from '../components/admin/Customers';
import Bookings from '../components/admin/Bookings';
import Payments from '../components/admin/Payments';
import Reviews from '../components/admin/Reviews';
import Categories from '../components/admin/Categories';
import Notifications from '../components/admin/Notifications';
import AdminProfile from '../components/admin/AdminProfile';
import AdminServicesPage from './AdminServicesPage';
import AdminContactsPage from './AdminContactsPage';
import AdminProvidersPage from './AdminProvidersPage';

function isAdmin() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

const AdminRoute = ({ children }) => {
  const location = useLocation();
  if (!isAdmin()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminRoute><Dashboard /></AdminRoute>} />

        <Route path="/customers" element={<AdminRoute><Customers /></AdminRoute>} />
        <Route path="/bookings" element={<AdminRoute><Bookings /></AdminRoute>} />
        <Route path="/payments" element={<AdminRoute><Payments /></AdminRoute>} />
        <Route path="/reviews" element={<AdminRoute><Reviews /></AdminRoute>} />
        <Route path="/categories" element={<AdminRoute><Categories /></AdminRoute>} />
        <Route path="/notifications" element={<AdminRoute><Notifications /></AdminRoute>} />
        <Route path="/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
        <Route path="/settings" element={<AdminRoute><AdminProfile /></AdminRoute>} />
        <Route path="/change-password" element={<AdminRoute><AdminProfile /></AdminRoute>} />
        <Route path="/services" element={<AdminRoute><AdminServicesPage /></AdminRoute>} />
        <Route path="/providers" element={<AdminRoute><AdminProvidersPage /></AdminRoute>} />
        <Route path="/contacts" element={<AdminRoute><AdminContactsPage /></AdminRoute>} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;

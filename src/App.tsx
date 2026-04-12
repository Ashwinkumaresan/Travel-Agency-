/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import Bookings from './pages/customer/Bookings';
import BookTrip from './pages/customer/BookTrip';
import Tickets from './pages/customer/Tickets';
import Profile from './pages/customer/Profile';
import StaffDashboard from './pages/staff/Dashboard';
import ManageBookings from './pages/staff/ManageBookings';
import ManageTickets from './pages/staff/ManageTickets';
import ManageCustomers from './pages/staff/Customers';
import Accounts from './pages/staff/Accounts';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAccounts from './pages/admin/AccountsOverview';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Customer Portal */}
        <Route path="/app/dashboard" element={<CustomerDashboard />} />
        <Route path="/app/bookings" element={<Bookings />} />
        <Route path="/app/book" element={<BookTrip />} />
        <Route path="/app/tickets" element={<Tickets />} />
        <Route path="/app/profile" element={<Profile />} />
        
        {/* Staff Portal */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/bookings" element={<ManageBookings />} />
        <Route path="/staff/tickets" element={<ManageTickets />} />
        <Route path="/staff/customers" element={<ManageCustomers />} />
        <Route path="/staff/accounts" element={<Accounts />} />
        
        {/* Admin Portal */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/accounts" element={<AdminAccounts />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

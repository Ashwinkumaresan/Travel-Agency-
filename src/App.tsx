/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
import BookCourier from './pages/staff/BookCourier';
import DailyReport from './pages/staff/DailyReport';
import Accounts from './pages/staff/Accounts';
import RouteMapping from './pages/staff/RouteMapping';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAccounts from './pages/admin/AccountsOverview';
import AdminReports from './pages/admin/Reports';
import DriverManager from './pages/admin/DriverManager';
import VehicleManager from './pages/admin/VehicleManager';
import DetailedMetrics from './pages/shared/DetailedMetrics';
import SplashScreen from './components/layout/SplashScreen';

export default function App() {
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // 1. Hold at center for 2.0s, then start movement to navbar
    const movementTimer = setTimeout(() => {
      setIsTransitioning(true);
    }, 2000);

    // 2. Complete transition and remove splash after 2.8s
    const removalTimer = setTimeout(() => {
      setIsSplashActive(false);
    }, 3000); // 3.0s instead of 2.8s to allow for final spring settling

    return () => {
      clearTimeout(movementTimer);
      clearTimeout(removalTimer);
    };
  }, []);

  return (
    <Router>
      <div className="relative bg-white min-h-screen overflow-x-hidden">
        {/* Force scroll to top and prevent overflow during splash */}
        {isSplashActive && (
          <div className="fixed inset-0 z-[110] bg-white pointer-events-none" />
        )}

        {/* 1. Splash Screen Layer (Always white background) */}
        {isSplashActive && (
          <div className="z-[120] relative">
            <SplashScreen isTransitioning={isTransitioning} />
          </div>
        )}

        {/* 2. Page Content Layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isSplashActive ? 0 : 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative z-0"
        >
          {/* Render the app hiddenly during splash so layoutId has a target move to */}
          <div style={{ opacity: isTransitioning ? 1 : 0 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Portal routes omitted for brevity in response but preserved in file */}
              <Route path="/app/dashboard" element={<CustomerDashboard />} />
              <Route path="/app/bookings" element={<Bookings />} />
              <Route path="/app/book" element={<BookTrip />} />
              <Route path="/app/tickets" element={<Tickets />} />
              <Route path="/app/profile" element={<Profile />} />
              
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/metrics" element={<DetailedMetrics />} />
              <Route path="/staff/book" element={<BookCourier />} />
              <Route path="/staff/report" element={<DailyReport />} />
              <Route path="/staff/bookings" element={<ManageBookings />} />
              <Route path="/staff/tickets" element={<ManageTickets />} />
              <Route path="/staff/customers" element={<ManageCustomers />} />
              <Route path="/staff/accounts" element={<Accounts />} />
              <Route path="/staff/mapping" element={<RouteMapping />} />
              
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/metrics" element={<DetailedMetrics />} />
              <Route path="/admin/accounts" element={<AdminAccounts />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/drivers" element={<DriverManager />} />
              <Route path="/admin/vehicles" element={<VehicleManager />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </motion.div>
      </div>
    </Router>
  );
}

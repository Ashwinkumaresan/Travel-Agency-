import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Lock, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function StaffLogin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.backend.sasalemsuperservice.com/api/staff/';
      const response = await fetch(`${apiUrl}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staffID: userId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('staffID', data.staffID);
        localStorage.setItem('branchName', data.branch);
        localStorage.setItem('username', data.username);
        navigate('/staff/book');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-2">
            <div className="bg-primary p-2 rounded-md">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="text-sidebar-logo font-display font-bold text-secondary tracking-tight">
              S A Salem Super <span className="text-primary">Service</span>
            </span>
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100 text-black text-left">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold text-secondary">Staff Portal</h2>
            <p className="text-sm text-text-muted mt-1">Sign in with your Staff User ID</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="input-label">Staff User ID</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="staff-1" 
                  className="input-field pl-10 h-11 text-black" 
                  required 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="input-field pl-10 h-11 text-black" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-button mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* <p className="text-center text-xs text-text-muted mt-6">
              Not staff?{' '}
              <Link 
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Go to Customer Portal
              </Link>
            </p> */}
          </form>
        </div>
      </div>
    </div>
  );
}

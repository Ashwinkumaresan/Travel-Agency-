import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import { motion } from 'motion/react';

export default function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app/dashboard');
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
              Sa Salem Super <span className="text-primary">Service</span>
            </span>
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100 text-black text-left">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold text-secondary">Customer Portal</h2>
            <p className="text-sm text-text-muted mt-1">Sign in to manage your bookings</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="input-field pl-10 h-11 text-black" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-button mt-2 cursor-pointer">
              Sign In <ArrowRight className="h-4 w-4" />
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-text-muted font-bold">Or continue with</span></div>
            </div>

            <button type="button" className="w-full border border-gray-300 py-2.5 rounded-md font-bold text-secondary hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
              <Chrome className="h-4 w-4 text-primary" /> Google
            </button>

            <p className="text-center text-xs text-text-muted mt-6">
              Don't have an account?{' '}
              <Link 
                to="/register"
                className="text-primary font-bold hover:underline"
              >
                Register Now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

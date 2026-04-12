import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Mail, Lock, User, Phone, Shield, ArrowRight, Chrome } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

type LoginRole = 'customer' | 'staff' | 'admin';

export default function Login() {
  const [role, setRole] = useState<LoginRole>('customer');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'customer') navigate('/app/dashboard');
    else if (role === 'staff') navigate('/staff/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      {/* LEFT SIDE - Branding & Info (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-secondary p-12 flex-col justify-between text-white relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="bg-primary p-2 rounded-md">
            <Compass className="h-8 w-8 text-white" />
          </div>
          <span className="text-sidebar-logo md:text-2xl font-display font-bold text-white tracking-tight">
            Voyage<span className="text-primary">Arc</span>
          </span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
            Welcome back to <br /> the world of <span className="text-primary">Adventure.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            Manage your trips, book new experiences, and explore the globe with VoyageArc.
          </p>
        </div>

        <div className="relative z-10 flex gap-8 text-sm text-gray-400">
          <div>
            <p className="text-white font-bold text-xl">10k+</p>
            <p>Happy Travellers</p>
          </div>
          <div>
            <p className="text-white font-bold text-xl">500+</p>
            <p>Destinations</p>
          </div>
          <div>
            <p className="text-white font-bold text-xl">24/7</p>
            <p>Expert Support</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center h-full p-6 overflow-hidden">
        <div className="w-full max-w-[420px] bg-white p-6 md:p-0">
          {/* Mobile Logo */}
          <Link to="/" className="flex md:hidden items-center justify-center gap-2 mb-8">
            <div className="bg-primary p-2 rounded-md">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="text-sidebar-logo font-display font-bold text-secondary tracking-tight">
              Voyage<span className="text-primary">Arc</span>
            </span>
          </Link>

          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl md:text-h1 font-display font-bold text-secondary mb-2">
              Sign In
            </h2>
            <p className="text-sm text-text-muted">Please select your role to continue.</p>
          </div>

          {/* Role Selector */}
          <div className="flex p-1 bg-gray-100 rounded-md mb-6">
            {(['customer', 'staff', 'admin'] as LoginRole[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                }}
                className={cn(
                  "flex-1 py-2 text-sidebar-menu rounded-md transition-all capitalize",
                  role === r ? "bg-white text-primary shadow-sm font-bold" : "text-text-muted hover:text-secondary font-medium"
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="input-label">
                {role === 'staff' ? 'Staff User ID' : 'Email Address'}
              </label>
              <div className="relative">
                {role === 'staff' ? (
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                ) : (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
                <input 
                  type={role === 'staff' ? 'text' : 'email'} 
                  placeholder={role === 'staff' ? 'STF-0042' : 'name@example.com'} 
                  className="input-field pl-10 h-11" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="input-label">Password</label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="password" placeholder="••••••••" className="input-field pl-10 h-11" required />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-button mt-2">
              Sign In <ArrowRight className="h-4 w-4" />
            </button>

            {role === 'customer' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-text-muted font-bold">Or continue with</span></div>
                </div>

                <button type="button" className="w-full border border-gray-300 py-2.5 rounded-md font-bold text-secondary hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm">
                  <Chrome className="h-4 w-4" /> Google
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
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

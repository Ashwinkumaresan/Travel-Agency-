import PortalLayout from '@/components/layout/PortalLayout';
import { User, MapPin, Shield, Bell, Trash2, Camera } from 'lucide-react';

export default function Profile() {
  return (
    <PortalLayout role="customer" title="My Profile">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-white">
              JD
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-primary hover:bg-primary hover:text-white transition-all">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-display font-bold text-secondary">John Doe</h2>
            <p className="text-text-muted mb-4">Customer since April 2025</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                <Shield className="h-3 w-3" /> Verified Account
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                Gold Member
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-display font-bold text-secondary flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Personal Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Full Name</label>
                <input type="text" defaultValue="John Doe" className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                <input type="email" defaultValue="john@example.com" className="input-field bg-gray-50" readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Phone Number</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" className="input-field" />
              </div>
            </div>
            <button className="btn-primary w-full">Save Changes</button>
          </div>

          {/* Address */}
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-display font-bold text-secondary flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Address Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Street Address</label>
                <input type="text" defaultValue="123 Adventure Lane" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">City</label>
                  <input type="text" defaultValue="Travel City" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Country</label>
                  <input type="text" defaultValue="United States" className="input-field" />
                </div>
              </div>
            </div>
            <button className="btn-primary w-full">Update Address</button>
          </div>

          {/* Notifications */}
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-display font-bold text-secondary flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Booking Updates', desc: 'Get notified about your trip status.' },
                { label: 'Promotional Offers', desc: 'Receive deals and discounts.' },
                { label: 'Security Alerts', desc: 'Important account security updates.' },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold text-secondary">{pref.label}</p>
                    <p className="text-xs text-text-muted">{pref.desc}</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-8 rounded-lg border border-red-100 space-y-6">
            <h3 className="text-xl font-display font-bold text-red-700 flex items-center gap-2">
              <Shield className="h-5 w-5" /> Danger Zone
            </h3>
            <p className="text-sm text-red-600">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="flex items-center justify-center gap-2 w-full py-3 rounded-md border-2 border-red-200 text-red-600 font-bold hover:bg-red-600 hover:text-white transition-all">
              <Trash2 className="h-5 w-5" /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

import PortalLayout from '@/components/layout/PortalLayout';
import { Briefcase, Calendar, CreditCard, Ticket, ArrowUpRight, MapPin, Clock } from 'lucide-react';
import { MOCK_BOOKINGS } from '@/constants';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { motion } from 'motion/react';

export default function CustomerDashboard() {
  const upcomingTrip = MOCK_BOOKINGS.find(b => b.status === 'confirmed');

  return (
    <PortalLayout role="customer" title="Customer Dashboard">
      <div className="space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Bookings', value: '12', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Upcoming Trips', value: '2', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending Payments', value: '$1,240', icon: CreditCard, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Open Tickets', value: '1', icon: Ticket, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className={cn("p-4 rounded-xl", metric.bg)}>
                <metric.icon className={cn("h-6 w-6", metric.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">{metric.label}</p>
                <p className="text-2xl font-display font-bold text-secondary">{metric.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-secondary">Recent Bookings</h2>
              <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_BOOKINGS.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-secondary">{booking.id}</td>
                      <td className="px-6 py-4 text-sm text-text-main">{booking.destination}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">{formatDate(booking.travelDate)}</td>
                      <td className="px-6 py-4">
                        <span className={cn("badge", `badge-${booking.status}`)}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-primary-light rounded-lg text-primary transition-colors">
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Trip Card */}
          <div className="space-y-6">
            <h2 className="text-xl font-display font-bold text-secondary">Upcoming Trip</h2>
            {upcomingTrip ? (
              <div className="bg-secondary rounded-2xl overflow-hidden shadow-xl text-white">
                <div className="relative h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80" 
                    alt="Maldives" 
                    className="w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">Confirmed</span>
                    <h3 className="text-2xl font-display font-bold">{upcomingTrip.destination}</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase font-bold tracking-widest text-gray-500">Travel Date</p>
                      <p className="text-sm font-medium text-white">{formatDate(upcomingTrip.travelDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase font-bold tracking-widest text-gray-500">Booking ID</p>
                      <p className="text-sm font-medium text-white">{upcomingTrip.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase font-bold tracking-widest text-gray-500">Check-in</p>
                      <p className="text-sm font-medium text-white">12:00 PM, Male Airport</p>
                    </div>
                  </div>
                  <button className="w-full btn-primary mt-4">View Details</button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center">
                <p className="text-text-muted text-sm mb-4">No upcoming trips found.</p>
                <button className="btn-outline w-full">Book a Trip</button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-secondary">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <button className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <span className="text-sm font-medium text-text-main">Book a New Trip</span>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                </button>
                <button className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <span className="text-sm font-medium text-text-main">Raise a Ticket</span>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                </button>
                <button className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <span className="text-sm font-medium text-text-main">View Payment History</span>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}


import PortalLayout from '@/components/layout/PortalLayout';
import { DollarSign, Briefcase, Users, Ticket, TrendingUp, MapPin } from 'lucide-react';
import { MOCK_BOOKINGS } from '@/constants';
import { cn, formatCurrency } from '@/lib/utils';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 55000 },
  { name: 'Jun', revenue: 67000 },
];

const STATUS_DATA = [
  { name: 'Confirmed', value: 45, color: '#10B981' },
  { name: 'Pending', value: 25, color: '#F59E0B' },
  { name: 'Cancelled', value: 10, color: '#EF4444' },
  { name: 'Completed', value: 20, color: '#3B82F6' },
];

const DESTINATION_DATA = [
  { name: 'Maldives', bookings: 120 },
  { name: 'Switzerland', bookings: 85 },
  { name: 'Japan', bookings: 65 },
  { name: 'Bali', bookings: 45 },
  { name: 'Paris', bookings: 30 },
];

export default function AdminDashboard() {
  return (
    <PortalLayout role="admin" title="Admin Dashboard">
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Revenue', value: '$142k', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Bookings', value: '1,240', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Customers', value: '850', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Staff', value: '12', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Tickets', value: '42', icon: Ticket, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", metric.bg)}>
                <metric.icon className={cn("h-5 w-5", metric.color)} />
              </div>
              <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{metric.label}</p>
              <p className="text-xl font-display font-bold text-secondary">{metric.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-display font-bold text-secondary mb-6">Revenue Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#E53935" strokeWidth={3} dot={{ r: 4, fill: '#E53935' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bookings by Status */}
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-display font-bold text-secondary mb-6">Bookings by Status</h3>
            <div className="h-80 flex flex-col sm:flex-row items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STATUS_DATA}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4 w-full sm:w-auto sm:pr-8 mt-4 sm:mt-0">
                {STATUS_DATA.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-text-muted">{item.name}</span>
                    <span className="text-sm font-bold text-secondary ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Destinations */}
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm lg:col-span-1">
            <h3 className="text-lg font-display font-bold text-secondary mb-6">Top Destinations</h3>
            <div className="space-y-6">
              {DESTINATION_DATA.map((dest, i) => (
                <div key={dest.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-secondary">{dest.name}</span>
                    <span className="text-text-muted">{dest.bookings} bookings</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(dest.bookings / 120) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-display font-bold text-secondary mb-6">Recent Global Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Booking ID</th>
                    <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
                    <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Destination</th>
                    <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                    <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_BOOKINGS.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-sm font-bold text-secondary">{booking.id}</td>
                      <td className="py-4 text-sm text-text-main">{booking.customerName}</td>
                      <td className="py-4 text-sm text-text-muted flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {booking.destination}
                      </td>
                      <td className="py-4">
                        <span className={cn("badge", `badge-${booking.status}`)}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-bold text-secondary">{formatCurrency(booking.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}


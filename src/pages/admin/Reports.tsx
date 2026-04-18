import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_BOOKINGS, COURIER_LOCATIONS } from '@/constants';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { 
  Download, 
  Filter, 
  Search, 
  Calendar, 
  MapPin, 
  User, 
  TrendingUp, 
  Package, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  FileText
} from 'lucide-react';
import { Booking } from '@/types';

export default function AdminReports() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Mocking some daily logs
  const mockLogs = useMemo(() => {
    return MOCK_BOOKINGS.map(b => ({
      ...b,
      status: Math.random() > 0.3 ? 'received' : 'sent',
      pickupLocation: b.pickupLocation || 'Chennai',
      deliveryLocation: b.deliveryLocation || 'Salem',
      staffName: 'Arun Kumar',
      completedAt: new Date().toISOString()
    }));
  }, []);

  const filteredLogs = useMemo(() => {
    return mockLogs.filter(log => {
      const matchesLocation = selectedLocation === 'All' || 
                             log.pickupLocation === selectedLocation || 
                             log.deliveryLocation === selectedLocation;
      const matchesSearch = log.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           log.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLocation && matchesSearch;
    });
  }, [mockLogs, selectedLocation, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: filteredLogs.length,
      sent: filteredLogs.filter(l => l.status === 'sent').length,
      received: filteredLogs.filter(l => l.status === 'received').length,
      pending: Math.floor(filteredLogs.length * 0.1) // Mock pending
    };
  }, [filteredLogs]);

  return (
    <PortalLayout role="admin" title="Operational Reports">
      <div className="space-y-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Handled', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Sent', value: stats.sent, icon: ArrowUpRight, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Total Received', value: stats.received, icon: ArrowDownLeft, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending Items', value: stats.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((metric, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-lg", metric.bg, metric.color)}>
                  <metric.icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-sm flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +5%
                </span>
              </div>
              <p className="text-sm font-medium text-text-muted">{metric.label}</p>
              <h3 className="text-2xl font-display font-bold text-secondary mt-1">{metric.value}</h3>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="font-display font-bold text-secondary flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" /> Report Filters
            </h3>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button className="btn-outline py-2 px-4 text-xs flex items-center gap-2">
                <Download className="h-4 w-4" /> Download CSV
              </button>
              <button className="btn-primary py-2 px-4 text-xs flex items-center gap-2">
                <FileText className="h-4 w-4" /> Export PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="date" 
                  className="input-field pl-10 h-11"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Office Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select 
                  className="input-field pl-10 h-11 appearance-none"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="All">All Locations</option>
                  {COURIER_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Search Courier</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tracking ID or Customer..." 
                  className="input-field pl-10 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Logs Table */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-display font-bold text-secondary">Detailed Operational Logs</h3>
            <span className="text-xs text-text-muted">{filteredLogs.length} records found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Tracking ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Route</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs text-text-muted">
                      {new Date(log.completedAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-bold text-secondary">{log.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-text-muted">
                          {log.staffName.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-secondary">{log.staffName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-1 rounded-sm",
                        log.status === 'sent' ? "bg-purple-50 text-purple-600" : "bg-green-50 text-green-600"
                      )}>
                        {log.status === 'sent' ? 'Dispatched' : 'Received'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-medium text-text-muted">
                        <span>{log.pickupLocation}</span>
                        <ArrowUpRight className="h-3 w-3" />
                        <span>{log.deliveryLocation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge badge-confirmed">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

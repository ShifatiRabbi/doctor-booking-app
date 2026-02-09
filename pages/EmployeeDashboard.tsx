import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Appointment } from '../types';

const EmployeeDashboard: React.FC = () => {
  const { appointments, updateAppointmentStatus, searchPatients } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === 'all' ? true : apt.status === filter;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          apt.patientPhone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Confirmed</span>;
      case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">Pending</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">Cancelled</span>;
      case 'completed': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Completed</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setFilter('all')} 
             className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border'}`}
           >All</button>
           <button 
             onClick={() => setFilter('pending')} 
             className={`px-3 py-1 rounded-full text-sm ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600 border'}`}
           >Pending</button>
           <button 
             onClick={() => setFilter('confirmed')} 
             className={`px-3 py-1 rounded-full text-sm ${filter === 'confirmed' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 border'}`}
           >Confirmed</button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by Patient Name or Phone..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-gray-50 border-b border-gray-100">
               <tr>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date/Time</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{apt.patientName}</p>
                      <p className="text-xs text-gray-500">{apt.patientPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {apt.doctorName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{apt.date}</div>
                      <div className="text-xs text-gray-400">{apt.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(apt.status)}
                    </td>
                    <td className="px-6 py-4">
                      {apt.status === 'pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded" title="Confirm"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button 
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded" title="Cancel"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      )}
                      {apt.status === 'confirmed' && (
                         <span className="text-xs text-gray-400 flex items-center gap-1">
                           <Clock size={12} /> Awaiting Visit
                         </span>
                      )}
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
          {filteredAppointments.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              No bookings found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
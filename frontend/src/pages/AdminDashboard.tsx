
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, DollarSign, Calendar, MapPin, Edit, Plus, Trash2, Check, X, Clock } from 'lucide-react';
import { Branch, Doctor, WeeklySchedule } from '../types';

const AdminDashboard: React.FC = () => {
  const { doctors, appointments, patients, currentBranch, branches, addBranch, updateBranch, updateDoctor } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'branches' | 'doctors'>('overview');

  // --- Sub-Components ---

  // 1. Overview Tab
  const OverviewStats = () => {
    const chartData = [
        { name: 'Mon', patients: 20 }, { name: 'Tue', patients: 35 },
        { name: 'Wed', patients: 28 }, { name: 'Thu', patients: 45 },
        { name: 'Fri', patients: 30 }, { name: 'Sat', patients: 50 },
        { name: 'Sun', patients: 15 },
      ];
    
    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="text-white" size={24} />
          </div>
        </div>
      );

    return (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Doctors" value={doctors.length} icon={UserPlus} color="bg-blue-500" />
            <StatCard title="Total Patients" value={patients.length} icon={Users} color="bg-emerald-500" />
            <StatCard title="Appointments" value={appointments.length} icon={Calendar} color="bg-orange-500" />
            <StatCard title="Revenue (Est)" value={`৳${appointments.length * 800}`} icon={DollarSign} color="bg-purple-500" />
          </div>
    
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Patient Traffic (Weekly)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                    <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
        </div>
    );
  };

  // 2. Branch Management Tab
  const BranchManager = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Branch>>({});

    const handleEdit = (branch: Branch) => {
        setEditForm(branch);
        setIsEditing(true);
    };

    const handleNew = () => {
        setEditForm({
            name: '', location: '', contact: '', colorTheme: 'blue', headerTitle: '', footerText: ''
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if(!editForm.name || !editForm.location) return alert("Name and Location required");

        if (editForm.id) {
            await updateBranch(editForm as Branch);
        } else {
            await addBranch(editForm as Branch);
        }
        setIsEditing(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Branch Configuration</h3>
                <button onClick={handleNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus size={18} /> Add Branch
                </button>
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm mb-6">
                    <h4 className="font-bold mb-4">{editForm.id ? 'Edit Branch' : 'New Branch'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium mb-1">Branch Name</label>
                            <input className="w-full border p-2 rounded" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input className="w-full border p-2 rounded" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contact</label>
                            <input className="w-full border p-2 rounded" value={editForm.contact} onChange={e => setEditForm({...editForm, contact: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Theme Color</label>
                            <select className="w-full border p-2 rounded" value={editForm.colorTheme} onChange={e => setEditForm({...editForm, colorTheme: e.target.value})}>
                                <option value="blue">Blue</option>
                                <option value="emerald">Emerald</option>
                                <option value="indigo">Indigo</option>
                                <option value="rose">Rose</option>
                                <option value="orange">Orange</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                             <label className="block text-sm font-medium mb-1">Custom Header Title</label>
                             <input className="w-full border p-2 rounded" placeholder="Default: Branch Name" value={editForm.headerTitle || ''} onChange={e => setEditForm({...editForm, headerTitle: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                             <label className="block text-sm font-medium mb-1">Custom Footer Text</label>
                             <input className="w-full border p-2 rounded" placeholder="Copyright etc." value={editForm.footerText || ''} onChange={e => setEditForm({...editForm, footerText: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map(branch => (
                    <div key={branch.id} className={`bg-white p-6 rounded-xl border-t-4 shadow-sm relative group`} style={{ borderColor: branch.colorTheme === 'emerald' ? '#10b981' : branch.colorTheme === 'indigo' ? '#6366f1' : branch.colorTheme === 'rose' ? '#e11d48' : branch.colorTheme === 'orange' ? '#f97316' : '#3b82f6' }}>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(branch)} className="text-gray-400 hover:text-blue-600 p-1"><Edit size={18} /></button>
                        </div>
                        <h4 className="font-bold text-lg text-gray-800">{branch.name}</h4>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                            <MapPin size={16} /> {branch.location}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                            <p><span className="font-medium">Theme:</span> <span className="capitalize">{branch.colorTheme}</span></p>
                            <p className="mt-1"><span className="font-medium">Contact:</span> {branch.contact}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  // 3. Doctor Schedule Manager
  const DoctorManager = () => {
      const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
      const [scheduleForm, setScheduleForm] = useState<WeeklySchedule>({});

      const openScheduleEditor = (doc: Doctor) => {
          setSelectedDoctor(doc);
          setScheduleForm(JSON.parse(JSON.stringify(doc.schedule))); // Deep copy
      };

      const handleScheduleChange = (day: string, field: string, value: any) => {
          setScheduleForm(prev => ({
              ...prev,
              [day]: { ...prev[day], [field]: value }
          }));
      };

      const saveSchedule = async () => {
          if (selectedDoctor) {
              await updateDoctor({ ...selectedDoctor, schedule: scheduleForm });
              setSelectedDoctor(null);
          }
      };

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      return (
        <div className="space-y-6 animate-fade-in">
             {!selectedDoctor ? (
                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Doctor Name</th>
                                <th className="px-6 py-3">Specialty</th>
                                <th className="px-6 py-3">Branch</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {doctors.map(doc => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{doc.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{doc.specialty}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{doc.branchId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                          onClick={() => openScheduleEditor(doc)}
                                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                        >
                                            <Clock size={16} /> Manage Schedule
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
             ) : (
                 <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                     <div className="flex justify-between items-center mb-6 border-b pb-4">
                         <div>
                             <h3 className="text-xl font-bold text-gray-800">Edit Schedule: {selectedDoctor.name}</h3>
                             <p className="text-sm text-gray-500">Configure weekly availability and working hours.</p>
                         </div>
                         <button onClick={() => setSelectedDoctor(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                     </div>

                     <div className="space-y-4">
                         {days.map(day => {
                             const daySched = scheduleForm[day] || { enabled: false, start: '09:00', end: '17:00' };
                             return (
                                 <div key={day} className={`flex items-center gap-4 p-3 rounded-lg border ${daySched.enabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                                     <div className="w-16 font-bold text-gray-700">{day}</div>
                                     <label className="flex items-center cursor-pointer">
                                         <input 
                                            type="checkbox" 
                                            checked={daySched.enabled} 
                                            onChange={(e) => handleScheduleChange(day, 'enabled', e.target.checked)}
                                            className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                         />
                                         <span className="ml-2 text-sm text-gray-600">Available</span>
                                     </label>
                                     {daySched.enabled && (
                                         <div className="flex items-center gap-2 ml-auto">
                                             <input 
                                                type="time" 
                                                value={daySched.start} 
                                                onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                                                className="border rounded p-1 text-sm" 
                                             />
                                             <span className="text-gray-400">-</span>
                                             <input 
                                                type="time" 
                                                value={daySched.end} 
                                                onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                                                className="border rounded p-1 text-sm" 
                                             />
                                         </div>
                                     )}
                                     {!daySched.enabled && <div className="ml-auto text-sm text-gray-400 italic">Off Day</div>}
                                 </div>
                             );
                         })}
                     </div>

                     <div className="mt-8 flex justify-end gap-3">
                         <button onClick={() => setSelectedDoctor(null)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                         <button onClick={saveSchedule} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Schedule</button>
                     </div>
                 </div>
             )}
        </div>
      );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
           <p className="text-gray-500">Managing {currentBranch?.name}</p>
        </div>
        <div className="bg-white p-1 rounded-lg border flex shadow-sm">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'overview' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >Overview</button>
            <button 
                onClick={() => setActiveTab('branches')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'branches' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >Branches</button>
            <button 
                onClick={() => setActiveTab('doctors')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'doctors' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >Doctors & Schedule</button>
        </div>
      </div>

      <div className="min-h-[500px]">
         {activeTab === 'overview' && <OverviewStats />}
         {activeTab === 'branches' && <BranchManager />}
         {activeTab === 'doctors' && <DoctorManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;

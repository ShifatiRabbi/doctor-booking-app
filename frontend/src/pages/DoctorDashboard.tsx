import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Printer, Plus, X, Save, Clock, User } from 'lucide-react';
import { Medicine, Prescription } from '../types';

const DoctorDashboard: React.FC = () => {
  const { currentUser, appointments, patients, searchPatients, savePrescription } = useApp();
  const [activeTab, setActiveTab] = useState<'appointments' | 'search'>('appointments');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState<Partial<Prescription>>({
    medicines: [],
    tests: [],
    notes: '',
  });

  // Derived state
  const myAppointments = appointments.filter(a => a.doctorId === currentUser?.id && a.status !== 'completed');
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Prescription Form Handlers
  const addMedicine = () => {
    const med: Medicine = { id: Date.now().toString(), name: '', type: 'Tablet', dosage: '1-0-1', duration: '5 days' };
    setCurrentPrescription(prev => ({ ...prev, medicines: [...(prev.medicines || []), med] }));
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...(currentPrescription.medicines || [])];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentPrescription(prev => ({ ...prev, medicines: updated }));
  };

  const removeMedicine = (index: number) => {
    const updated = [...(currentPrescription.medicines || [])];
    updated.splice(index, 1);
    setCurrentPrescription(prev => ({ ...prev, medicines: updated }));
  };

  const handleSavePrescription = async () => {
    if (!selectedPatientId || !currentUser) return;
    
    // Find associated appointment (demo logic: find first active or create dummy)
    const apt = myAppointments.find(a => a.patientId === selectedPatientId) || { id: 'manual' };

    await savePrescription({
        patientId: selectedPatientId,
        doctorId: currentUser.id,
        appointmentId: apt.id,
        date: new Date().toISOString(),
        medicines: currentPrescription.medicines || [],
        tests: currentPrescription.tests || [],
        notes: currentPrescription.notes || '',
        digitalSignature: `${currentUser.name}, ${new Date().toLocaleDateString()}`
    });
    
    setShowPrescriptionModal(false);
    alert('Prescription Saved & Sent to Print Queue');
    // Reset form
    setCurrentPrescription({ medicines: [], tests: [], notes: '' });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar / Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appointments' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            My Appointments
          </button>
          <button 
             onClick={() => setActiveTab('search')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'search' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Patient Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List Panel */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-200px)] overflow-y-auto">
          {activeTab === 'appointments' ? (
             <div className="divide-y divide-gray-100">
                {myAppointments.length === 0 && <p className="p-6 text-center text-gray-500">No pending appointments.</p>}
                {myAppointments.map(apt => (
                  <div 
                    key={apt.id} 
                    onClick={() => setSelectedPatientId(apt.patientId)}
                    className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedPatientId === apt.patientId ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800">{apt.patientName}</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{apt.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{apt.patientPhone}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                       <Clock size={12} /> Waiting
                    </div>
                  </div>
                ))}
             </div>
          ) : (
            <div className="p-4">
              <div className="relative mb-4">
                <input 
                  type="text" 
                  placeholder="Search name or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <div className="divide-y divide-gray-100">
                 {searchQuery && searchPatients(searchQuery).map(p => (
                   <div 
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${selectedPatientId === p.id ? 'bg-blue-50' : ''}`}
                   >
                     <p className="font-medium text-gray-800">{p.name}</p>
                     <p className="text-xs text-gray-500">{p.phone}</p>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPatient ? (
            <>
              {/* Patient Info Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                 <div className="flex gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <User size={32} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h2>
                      <div className="flex gap-3 text-sm text-gray-500 mt-1">
                        <span>{selectedPatient.gender}, {selectedPatient.age} yrs</span>
                        <span>•</span>
                        <span>{selectedPatient.phone}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{selectedPatient.address}</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setShowPrescriptionModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                 >
                   <Plus size={18} /> New Prescription
                 </button>
              </div>

              {/* History / Previous Prescriptions */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
                <h3 className="font-bold text-gray-800 mb-4">Medical History</h3>
                <div className="text-center text-gray-400 py-10">
                   <p>No previous history accessible securely.</p>
                   <p className="text-xs mt-2">(Data restricted for security)</p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed">
              <User size={48} className="mb-4 opacity-20" />
              <p>Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-800">New Prescription</h2>
                <button onClick={() => setShowPrescriptionModal(false)} className="text-gray-400 hover:text-red-500">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 flex-1">
                {/* Medicines Section */}
                <div>
                   <div className="flex justify-between items-center mb-2">
                     <label className="font-semibold text-gray-700">Medicines (Rx)</label>
                     <button onClick={addMedicine} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                       <Plus size={14} /> Add Drug
                     </button>
                   </div>
                   <div className="space-y-2">
                     {currentPrescription.medicines?.map((med, idx) => (
                       <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded">
                         <input 
                           placeholder="Medicine Name"
                           className="col-span-4 p-2 border rounded text-sm"
                           value={med.name}
                           onChange={e => updateMedicine(idx, 'name', e.target.value)}
                         />
                         <select 
                           className="col-span-2 p-2 border rounded text-sm"
                           value={med.type}
                           onChange={e => updateMedicine(idx, 'type', e.target.value)}
                         >
                            <option>Tablet</option>
                            <option>Syrup</option>
                            <option>Injection</option>
                         </select>
                         <input 
                           placeholder="1-0-1"
                           className="col-span-2 p-2 border rounded text-sm"
                           value={med.dosage}
                           onChange={e => updateMedicine(idx, 'dosage', e.target.value)}
                         />
                         <input 
                           placeholder="Duration"
                           className="col-span-3 p-2 border rounded text-sm"
                           value={med.duration}
                           onChange={e => updateMedicine(idx, 'duration', e.target.value)}
                         />
                         <button onClick={() => removeMedicine(idx)} className="col-span-1 text-red-400 hover:text-red-600 flex justify-center">
                           <X size={16} />
                         </button>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="font-semibold text-gray-700 block mb-2">Advice / Notes</label>
                  <textarea 
                    className="w-full border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={4}
                    value={currentPrescription.notes}
                    onChange={e => setCurrentPrescription({...currentPrescription, notes: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                <button 
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSavePrescription}
                  className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  <Printer size={18} /> Save & Print
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
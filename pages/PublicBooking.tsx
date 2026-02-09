
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, User, Phone, CheckCircle, Activity, AlertCircle } from 'lucide-react';
import { Doctor } from '../types';

const PublicBooking: React.FC = () => {
  const { branches, doctors, addAppointment, registerPatient } = useApp();
  
  const [step, setStep] = useState(1);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientForm, setPatientForm] = useState({ name: '', phone: '', age: '', gender: 'Male', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const filteredDoctors = doctors.filter(d => d.branchId === selectedBranchId);

  // Validation Logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!patientForm.name.trim()) newErrors.name = "Full Name is required";
    if (!patientForm.phone.trim()) {
        newErrors.phone = "Phone Number is required";
    } else if (!/^\d{11}$/.test(patientForm.phone)) {
        newErrors.phone = "Phone must be 11 digits (e.g., 017...)";
    }
    if (!patientForm.age || parseInt(patientForm.age) <= 0 || parseInt(patientForm.age) > 120) {
        newErrors.age = "Valid age is required";
    }
    if (!patientForm.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 1. Register/Find Patient
      const patientId = await registerPatient({
        name: patientForm.name,
        phone: patientForm.phone,
        age: parseInt(patientForm.age),
        gender: patientForm.gender as any,
        address: patientForm.address
      });

      // 2. Create Appointment
      await addAppointment({
        patientId,
        patientName: patientForm.name,
        patientPhone: patientForm.phone,
        doctorId: selectedDoctor!.id,
        doctorName: selectedDoctor!.name,
        branchId: selectedBranchId,
        date: new Date().toISOString().split('T')[0], // Today for demo
        time: selectedSlot
      });

      setBookingId(Math.random().toString(36).substr(2, 6).toUpperCase());
      setStep(4);
    } catch (err) {
      alert("Error booking appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Step Components ---

  const StepBranch = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {branches.map(branch => (
        <div 
          key={branch.id}
          onClick={() => { setSelectedBranchId(branch.id); setStep(2); }}
          className={`cursor-pointer p-6 rounded-xl border-2 transition-all hover:shadow-lg ${selectedBranchId === branch.id ? `border-${branch.colorTheme}-500 bg-${branch.colorTheme}-50` : 'border-gray-200 bg-white'}`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-${branch.colorTheme}-100 text-${branch.colorTheme}-600`}>
             <MapPin size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{branch.name}</h3>
          <p className="text-gray-500 mt-2 text-sm">{branch.location}</p>
          <p className="text-gray-500 text-sm mt-1">{branch.contact}</p>
        </div>
      ))}
    </div>
  );

  const StepDoctor = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Select a Doctor</h3>
      {filteredDoctors.length === 0 && <p className="text-gray-500">No doctors available in this branch yet.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map(doc => (
           <div 
             key={doc.id}
             onClick={() => { setSelectedDoctor(doc); }}
             className={`p-4 rounded-lg border cursor-pointer flex items-center gap-4 transition-all ${selectedDoctor?.id === doc.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
           >
             <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
               DR
             </div>
             <div>
               <h4 className="font-bold text-gray-800">{doc.name}</h4>
               <p className="text-sm text-gray-600">{doc.specialty}</p>
               <p className="text-xs text-gray-500 mt-1">{doc.degree}</p>
               <p className="text-sm font-semibold text-blue-600 mt-1">Fee: ৳{doc.fees}</p>
             </div>
           </div>
        ))}
      </div>
      
      {selectedDoctor && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Available Slots (Today)</h3>
          <div className="flex flex-wrap gap-3">
            {selectedDoctor.availableSlots.length > 0 ? selectedDoctor.availableSlots.map(slot => (
              <button
                key={slot}
                onClick={() => { setSelectedSlot(slot); setStep(3); }}
                className="px-4 py-2 rounded-full border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {slot}
              </button>
            )) : <p className="text-sm text-red-500">No slots available today.</p>}
          </div>
        </div>
      )}
    </div>
  );

  const StepDetails = () => (
    <form onSubmit={handleBook} className="max-w-md mx-auto space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Patient Details</h3>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-800 border border-blue-100">
        <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
        <p><strong>Time:</strong> {selectedSlot} (Today)</p>
        <p><strong>Branch:</strong> {branches.find(b => b.id === selectedBranchId)?.name}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm rounded-md p-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="John Doe"
            value={patientForm.name}
            onChange={e => setPatientForm({...patientForm, name: e.target.value})}
          />
        </div>
        {errors.name && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone size={16} className="text-gray-400" />
          </div>
          <input
            type="tel"
            className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm rounded-md p-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="01712345678"
            value={patientForm.phone}
            onChange={e => setPatientForm({...patientForm, phone: e.target.value})}
          />
        </div>
        {errors.phone && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.phone}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-gray-700">Age <span className="text-red-500">*</span></label>
           <input
            type="number"
            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${errors.age ? 'border-red-300' : 'border-gray-300'}`}
            value={patientForm.age}
            onChange={e => setPatientForm({...patientForm, age: e.target.value})}
           />
           {errors.age && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.age}</p>}
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Gender</label>
           <select 
             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
             value={patientForm.gender}
             onChange={e => setPatientForm({...patientForm, gender: e.target.value})}
           >
             <option>Male</option>
             <option>Female</option>
             <option>Other</option>
           </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
        <textarea
            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
            rows={2}
            value={patientForm.address}
            onChange={e => setPatientForm({...patientForm, address: e.target.value})}
        />
        {errors.address && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.address}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
      </button>
    </form>
  );

  const StepSuccess = () => (
    <div className="text-center py-12 animate-bounce-in">
       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
         <CheckCircle size={40} />
       </div>
       <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
       <p className="text-gray-600 mb-6">You will receive an SMS shortly with details.</p>
       
       <div className="bg-white p-6 rounded-lg shadow-sm border inline-block text-left w-full max-w-md">
         <div className="flex justify-between border-b pb-2 mb-2">
           <span className="text-gray-500">Booking ID</span>
           <span className="font-mono font-bold">{bookingId}</span>
         </div>
         <div className="flex justify-between border-b pb-2 mb-2">
           <span className="text-gray-500">Doctor</span>
           <span className="font-medium">{selectedDoctor?.name}</span>
         </div>
         <div className="flex justify-between border-b pb-2 mb-2">
           <span className="text-gray-500">Time</span>
           <span className="font-medium">{selectedSlot}</span>
         </div>
         <div className="flex justify-between">
           <span className="text-gray-500">Branch</span>
           <span className="font-medium">{branches.find(b => b.id === selectedBranchId)?.name}</span>
         </div>
       </div>

       <div className="mt-8">
         <button onClick={() => window.location.reload()} className="text-blue-600 font-medium hover:underline">
           Book Another Appointment
         </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Activity size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">MediNexus <span className="text-gray-400 font-light text-lg">| Online Booking</span></h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {step < 4 && (
          <div className="mb-8 flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Select a Branch</h2>
            <StepBranch />
          </>
        )}
        
        {step === 2 && (
          <>
             <button onClick={() => setStep(1)} className="mb-4 text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1">
               &larr; Back to Branches
             </button>
             <StepDoctor />
          </>
        )}

        {step === 3 && (
          <>
             <button onClick={() => setStep(2)} className="mb-4 text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1">
               &larr; Back to Doctors
             </button>
             <StepDetails />
          </>
        )}

        {step === 4 && <StepSuccess />}
      </main>
    </div>
  );
};

export default PublicBooking;

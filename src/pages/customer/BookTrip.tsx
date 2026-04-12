import PortalLayout from '@/components/layout/PortalLayout';
import { TRANSPORT_TYPES } from '@/constants';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, CreditCard, MapPin, Calendar, ShieldCheck, Phone, Users, Info, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

const STEPS = ['Select Transport', 'Booking Details', 'Payment Deadlines', 'Review'];

export default function BookTrip() {
  const [step, setStep] = useState(1);
  const [selectedTransport, setSelectedTransport] = useState(TRANSPORT_TYPES[0]);
  
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    age: '',
    phone1: '',
    phone2: '',
    startDate: '',
    pickupAddress: '',
    dropAddress: '',
    totalMembers: '',
    totalMales: '',
    totalFemales: '',
    prePaymentDeadline: '',
    postPaymentDeadline: '',
    halfPaymentDeadline: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <PortalLayout role="customer" title="Book a New Trip">
      <div className="max-w-[1200px] mx-auto w-full space-y-8 md:space-y-10">
        {/* Stepper - Desktop */}
        <div className="hidden md:flex items-center justify-center gap-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shrink-0",
                step > i + 1 ? "bg-green-500 text-white" : 
                step === i + 1 ? "bg-primary text-white shadow-md shadow-primary/20" : 
                "bg-white text-text-muted border border-gray-200"
              )}>
                {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn(
                "text-[13px] font-semibold whitespace-nowrap",
                step === i + 1 ? "text-secondary" : "text-text-muted"
              )}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-10 h-px bg-gray-200 ml-2" />}
            </div>
          ))}
        </div>

        {/* Stepper - Mobile */}
        <div className="md:hidden bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Step {step} of 4</span>
            <span className="text-xs font-bold text-secondary">{STEPS[step - 1]}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-sm overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] min-h-[500px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-display font-bold text-secondary">Choose Your Transport</h2>
                  <p className="text-sm text-text-muted">Select the vehicle that best fits your group size.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {TRANSPORT_TYPES.map((transport) => (
                    <div 
                      key={transport.id}
                      onClick={() => setSelectedTransport(transport)}
                      className={cn(
                        "cursor-pointer rounded-lg border p-4 flex items-center gap-3 md:gap-4 transition-all duration-200",
                        selectedTransport.id === transport.id ? "border-primary bg-primary-light/30 ring-1 ring-primary" : "border-gray-100 hover:border-primary/30 hover:shadow-sm"
                      )}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img src={transport.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-secondary text-sm md:text-base">{transport.name}</h4>
                        <p className="text-xs text-text-muted flex items-center gap-1">
                          <Users className="h-3 w-3" /> Up to {transport.capacity} Seater
                        </p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                        selectedTransport.id === transport.id ? "border-primary bg-primary" : "border-gray-300"
                      )}>
                        {selectedTransport.id === transport.id && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" /> Booking Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Booking Person Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="input-field h-[44px] rounded-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="input-field h-[44px] rounded-sm">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Age</label>
                      <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Age" className="input-field h-[44px] rounded-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Phone No 1 (WhatsApp)</label>
                      <input type="tel" name="phone1" value={formData.phone1} onChange={handleInputChange} placeholder="WhatsApp Number" className="input-field h-[44px] rounded-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Phone No 2</label>
                      <input type="tel" name="phone2" value={formData.phone2} onChange={handleInputChange} placeholder="Secondary Number" className="input-field h-[44px] rounded-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Travel Start Date
                      </label>
                      <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="input-field h-[44px] rounded-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <Users className="h-3 w-3" /> Total Members
                      </label>
                      <input type="number" name="totalMembers" value={formData.totalMembers} onChange={handleInputChange} placeholder="Total" className="input-field h-[44px] rounded-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total Males</label>
                      <input type="number" name="totalMales" value={formData.totalMales} onChange={handleInputChange} placeholder="Males" className="input-field h-[44px] rounded-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total Females</label>
                      <input type="number" name="totalFemales" value={formData.totalFemales} onChange={handleInputChange} placeholder="Females" className="input-field h-[44px] rounded-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Pick up Address
                      </label>
                      <textarea name="pickupAddress" value={formData.pickupAddress} onChange={handleInputChange} rows={2} placeholder="Enter full pick up address" className="input-field rounded-sm resize-none py-3"></textarea>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Drop Address
                      </label>
                      <textarea name="dropAddress" value={formData.dropAddress} onChange={handleInputChange} rows={2} placeholder="Enter full drop address" className="input-field rounded-sm resize-none py-3"></textarea>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-display font-bold text-secondary">Payment Deadlines</h2>
                  <p className="text-sm text-text-muted">Set the dates for your payment installments.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-lg border border-gray-100 bg-gray-50/30 space-y-4">
                    <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center text-green-600">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-secondary">Pre Payment</h4>
                      <p className="text-[11px] text-text-muted leading-relaxed">Full payment before travel starts.</p>
                    </div>
                    <input 
                      type="date" 
                      name="prePaymentDeadline" 
                      value={formData.prePaymentDeadline} 
                      onChange={handleInputChange} 
                      className="input-field h-[44px] rounded-sm bg-white" 
                    />
                  </div>

                  <div className="p-6 rounded-lg border border-gray-100 bg-gray-50/30 space-y-4">
                    <div className="bg-orange-50 w-10 h-10 rounded-lg flex items-center justify-center text-orange-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-secondary">Post Payment</h4>
                      <p className="text-[11px] text-text-muted leading-relaxed">Payment after confirmation.</p>
                    </div>
                    <input 
                      type="date" 
                      name="postPaymentDeadline" 
                      value={formData.postPaymentDeadline} 
                      onChange={handleInputChange} 
                      className="input-field h-[44px] rounded-sm bg-white" 
                    />
                  </div>

                  <div className="p-6 rounded-lg border border-gray-100 bg-gray-50/30 space-y-4">
                    <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-secondary">Half Payment</h4>
                      <p className="text-[11px] text-text-muted leading-relaxed">50% installment payment date.</p>
                    </div>
                    <input 
                      type="date" 
                      name="halfPaymentDeadline" 
                      value={formData.halfPaymentDeadline} 
                      onChange={handleInputChange} 
                      className="input-field h-[44px] rounded-sm bg-white" 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="bg-gray-50/50 p-6 md:p-8 rounded-lg border border-gray-100 space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 pb-6 gap-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-secondary">{selectedTransport.name}</h3>
                      <p className="text-sm text-text-muted flex items-center gap-1.5 mt-1">
                        <Users className="h-4 w-4" /> {formData.totalMembers} Members ({formData.totalMales} M, {formData.totalFemales} F)
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Travel Date</p>
                      <p className="text-lg font-bold text-primary">{formData.startDate || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Contact Details</h4>
                      <div className="space-y-2.5">
                        <p className="text-sm font-bold text-secondary">{formData.name}</p>
                        <div className="space-y-1.5">
                          <p className="text-sm text-text-muted flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-primary" /> {formData.phone1} (WhatsApp)
                          </p>
                          {formData.phone2 && (
                            <p className="text-sm text-text-muted flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-primary" /> {formData.phone2}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Route Details</h4>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                          <div>
                            <p className="text-[10px] uppercase font-bold text-text-muted">Pick up</p>
                            <p className="text-sm text-secondary font-medium">{formData.pickupAddress || 'Not set'}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(229,57,53,0.4)]" />
                          <div>
                            <p className="text-[10px] uppercase font-bold text-text-muted">Drop</p>
                            <p className="text-sm text-secondary font-medium">{formData.dropAddress || 'Not set'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4">Payment Deadlines</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Pre Payment</p>
                        <p className="text-sm font-bold text-secondary">{formData.prePaymentDeadline || 'Not set'}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Post Payment</p>
                        <p className="text-sm font-bold text-secondary">{formData.postPaymentDeadline || 'Not set'}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Half Payment</p>
                        <p className="text-sm font-bold text-secondary">{formData.halfPaymentDeadline || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-primary-light/20 rounded-lg border border-primary/10">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary mt-0.5" />
                  <label className="text-sm text-secondary font-medium leading-relaxed">I confirm that all the details provided above are accurate and I agree to the terms of service.</label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="h-[44px] px-6 rounded-md border border-gray-200 font-bold text-text-muted hover:bg-gray-50 hover:text-secondary transition-all flex items-center gap-2 disabled:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <button 
            onClick={() => step === 4 ? alert('Booking Confirmed!') : setStep(Math.min(4, step + 1))}
            className="h-[44px] px-8 rounded-md bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          >
            {step === 4 ? 'Confirm Booking' : 'Continue'} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </PortalLayout>
  );
}

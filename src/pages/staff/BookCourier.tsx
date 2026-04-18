import PortalLayout from '@/components/layout/PortalLayout';
import { COURIER_LOCATIONS, COURIER_RATE_PER_KG } from '@/constants';
import { cn, formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Package, 
  Weight, 
  Info, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

type Phase = 1 | 2 | 3 | 4;

export default function BookCourier() {
  const today = new Date().toISOString().split('T')[0];
  const [phase, setPhase] = useState<Phase>(1);
  // Mocking staff's assigned location (in a real app, this would come from auth context)
  const staffLocation = 'Chennai'; 
  
  const [formData, setFormData] = useState({
    deliveryLocation: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    isFragile: false,
    description: '',
    weight: 1,
    paymentType: 'pre' as 'pre' | 'post' | 'half',
    paymentMethod: '' as 'cash' | 'online' | '',
    prePaymentDate: today,
    postPaymentDate: '',
    halfPaymentDate: '',
  });

  const availableDeliveryLocations = COURIER_LOCATIONS.filter(loc => loc !== staffLocation);

  const handleNext = () => setPhase((prev) => (prev + 1) as Phase);
  const handleBack = () => setPhase((prev) => (prev - 1) as Phase);

  const totalPrice = formData.weight * COURIER_RATE_PER_KG;

  return (
    <PortalLayout role="staff" title="New Courier Booking">
      <div className="max-w-4xl mx-auto">
        {/* Progress Stepper */}
        <div className="mb-12 px-4">
          <div className="relative">
            {/* Background Line (Gray) */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2" />
            
            {/* Progress Line (Primary Color) */}
            <motion.div 
              className="absolute top-5 left-0 h-[2px] bg-primary -translate-y-1/2 origin-left"
              initial={{ width: 0 }}
              animate={{ width: `${((phase - 1) / 3) * 100}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />

            <div className="relative flex justify-between items-start">
              {[
                { n: 1, label: 'Location' },
                { n: 2, label: 'Details' },
                { n: 3, label: 'Payment' },
                { n: 4, label: 'Review' }
              ].map((step) => {
                const isCompleted = phase > step.n;
                const isActive = phase === step.n;
                
                return (
                  <div key={step.n} className="flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all duration-500 border-2",
                      isCompleted ? "bg-primary border-primary text-white shadow-md" :
                      isActive ? "bg-white border-primary text-primary shadow-lg scale-110" :
                      "bg-white border-gray-100 text-gray-400"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm">{step.n}</span>
                      )}
                    </div>
                    <span className={cn(
                      "mt-3 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                      isActive || isCompleted ? "text-primary" : "text-gray-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Phase 1: Location Selection */}
            {phase === 1 && (
              <motion.div
                key="phase1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-bold text-secondary">Select Delivery Location</h2>
                  <p className="text-sm text-text-muted">Origin: <span className="font-bold text-primary">{staffLocation}</span></p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {availableDeliveryLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setFormData({ ...formData, deliveryLocation: loc })}
                      className={cn(
                        "p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3",
                        formData.deliveryLocation === loc 
                          ? "border-primary bg-primary/5 text-primary shadow-md" 
                          : "border-gray-100 hover:border-primary/30 text-text-muted"
                      )}
                    >
                      <MapPin className={cn("h-8 w-8", formData.deliveryLocation === loc ? "text-primary" : "text-gray-300")} />
                      <span className="font-bold">{loc}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    disabled={!formData.deliveryLocation}
                    onClick={handleNext}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    Next Phase <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Phase 2: Customer & Product Details */}
            {phase === 2 && (
              <motion.div
                key="phase2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 space-y-6"
              >
                <h2 className="text-2xl font-display font-bold text-secondary text-center">Customer & Parcel Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Customer Info</h3>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="input-label">Customer Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input 
                            type="text" 
                            className="input-field pl-10" 
                            placeholder="John Doe"
                            value={formData.customerName}
                            onChange={e => setFormData({...formData, customerName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="input-label">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input 
                            type="email" 
                            className="input-field pl-10" 
                            placeholder="john@example.com"
                            value={formData.customerEmail}
                            onChange={e => setFormData({...formData, customerEmail: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="input-label">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input 
                            type="tel" 
                            className="input-field pl-10" 
                            placeholder="+91 98765 43210"
                            value={formData.customerPhone}
                            onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Parcel Info</h3>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="input-label">Product Description</label>
                        <div className="relative">
                          <Package className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <textarea 
                            className="input-field pl-10 min-h-[100px] py-2" 
                            placeholder="Describe the items..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                        <input 
                          type="checkbox" 
                          id="fragile" 
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                          checked={formData.isFragile}
                          onChange={e => setFormData({...formData, isFragile: e.target.checked})}
                        />
                        <label htmlFor="fragile" className="text-sm font-medium text-secondary flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500" /> Fragile Product
                        </label>
                      </div>
                      <div className="space-y-1.5">
                        <label className="input-label">Weight (Kilo)</label>
                        <div className="relative">
                          <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input 
                            type="number" 
                            className="input-field pl-10" 
                            min="1"
                            value={formData.weight}
                            onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                          />
                        </div>
                        <p className="text-[10px] text-text-muted flex items-center gap-1 mt-1">
                          <Info className="h-3 w-3" /> Rate: {formatCurrency(COURIER_RATE_PER_KG)} per kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg flex justify-between items-center border border-primary/10">
                  <span className="text-sm font-medium text-secondary">Estimated Rate</span>
                  <span className="text-xl font-display font-bold text-primary">{formatCurrency(totalPrice)}</span>
                </div>

                <div className="pt-6 flex justify-between">
                  <button onClick={handleBack} className="btn-outline flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    disabled={!formData.customerName || !formData.customerPhone || !formData.description}
                    onClick={handleNext}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    Next Phase <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Phase 3: Payment Deadline */}
            {phase === 3 && (
              <motion.div
                key="phase3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 space-y-8"
              >
                <h2 className="text-2xl font-display font-bold text-secondary text-center">Payment Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Left Column: Deadlines */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Payment Schedule</h3>
                    <div className="space-y-4">
                      {[
                        { id: 'pre', label: 'Pre Payment', icon: CreditCard, desc: 'Full payment now' },
                        { id: 'post', label: 'Post Payment', icon: Calendar, desc: 'On delivery' },
                        { id: 'half', label: 'Half Payment', icon: Info, desc: '50% now, 50% later' },
                      ].map((type) => (
                        <div 
                          key={type.id}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all cursor-pointer",
                            formData.paymentType === type.id ? "border-primary bg-primary/5 shadow-sm" : "border-gray-100 hover:border-gray-200"
                          )}
                          onClick={() => setFormData({...formData, paymentType: type.id as any})}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={cn("p-2 rounded-md", formData.paymentType === type.id ? "bg-primary text-white" : "bg-gray-50 text-gray-400")}>
                                <type.icon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-secondary leading-none">{type.label}</p>
                                <p className="text-[10px] text-text-muted mt-1">{type.desc}</p>
                              </div>
                            </div>
                            <div className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                              formData.paymentType === type.id ? "border-primary" : "border-gray-300"
                            )}>
                              {formData.paymentType === type.id && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                          </div>

                          {formData.paymentType === type.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="pt-3 border-t border-primary/10 mt-3"
                            >
                              <label className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 block">Deadline Date</label>
                              <input 
                                type="date" 
                                className="input-field h-9 text-xs"
                                min={today}
                                value={
                                  type.id === 'pre' ? formData.prePaymentDate :
                                  type.id === 'post' ? formData.postPaymentDate :
                                  formData.halfPaymentDate
                                }
                                onChange={e => {
                                  const val = e.target.value;
                                  if (type.id === 'pre') setFormData({...formData, prePaymentDate: val});
                                  else if (type.id === 'post') setFormData({...formData, postPaymentDate: val});
                                  else setFormData({...formData, halfPaymentDate: val});
                                }}
                              />
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Methods */}
                  <div className="space-y-4 md:pt-0">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Payment Method</h3>
                    <div className="flex flex-col gap-4">
                      <label className={cn(
                        "flex items-center gap-4 p-5 rounded-lg border-2 cursor-pointer transition-all",
                        formData.paymentMethod === 'cash' ? "border-red-600 bg-red-50 shadow-sm" : "border-gray-100 hover:border-gray-200"
                      )}>
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-600 focus:ring-offset-0"
                            checked={formData.paymentMethod === 'cash'}
                            onChange={() => setFormData({...formData, paymentMethod: 'cash'})}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-secondary">Cash Payment</span>
                          <span className="text-[10px] text-text-muted">Direct cash collection</span>
                        </div>
                      </label>
                      <label className={cn(
                        "flex items-center gap-4 p-5 rounded-lg border-2 cursor-pointer transition-all",
                        formData.paymentMethod === 'online' ? "border-red-600 bg-red-50 shadow-sm" : "border-gray-100 hover:border-gray-200"
                      )}>
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-600 focus:ring-offset-0"
                            checked={formData.paymentMethod === 'online'}
                            onChange={() => setFormData({...formData, paymentMethod: 'online'})}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-secondary">Online Payment</span>
                          <span className="text-[10px] text-text-muted">UPI, Card or Net Banking</span>
                        </div>
                      </label>
                    </div>

                    <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-100 italic text-[11px] text-text-muted">
                      <p>Note: Payment deadlines are strictly enforced. Pre-payments must be collected before the shipment leaves the origin facility.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-between border-t border-gray-100">
                  <button onClick={handleBack} className="btn-outline flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    disabled={
                      ((formData.paymentType === 'pre' && !formData.prePaymentDate) ||
                      (formData.paymentType === 'post' && !formData.postPaymentDate) ||
                      (formData.paymentType === 'half' && !formData.halfPaymentDate)) ||
                      !formData.paymentMethod
                    }
                    onClick={handleNext}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    Next Phase <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Phase 4: Review & Confirm */}
            {phase === 4 && (
              <motion.div
                key="phase4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-display font-bold text-secondary">Review Booking</h2>
                  <p className="text-sm text-text-muted">Please verify all details before confirming</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <section className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Route Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">From</span>
                          <span className="font-bold text-secondary">{staffLocation}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">To</span>
                          <span className="font-bold text-secondary">{formData.deliveryLocation}</span>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Customer Details</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <p className="text-sm font-bold text-secondary">{formData.customerName}</p>
                        <p className="text-xs text-text-muted">{formData.customerEmail}</p>
                        <p className="text-xs text-text-muted">{formData.customerPhone}</p>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Parcel & Payment</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Weight</span>
                          <span className="font-bold text-secondary">{formData.weight} kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Fragile</span>
                          <span className={cn("font-bold", formData.isFragile ? "text-orange-600" : "text-green-600")}>
                            {formData.isFragile ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Payment</span>
                          <span className="font-bold text-secondary capitalize">{formData.paymentType} Payment</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Payment Mode</span>
                          <span className="font-bold text-secondary capitalize">{formData.paymentMethod}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-sm font-bold text-secondary">Total Rate</span>
                          <span className="text-lg font-display font-bold text-primary">{formatCurrency(totalPrice)}</span>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Description</h3>
                      <p className="text-sm text-text-muted bg-gray-50 p-4 rounded-lg italic">
                        "{formData.description}"
                      </p>
                    </section>
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <button onClick={handleBack} className="btn-outline flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={() => {
                      alert('Booking Confirmed Successfully!');
                      window.location.href = '/staff/bookings';
                    }}
                    className="btn-primary flex items-center gap-2 px-10"
                  >
                    Confirm Booking <CheckCircle2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PortalLayout>
  );
}

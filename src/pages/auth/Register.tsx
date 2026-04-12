import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// --- Types ---
type Step = 1 | 2 | 3;

// --- OTP Input Component ---
interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, disabled }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newOtp = value.split('');
    newOtp[index] = val.slice(-1);
    const updatedValue = newOtp.join('');
    onChange(updatedValue);

    // Move to next input if value is entered
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    onChange(pastedData.padEnd(6, ''));
  };

  return (
    <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={disabled}
          className="flex-1 aspect-square max-w-[48px] min-w-0 text-center text-lg font-bold border border-gray-200 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:bg-gray-50"
        />
      ))}
    </div>
  );
};

// --- Main Register Component ---
export default function Register() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  // Timer logic for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // --- API Mocks ---
  const sendOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock API call
      console.log('POST /send-otp', { email });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(2);
      setTimer(60);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Mock API call
      console.log('POST /verify-otp', { email, otp });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(3);
    } catch (err) {
      setError('Invalid OTP. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Mock API call
      console.log('POST /register', { email, password });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Success!
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-2">
            <div className="bg-primary p-2 rounded-md">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="text-sidebar-logo font-display font-bold text-secondary tracking-tight">
              Voyage<span className="text-primary">Arc</span>
            </span>
          </Link>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 w-8 rounded-full transition-all duration-300",
                  step >= s ? "bg-primary" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-gray-100">
          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-display font-bold text-secondary">Create Account</h2>
                  <p className="text-sm text-text-muted mt-1">Enter your email to get started</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="input-label">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        className="input-field pl-10 h-11"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                  <button
                    onClick={sendOtp}
                    disabled={isLoading || !email}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-button disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue'}
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to email
                </button>

                <div className="text-center">
                  <h2 className="text-2xl font-display font-bold text-secondary">Verify Email</h2>
                  <p className="text-sm text-text-muted mt-1">
                    Enter the 6-digit code sent to <span className="font-bold text-secondary">{email}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />

                  {error && <p className="text-xs text-red-500 font-medium text-center">{error}</p>}

                  <div className="space-y-4">
                    <button
                      onClick={verifyOtp}
                      disabled={isLoading || otp.length !== 6}
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-button disabled:opacity-70"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify OTP'}
                    </button>

                    <div className="text-center">
                      {timer > 0 ? (
                        <p className="text-xs text-text-muted">Resend code in <span className="font-bold text-primary">{timer}s</span></p>
                      ) : (
                        <button
                          onClick={sendOtp}
                          disabled={isLoading}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-display font-bold text-secondary">Set Password</h2>
                  <p className="text-sm text-text-muted mt-1">Secure your account with a password</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="input-label">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="input-field pl-10 pr-10 h-11"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="input-label">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="input-field pl-10 h-11"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                  <button
                    onClick={handleRegister}
                    disabled={isLoading || !password || !confirmPassword}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-button disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                    {!isLoading && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-text-muted mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

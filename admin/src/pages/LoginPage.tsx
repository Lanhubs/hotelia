import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Lock, Mail, Building, UserCheck, ArrowRight, Eye, EyeOff, AlertCircle, Clock, Check, LockKeyhole } from 'lucide-react';
import { useAuthStore, UserRole } from '../stores/authStore';
import { LoginBrandShowcase } from '../components/auth/LoginBrandShowcase';
import { ForgotCredentialsModal } from '../components/auth/ForgotCredentialsModal';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [selectedRole, setSelectedRole] = useState<UserRole>('manager');
  const [email, setEmail] = useState('marcus.vance@keoexperience.com');
  const [password, setPassword] = useState('KeoGM@2026!');
  const [securityPin, setSecurityPin] = useState('1234');
  const [shift, setShift] = useState('General Oversight (Day)');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'pin'>('password');
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'manager' || role === 'admin') {
      setEmail('marcus.vance@keoexperience.com');
      setPassword('KeoGM@2026!');
      setShift('General Oversight (Day)');
    } else {
      setEmail('elena.rostova@keoexperience.com');
      setPassword('KeoFD@2026!');
      setShift('Morning Shift (06:00 - 14:00)');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setErrorMessage(null);
    setTimeout(async () => {
      setIsLoading(false);
      const success = await login(email, selectedRole, shift, password);
      if (success) { navigate('/dashboard'); } else { setErrorMessage('Invalid credentials.'); }
    }, 600);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setIsLoading(true); handleRoleSelect(role);
    const targetEmail = role === 'manager' ? 'marcus.vance@keoexperience.com' : 'elena.rostova@keoexperience.com';
    const targetShift = role === 'manager' ? 'General Oversight (Day)' : 'Morning Shift (06:00 - 14:00)';
    const targetPassword = role === 'manager' ? 'KeoGM@2026!' : 'KeoFD@2026!';
    setTimeout(async () => {
      setIsLoading(false);
      await login(targetEmail, role, targetShift, targetPassword);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] text-zinc-900 font-sans">
      <LoginBrandShowcase />

      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-[#F8FAFC]">
        <div className="w-full max-w-md space-y-7 bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">Staff Portal Access</h2>
            <p className="text-xs text-zinc-500 font-medium">Select your operational profile and enter your credentials.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 block">Choose Access Role:</label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleRoleSelect('manager')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedRole === 'manager' || selectedRole === 'admin'
                    ? 'bg-ink/5 border-ink text-zinc-900 shadow-xs ring-1 ring-ink/30'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                    selectedRole === 'manager' || selectedRole === 'admin' ? 'bg-ink text-white' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    <Building className="w-4 h-4" />
                  </div>
                  {(selectedRole === 'manager' || selectedRole === 'admin') && (
                    <span className="w-4 h-4 rounded-full bg-ink text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs">General Manager</div>
                <div className="text-[10px] text-zinc-400 font-medium">Full Audit & Analytics</div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('receptionist')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedRole === 'receptionist'
                    ? 'bg-ink/5 border-ink text-zinc-900 shadow-xs ring-1 ring-ink/30'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                    selectedRole === 'receptionist' ? 'bg-ink text-white' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    <UserCheck className="w-4 h-4" />
                  </div>
                  {selectedRole === 'receptionist' && (
                    <span className="w-4 h-4 rounded-full bg-ink text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs">Front Desk Receptionist</div>
                <div className="text-[10px] text-zinc-400 font-medium">Walk-Ins, Keys & Folios</div>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-100/80 border border-zinc-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-ink font-medium">
              <LockKeyhole className="w-4 h-4 text-ink shrink-0" />
              <span>Quick Access:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('manager')}
                className="px-2.5 py-1 bg-ink hover:bg-zinc-800 text-white rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
              >
                GM Portal
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('receptionist')}
                className="px-2.5 py-1 bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-100 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
              >
                Reception Desk
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Staff Email or ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. staff.member@keoexperience.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium focus:ring-2 focus:ring-ink/20 focus:border-ink outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700">
                  {loginMethod === 'password' ? 'Password' : 'Terminal PIN'}
                </label>
                <button
                  type="button"
                  onClick={() => setLoginMethod(loginMethod === 'password' ? 'pin' : 'password')}
                  className="text-[11px] text-ink font-bold cursor-pointer hover:underline"
                >
                  Use {loginMethod === 'password' ? 'PIN' : 'Password'}
                </button>
              </div>

              <div className="relative">
                {loginMethod === 'password' ? (
                  <>
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium focus:ring-2 focus:ring-ink/20 focus:border-ink outline-none"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword((prev) => !prev);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-mono tracking-widest focus:ring-2 focus:ring-ink/20 focus:border-ink outline-none"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 flex items-center justify-between">
                <span>Shift Duty Assignment</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-ink/20 focus:border-ink outline-none"
                >
                  <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                  <option value="Afternoon Shift (14:00 - 22:00)">Afternoon Shift (14:00 - 22:00)</option>
                  <option value="Night Audit (22:00 - 06:00)">Night Audit (22:00 - 06:00)</option>
                  <option value="General Oversight (Day)">General Oversight (Day Executive)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberTerminal}
                  onChange={(e) => setRememberTerminal(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-zinc-300 accent-ink text-ink cursor-pointer"
                />
                <span>Remember terminal</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-ink font-bold cursor-pointer hover:underline"
              >
                Forgot PIN / Access?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-ink hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Terminal...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <ForgotCredentialsModal isOpen={showForgotModal} defaultEmail={email} onClose={() => setShowForgotModal(false)} />
    </div>
  );
};

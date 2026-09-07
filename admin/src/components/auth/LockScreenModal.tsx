import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, ArrowRight, AlertCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const LockScreenModal: React.FC = () => {
  const { isLocked, currentUser, unlockTerminal, logout } = useAuthStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockTerminal(pin);
    if (!success) {
      setError(true);
      setPin('');
    } else {
      setError(false);
      setPin('');
    }
  };

  const handleQuickUnlock = () => {
    unlockTerminal('1234');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-[#090D16]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121826] border border-zinc-800 rounded-3xl max-w-sm w-full p-7 space-y-6 shadow-2xl text-center text-zinc-100 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-ink/20 rounded-full blur-2xl pointer-events-none" />

        {/* Lock Icon & Avatar */}
        <div className="relative flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-ink/60 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-ink text-white flex items-center justify-center shadow-md">
              <Lock className="w-3 h-3" />
            </div>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
            <p className="text-xs text-indigo-300 font-semibold">{currentUser.roleTitle}</p>
            <span className="text-[10px] text-zinc-500 block">{currentUser.shift}</span>
          </div>
        </div>

        {/* PIN Entry Form */}
        <form onSubmit={handleUnlock} className="space-y-3">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-zinc-400 text-center block">
              Enter 4-Digit Security PIN (Default: <span className="text-indigo-400 font-mono">1234</span>)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={4}
                autoFocus
                required
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="• • • •"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B0F19] border border-zinc-800 rounded-xl text-sm font-mono tracking-widest text-center text-white focus:outline-none focus:ring-2 focus:ring-ink/40 focus:border-ink"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-400 font-medium flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Incorrect PIN. Try 1234 or unlock below.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Quick Unlock
            </button>
            <button
              type="submit"
              className="py-2.5 px-3 rounded-xl bg-ink hover:bg-[#4338CA] text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unlock</span>
            </button>
          </div>
        </form>

        {/* Switch / Sign Out Options */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center gap-4 text-xs">
          <button
            type="button"
            onClick={logout}
            className="text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Staff / Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

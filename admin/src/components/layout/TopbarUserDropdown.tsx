import React from 'react';
import { ChevronDown, Shield, Lock, LogOut } from 'lucide-react';
import { StaffUser } from '../../stores/authStore';

interface TopbarUserDropdownProps {
  currentUser: StaffUser;
  isManager: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onOpenSwitchModal: () => void;
  onLockTerminal: () => void;
  onSignOut: () => void;
}

export const TopbarUserDropdown: React.FC<TopbarUserDropdownProps> = ({
  currentUser,
  isManager,
  isOpen,
  onToggle,
  onOpenSwitchModal,
  onLockTerminal,
  onSignOut,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-zinc-200/80 hover:bg-zinc-50 transition-colors cursor-pointer"
      >
        <img
          src={currentUser.avatarUrl || null as any}
          alt={currentUser.name}
          className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-200"
        />
        <div className="hidden sm:block text-left">
          <div className="text-xs font-bold text-zinc-900 leading-tight truncate max-w-[100px]">
            {currentUser.name.split(' ')[0]}
          </div>
          <div className="text-[10px] text-zinc-400 font-medium leading-tight">
            {isManager ? 'Executive' : 'Front Desk'}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-2 border-b border-zinc-100">
            <div className="font-bold text-zinc-900">{currentUser.name}</div>
            <div className="text-[11px] text-zinc-400">{currentUser.email}</div>
            <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">{currentUser.shift}</div>
          </div>

          <div className="py-1">
            <button
              onClick={onOpenSwitchModal}
              className="w-full px-4 py-2 text-left hover:bg-zinc-50 flex items-center gap-2 text-zinc-700 font-semibold cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Switch Role ({isManager ? 'Front Desk' : 'General Manager'})</span>
            </button>

            <button
              onClick={onLockTerminal}
              className="w-full px-4 py-2 text-left hover:bg-zinc-50 flex items-center gap-2 text-zinc-700 font-semibold cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Lock Terminal</span>
            </button>
          </div>

          <div className="border-t border-zinc-100 pt-1">
            <button
              onClick={onSignOut}
              className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

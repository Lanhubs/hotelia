import React, { useState } from 'react';
import { LogOut, Lock, UserCheck, Shield, ChevronDown } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { useAuthStore } from '../../stores/authStore';
import { SwitchRoleModal } from '../auth/SwitchRoleModal';
import { useNavigate } from 'react-router-dom';

interface SidebarUserProps {
  isCollapsed: boolean;
}

export const SidebarUser: React.FC<SidebarUserProps> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const { currentUser, lockTerminal, logout } = useAuthStore();
  const [isSwitchRoleOpen, setIsSwitchRoleOpen] = useState(false);

  const isManager = currentUser.role === 'manager' || currentUser.role === 'admin';

  const userTooltip = (
    <div className="flex flex-col gap-0.5 text-left">
      <span className="font-semibold text-zinc-900">{currentUser.name}</span>
      <span className="text-[10px] text-zinc-400">{currentUser.roleTitle}</span>
      <span className="text-[9px] text-ink font-bold">{currentUser.email}</span>
    </div>
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="p-3 border-t border-zinc-100 bg-white">
        <div
          className={`flex items-center rounded-xl p-1 transition-colors duration-150 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <Tooltip content={userTooltip} enabled={isCollapsed} position="right">
            <div
              onClick={() => setIsSwitchRoleOpen(true)}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
              title="Click to switch role or view profile"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatarUrl || null as any}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-200"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    isManager ? 'bg-ink' : 'bg-emerald-500'
                  }`}
                />
              </div>

              {/* Name & Role (Expanded only) */}
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-zinc-900 truncate">
                      {currentUser.name}
                    </span>
                    <span
                      className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                        isManager
                          ? 'bg-[#EEF2FF] text-ink'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isManager ? 'GM' : 'Desk'}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-normal truncate max-w-[110px]">
                    {currentUser.roleTitle}
                  </span>
                </div>
              )}
            </div>
          </Tooltip>

          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={lockTerminal}
                title="Lock Terminal Screen"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign out to Login Screen"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <SwitchRoleModal
        isOpen={isSwitchRoleOpen}
        onClose={() => setIsSwitchRoleOpen(false)}
      />
    </>
  );
};

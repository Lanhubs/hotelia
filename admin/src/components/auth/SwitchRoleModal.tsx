import React, { useState, useEffect } from 'react';
import { X, Check, Shield, Loader2 } from 'lucide-react';
import { useAuthStore, UserRole } from '../../stores/authStore';
import Api from '../../lib/api';

interface StaffItem {
  id: string;
  name: string;
  email: string;
  staffId: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl: string;
  department: string;
  shift: string;
}

interface SwitchRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwitchRoleModal: React.FC<SwitchRoleModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole } = useAuthStore();
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    Api.get<{ staff: any[] }>('/admin/staff')
      .then((data) => {
        if (isMounted && data?.staff) {
          const mapped: StaffItem[] = data.staff.map((s: any) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            staffId: s.staff_id || s.staffId || '',
            role: s.role as UserRole,
            roleTitle: s.role_title || s.roleTitle || '',
            avatarUrl: s.avatar_url || s.avatarUrl || '',
            department: s.department || '',
            shift: s.shift || '',
          }));
          setStaffList(mapped);
        }
      })
      .catch((err) => {
        console.error('Failed to load backend staff list:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  const isCurrentManager = currentUser.role === 'manager' || currentUser.role === 'admin';

  // Extract server-returned staff details or use fallback from currentUser / active session
  const managerStaff = staffList.find((s) => s.role === 'manager' || s.role === 'admin') || {
    name: currentUser.role === 'manager' ? currentUser.name : 'Marcus Vance',
    roleTitle: currentUser.role === 'manager' ? currentUser.roleTitle : 'General Manager & Director',
    avatarUrl: currentUser.role === 'manager' ? currentUser.avatarUrl : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
  };

  const receptionistStaff = staffList.find((s) => s.role === 'receptionist') || {
    name: currentUser.role === 'receptionist' ? currentUser.name : 'Elena Rostova',
    roleTitle: currentUser.role === 'receptionist' ? currentUser.roleTitle : 'Front Desk Lead & Concierge',
    avatarUrl: currentUser.role === 'receptionist' ? currentUser.avatarUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-zinc-200/80 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Switch Operational Role</h3>
              <p className="text-xs text-zinc-500">Toggle between executive and front-line views</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Roles List */}
        <div className="space-y-3">
          {/* 1. General Manager */}
          <div
            onClick={() => handleSelectRole('manager')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              isCurrentManager
                ? 'bg-indigo-50/50 border-indigo-600 ring-1 ring-indigo-600'
                : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100/70 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {managerStaff.avatarUrl ? (
                <img
                  src={managerStaff.avatarUrl}
                  alt={managerStaff.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  GM
                </div>
              )}
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-zinc-900">{managerStaff.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#EEF2FF] text-indigo-700">
                    Executive
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-700">{managerStaff.roleTitle}</div>
                <p className="text-[11px] text-zinc-500">
                  Full control over revenue analytics, cash books, pricing, and system configurations.
                </p>
              </div>
            </div>

            {isCurrentManager && (
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-3" />
              </div>
            )}
          </div>

          {/* 2. Front Desk Receptionist */}
          <div
            onClick={() => handleSelectRole('receptionist')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              !isCurrentManager
                ? 'bg-emerald-50/50 border-emerald-600 ring-1 ring-emerald-600'
                : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100/70 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {receptionistStaff.avatarUrl ? (
                <img
                  src={receptionistStaff.avatarUrl}
                  alt={receptionistStaff.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  FD
                </div>
              )}
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-zinc-900">{receptionistStaff.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Reception Lead
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-700">{receptionistStaff.roleTitle}</div>
                <p className="text-[11px] text-zinc-500">
                  Fast walk-in reservations, keycard coding, guest check-ins, folios & ledger management.
                </p>
              </div>
            </div>

            {!isCurrentManager && (
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-3" />
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-zinc-400">
          Switching roles automatically recalibrates active terminal privileges and shift duty metadata.
        </div>
      </div>
    </div>
  );
};

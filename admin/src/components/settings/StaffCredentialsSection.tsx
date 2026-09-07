import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, Lock, ShieldAlert, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const API_BASE = "";

interface StaffProfile {
  id: string;
  name: string;
  email: string;
  staffId: string;
  role: string;
  roleTitle: string;
  avatarUrl: string;
  department: string;
  shift: string;
  phone: string;
}

interface CredentialCardProps {
  profile: StaffProfile;
  canEdit: boolean;
  onSaved: () => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ profile, canEdit, onSaved }) => {
  const [draft, setDraft] = useState({ ...profile });
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pin, setPin] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const set = (key: keyof StaffProfile) => (val: string) =>
    setDraft((p) => ({ ...p, [key]: val }));

  const flash = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/staff/${profile.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('auth_token')}` },
        body: JSON.stringify({ name: draft.name, email: draft.email, roleTitle: draft.roleTitle, phone: draft.phone, shift: draft.shift }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save');
      flash('success', 'Profile updated successfully');
      onSaved();
    } catch (e: any) {
      flash('error', e.message);
    } finally { setSaving(false); }
  };

  const savePassword = async () => {
    if (!newPwd || newPwd.length < 6) return flash('error', 'Password must be at least 6 characters');
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/staff/${profile.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('auth_token')}` },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Password change failed');
      setCurrentPwd(''); setNewPwd('');
      flash('success', 'Password changed successfully');
    } catch (e: any) {
      flash('error', e.message);
    } finally { setSaving(false); }
  };

  const savePin = async () => {
    if (!pin || !/^\d{4,6}$/.test(pin)) return flash('error', 'PIN must be 4–6 digits');
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/staff/${profile.id}/pin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('auth_token')}` },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'PIN update failed');
      setPin('');
      flash('success', 'Terminal PIN updated');
    } catch (e: any) {
      flash('error', e.message);
    } finally { setSaving(false); }
  };

  const roleLabel = profile.role === 'manager' ? 'GM · Full Access' : 'Reception · FD Access';

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <img src={profile.avatarUrl} alt={profile.name} className="w-9 h-9 rounded-xl object-cover" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-zinc-900">{profile.name}</h3>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">{roleLabel}</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium">{profile.staffId} · {profile.department}</p>
          </div>
        </div>
        {!canEdit && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-amber-700">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] font-bold">Read-Only</span>
          </div>
        )}
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
          {message.text}
        </div>
      )}

      {/* Profile Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {[
          { label: 'Full Name', key: 'name' as const },
          { label: 'Staff Email', key: 'email' as const },
          { label: 'Phone Number', key: 'phone' as const },
          { label: 'Role Title', key: 'roleTitle' as const },
          { label: 'Default Shift', key: 'shift' as const },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">{label}</label>
            <input
              type="text"
              value={draft[key] as string}
              onChange={(e) => canEdit && set(key)(e.target.value)}
              readOnly={!canEdit}
              className={`w-full px-3 py-2 text-xs rounded-xl border font-medium ${canEdit ? 'bg-white border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-zinc-50 border-zinc-100 text-zinc-400 cursor-not-allowed'}`}
            />
          </div>
        ))}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">Staff ID</label>
          <input value={profile.staffId} readOnly className="w-full px-3 py-2 text-xs rounded-xl border bg-zinc-50 border-zinc-100 text-zinc-400 cursor-not-allowed font-mono" />
        </div>
      </div>

      {canEdit && (
        <div className="flex justify-end pt-1">
          <button onClick={saveProfile} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Profile
          </button>
        </div>
      )}

      {/* Security section — GM only */}
      {canEdit && (
        <div className="pt-2 border-t border-zinc-100 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Security Credentials</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">Current Password</label>
              <input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} placeholder="Enter current password" className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="Min. 6 characters" className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono" />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer">
                  {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">Terminal PIN (4–6 digits)</label>
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="e.g. 1234" maxLength={6} className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono tracking-widest" />
            </div>
            <button onClick={savePin} disabled={saving} className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors">
              Update PIN
            </button>
          </div>
          <div className="flex justify-end">
            <button onClick={savePassword} disabled={saving || !currentPwd || !newPwd} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const StaffCredentialsSection: React.FC = () => {
  const { currentUser } = useAuthStore();
  const isGM = currentUser.role === 'manager' || currentUser.role === 'admin';
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/staff`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('auth_token')}` },
      });
      if (!res.ok) throw new Error('Failed to load staff records');
      const data = await res.json();
      setStaff((data.staff || []).map((s: any) => ({
        id: s.id, name: s.name, email: s.email, staffId: s.staff_id,
        role: s.role, roleTitle: s.role_title, avatarUrl: s.avatar_url,
        department: s.department, shift: s.shift, phone: s.phone,
      })));
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadStaff(); }, []);

  // Non-GM: show only their own profile
  const visible = isGM ? staff : staff.filter((s) => s.email === currentUser.email);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Staff Login Credentials</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isGM ? 'Manage login credentials for all staff. Changes are saved to the database.' : 'Your credentials are managed by the General Manager.'}
          </p>
        </div>
        {!isGM && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            GM access required to edit
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-8 justify-center text-zinc-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading staff records...
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {visible.map((s) => (
        <CredentialCard key={s.id} profile={s} canEdit={isGM} onSaved={loadStaff} />
      ))}
    </div>
  );
};

import React from 'react';
import { Building2, MapPin, Phone, Mail, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { HotelSettingsData } from '../../hooks/useSettingsApi';

interface PropertyProfileSectionProps {
  settings: Partial<HotelSettingsData>;
  onChange: (fields: Partial<HotelSettingsData>) => void;
}

export const PropertyProfileSection: React.FC<PropertyProfileSectionProps> = ({
  settings,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900">Hotel Property & Brand Identity</h3>
          <p className="text-xs text-zinc-500 font-medium">Public registration info, official contact address, and license compliance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Hotel / Property Name
          </label>
          <input
            type="text"
            value={settings.propertyName || ''}
            onChange={(e) => onChange({ propertyName: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" /> Star Classification Rating
          </label>
          <select
            value={settings.starRating || 5}
            onChange={(e) => onChange({ starRating: Number(e.target.value) })}
            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium cursor-pointer"
          >
            <option value={5}>5-Star Luxury Boutique Hotel</option>
            <option value={4}>4-Star Premium Resort</option>
            <option value={3}>3-Star Executive Suites</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Brand Tagline / Subtitle
          </label>
          <input
            type="text"
            value={settings.tagline || ''}
            onChange={(e) => onChange({ tagline: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" /> Physical Address
          </label>
          <input
            type="text"
            value={settings.address || ''}
            onChange={(e) => onChange({ address: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-600" /> Reception Desk Phone
          </label>
          <input
            type="text"
            value={settings.phone || ''}
            onChange={(e) => onChange({ phone: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" /> Official Email Address
          </label>
          <input
            type="email"
            value={settings.email || ''}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Tourism Operating License / Permit #
          </label>
          <input
            type="text"
            value={settings.licenseNumber || ''}
            onChange={(e) => onChange({ licenseNumber: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-mono font-medium"
          />
        </div>
      </div>
    </div>
  );
};

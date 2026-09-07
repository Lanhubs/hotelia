import React from 'react';
import { KeyRound, Radio, Cpu, Clock, Zap } from 'lucide-react';
import { HotelSettingsData } from '../../hooks/useSettingsApi';

interface KeycardHardwareSectionProps {
  settings: Partial<HotelSettingsData>;
  onChange: (fields: Partial<HotelSettingsData>) => void;
}

export const KeycardHardwareSection: React.FC<KeycardHardwareSectionProps> = ({
  settings,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900">RFID Keycard & Encoder Hardware Configuration</h3>
          <p className="text-xs text-zinc-500 font-medium">Configure physical door lock encoders, RFID frequencies, and automatic key revocation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-amber-600" /> RFID Frequency Standard
          </label>
          <select
            value={settings.keycardFrequency || '13.56MHz (Mifare Classic / DESFire)'}
            onChange={(e) => onChange({ keycardFrequency: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium cursor-pointer"
          >
            <option value="13.56MHz (Mifare Classic / DESFire)">13.56MHz (Mifare Classic / DESFire High-Freq)</option>
            <option value="125kHz (Proximity EM4100)">125kHz (Proximity Legacy Standard)</option>
            <option value="BLE / NFC Mobile Access Key">BLE / Mobile NFC Smart Key System</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Encoder Device IP / Port Address
          </label>
          <input
            type="text"
            value={settings.encoderIpPort || '192.168.1.150:8080'}
            onChange={(e) => onChange({ encoderIpPort: e.target.value })}
            placeholder="e.g. 192.168.1.150:8080"
            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-mono font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" /> Keycard Expiration Buffer (Hours after Check-out)
          </label>
          <input
            type="number"
            value={settings.keycardExpirationPaddingHrs || 2}
            onChange={(e) => onChange({ keycardExpirationPaddingHrs: Number(e.target.value) })}
            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium"
          />
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 sm:col-span-2">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Auto-Invalidate Keycard Upon Folio Checkout
            </div>
            <div className="text-[11px] text-zinc-500 font-medium">Instantly revoke RFID room access as soon as reception settles checkout folio</div>
          </div>
          <input
            type="checkbox"
            checked={settings.keycardAutoInvalidate ?? true}
            onChange={(e) => onChange({ keycardAutoInvalidate: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

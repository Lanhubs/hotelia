import React from 'react';
import { Bell, MessageSquare, Mail, AlertTriangle, Moon } from 'lucide-react';
import { HotelSettingsData } from '../../hooks/useSettingsApi';

interface NotificationsAutomationSectionProps {
  settings: Partial<HotelSettingsData>;
  onChange: (fields: Partial<HotelSettingsData>) => void;
}

export const NotificationsAutomationSection: React.FC<NotificationsAutomationSectionProps> = ({
  settings,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900">Notifications & Automation Triggers</h3>
          <p className="text-xs text-zinc-500 font-medium">Configure guest messaging, automated folio dispatches, and scheduled night audit runs</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-zinc-900">SMS / WhatsApp Check-in Welcome Message</div>
              <div className="text-[11px] text-zinc-500">Send instant check-in greeting with Wi-Fi password & concierge link to guest phone</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.enableSmsWelcome ?? true}
            onChange={(e) => onChange({ enableSmsWelcome: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-zinc-900">Automated Email Folio Receipt PDF</div>
              <div className="text-[11px] text-zinc-500">Dispatch itemized PDF invoice to guest email address upon folio settlement</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.enableEmailFolio ?? true}
            onChange={(e) => onChange({ enableEmailFolio: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Low Inventory Staff Alert Threshold
            </label>
            <input
              type="number"
              value={settings.lowInventoryThreshold || 15}
              onChange={(e) => onChange({ lowInventoryThreshold: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-600" /> Night Audit Scheduled Time
            </label>
            <input
              type="time"
              value={settings.nightAuditAutoTime || '02:00'}
              onChange={(e) => onChange({ nightAuditAutoTime: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

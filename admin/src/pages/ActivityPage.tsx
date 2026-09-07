import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';

const AUDIT_LOGS = [
  { id: 'LOG-8801', action: 'Room Status Changed to Inspected', target: 'Room 301 (Ocean Villa)', user: 'Aaliyah Patel (Housekeeping Head)', timestamp: '11:45 AM • Aug 18' },
  { id: 'LOG-8802', action: 'Folio Payment Authorized $3,250', target: 'Folio GH-89214 (Alexander Hayes)', user: 'Dianne Russell (Admin)', timestamp: '11:30 AM • Aug 18' },
  { id: 'LOG-8803', action: 'RFID Keycard Encoded (Key 2 of 2)', target: 'Room 303 (Sir Arthur Stirling)', user: 'Marcus Vance (Front Desk)', timestamp: '11:15 AM • Aug 18' },
  { id: 'LOG-8804', action: 'Late Check-out Granted (02:00 PM)', target: 'Room 104 (Sophia Loren)', user: 'Marcus Vance (Front Desk)', timestamp: '10:50 AM • Aug 18' },
  { id: 'LOG-8805', action: 'Rate Code Adjusted: High Season Tier', target: 'Executive Suite category', user: 'Dianne Russell (Admin)', timestamp: '08:00 AM • Aug 18' },
];

export const ActivityPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Messages & Activity Log</h2>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">
            Operational activity history, guest communications, and staff dispatch messages.
          </p>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl divide-y divide-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        {AUDIT_LOGS.map((log) => (
          <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/70 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-[#05C168] mt-0.5">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">{log.action}</p>
                <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{log.target}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Executed by {log.user}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium self-start sm:self-center">
              <Clock className="w-3.5 h-3.5" />
              <span>{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

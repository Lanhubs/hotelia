import React from 'react';
import { SettingsPanel } from './SettingsPanel';

interface OperationalTimingsSectionProps {
  checkInTime: string;
  onCheckInTimeChange: (value: string) => void;
  checkOutTime: string;
  onCheckOutTimeChange: (value: string) => void;
}

export const OperationalTimingsSection: React.FC<OperationalTimingsSectionProps> = ({
  checkInTime,
  onCheckInTimeChange,
  checkOutTime,
  onCheckOutTimeChange,
}) => {
  return (
    <SettingsPanel title="Operational Time Defaults" meta="Section 02 · Operations">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-zinc-500 font-medium mb-1.5">Standard Check-In Time</label>
          <input
            type="time"
            value={checkInTime}
            onChange={(e) => onCheckInTimeChange(e.target.value)}
            className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#05C168]/20 focus:border-[#05C168]"
          />
        </div>
        <div>
          <label className="block text-zinc-500 font-medium mb-1.5">Standard Check-Out Time</label>
          <input
            type="time"
            value={checkOutTime}
            onChange={(e) => onCheckOutTimeChange(e.target.value)}
            className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#05C168]/20 focus:border-[#05C168]"
          />
        </div>
      </div>
    </SettingsPanel>
  );
};
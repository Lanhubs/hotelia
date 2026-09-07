import React from 'react';
import { Save, Check, RotateCcw } from 'lucide-react';

interface SaveSettingsBarProps {
  saved: boolean;
  onReset: () => void;
}

export const SaveSettingsBar: React.FC<SaveSettingsBarProps> = ({ saved, onReset }) => {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {saved ? (
        <span className="flex items-center gap-1 text-xs text-[#05C168] font-bold">
          <Check className="w-3.5 h-3.5" /> Settings saved successfully!
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Unsaved changes
        </span>
      )}

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-xs font-bold rounded-xl hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#05C168] hover:bg-[#04a85a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>
    </div>
  );
};
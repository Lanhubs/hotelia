import React from 'react';

interface SettingsPanelProps {
  title: string;
  meta: string;
  children: React.ReactNode;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ title, meta, children }) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="border-b border-zinc-100 pb-4 mb-5">
        <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
        <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mt-0.5">
          {meta}
        </span>
      </div>
      {children}
    </div>
  );
};
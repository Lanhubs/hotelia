import React, { useState, useEffect } from 'react';
import keoLogo from '../../assets/keo-logo.png';

interface AdminPageLoaderProps {
  message?: string;
  subtext?: string;
  fullscreen?: boolean;
}

const TELEMETRY_MESSAGES = [
  'Initializing management system...',
  'Connecting folio & ledger services...',
  'Syncing room rack & keycard matrix...',
  'Loading real-time yield data...',
];

export const AdminPageLoader: React.FC<AdminPageLoaderProps> = ({
  message,
  subtext,
  fullscreen = true,
}) => {
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slight delay before showing content for a cleaner entry
    const show = setTimeout(() => setVisible(true), 80);
    const interval = setInterval(() => {
      setTelemetryIndex((prev) => (prev + 1) % TELEMETRY_MESSAGES.length);
    }, 2000);
    return () => {
      clearTimeout(show);
      clearInterval(interval);
    };
  }, []);

  const content = (
    <div
      className={`flex flex-col items-center justify-center text-center transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {/* Logo — clean, no card or shadow */}
      <img
        src={keoLogo}
        alt="KEO Experience Hotel & Suites"
        className="h-14 w-auto object-contain brightness-0 mb-8"
      />

      {/* Thin animated progress bar */}
      <div className="w-40 h-px bg-zinc-200 rounded-full overflow-hidden relative mb-6">
        <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-zinc-900 rounded-full animate-[indeterminate_1.6s_infinite_ease-in-out]" />
      </div>

      {/* Cycling telemetry line */}
      <p
        key={telemetryIndex}
        className="text-[11px] font-medium text-zinc-400 tracking-wide animate-in fade-in duration-500"
      >
        {subtext || TELEMETRY_MESSAGES[telemetryIndex]}
      </p>
    </div>
  );

  if (!fullscreen) {
    return <div className="py-24 flex items-center justify-center">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8FAFC]">
      {content}
    </div>
  );
};

export default AdminPageLoader;

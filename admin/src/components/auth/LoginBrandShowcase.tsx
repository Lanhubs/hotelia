import React from 'react';
import bg from '../../assets/background.jpg';
import keoLogo from '../../assets/keo-logo.png';

export const LoginBrandShowcase: React.FC = () => {
  return (
    <div className="lg:w-1/2 relative flex flex-col justify-between p-8 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-200">
      <div className="absolute inset-0 z-0">
        <img src={bg} alt="KEO Experience Background" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-zinc-950/75" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={keoLogo}
            alt="KEO Experience Hotel & Suites"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>
      </div>

      <div className="relative z-10 py-10 my-auto max-w-lg space-y-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
            Hospitality Management System
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Intuitive Control for Front Desk & Executive Leadership.
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed pt-1 font-medium">
            Seamlessly orchestrate walk-in reservations, omnichannel bookings, RFID digital room keycards, and financial audit ledgers with enterprise reliability.
          </p>
        </div>
      </div>
    </div>
  );
};

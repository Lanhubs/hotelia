import React from 'react';
import { Link } from 'react-router-dom';

export const WalkInQuickAction: React.FC = () => {
  return (
    <div className="bg-indigo-900 rounded-2xl p-5 text-white space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-indigo-200 border border-white/10">
          Front Desk Shift Pro-Tip
        </span>
      </div>

      <h4 className="text-sm font-bold text-white leading-snug">
        Reception Walk-In Yield Boost
      </h4>
      <p className="text-xs text-zinc-300 leading-relaxed font-normal">
        Walk-in guests generate <strong className="font-bold">100% net margin</strong> with zero commission drag. Upsell incoming guests to Ocean Villas & include Spa dining vouchers for highest RevPAR.
      </p>

      <Link
        to="/accommodation"
        className="w-full py-2.5 px-4 bg-ink hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold text-center block transition-all shadow-xs cursor-pointer"
      >
        + Create Reception Walk-In Reservation
      </Link>
    </div>
  );
};
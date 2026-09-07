import React from 'react';
import { Phone, Mail, Clock } from 'lucide-react';

export const HelpContactCard: React.FC = () => {
  return (
    <section className="bg-zinc-900 text-white rounded-2xl p-6 overflow-hidden relative">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-600 text-white">
            Live Support
          </span>
        </div>
        <h3 className="text-sm font-bold">Operations Support Desk</h3>
        <p className="text-[11px] text-zinc-400 font-medium mt-1 leading-relaxed max-w-sm">
          Priority line for front desk and housekeeping staff. Average first response under 4
          minutes during operational hours.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <a
            href="tel:+234800001122"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-bold">0800 000 1122</span>
          </a>
          <a
            href="mailto:support@keoexperience.com"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-bold">support@keoexperience</span>
          </a>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-bold">24 / 7 On-Call</span>
          </div>
        </div>
      </div>
    </section>
  );
};
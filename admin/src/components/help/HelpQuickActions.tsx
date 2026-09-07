import React from 'react';
import { Headphones, MessageSquare, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: typeof Headphones;
  accent: string;
  chipBg: string;
  chipText: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'contact',
    title: 'Contact Support',
    description: 'Reach the operations desk for urgent help.',
    icon: Headphones,
    accent: 'bg-emerald-600 text-white',
    chipBg: 'bg-emerald-50 border-emerald-200',
    chipText: 'text-emerald-700',
  },
  {
    id: 'ticket',
    title: 'Submit a Ticket',
    description: 'Log an issue with logs & screenshots attached.',
    icon: MessageSquare,
    accent: 'bg-zinc-900 text-white',
    chipBg: 'bg-zinc-100 border-zinc-200',
    chipText: 'text-zinc-700',
  },
  {
    id: 'guides',
    title: 'Staff Guides',
    description: 'Step-by-step SOPs for daily operations.',
    icon: BookOpen,
    accent: 'bg-zinc-100 text-zinc-700',
    chipBg: 'bg-zinc-100 border-zinc-200',
    chipText: 'text-zinc-700',
  },
  {
    id: 'request',
    title: 'Request a Feature',
    description: 'Suggest improvements to the admin panel.',
    icon: Lightbulb,
    accent: 'bg-zinc-100 text-zinc-700',
    chipBg: 'bg-zinc-100 border-zinc-200',
    chipText: 'text-zinc-700',
  },
];

export const HelpQuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            className="group bg-white border border-zinc-200/80 rounded-2xl p-5 text-left hover:border-emerald-300/60 hover:shadow-[0_2px_8px_rgba(5,193,104,0.08)] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${action.accent}`}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${action.chipBg} ${action.chipText}`}
              >
                {action.id === 'contact' ? 'Live' : 'Self-service'}
              </span>
            </div>
            <div className="text-xs font-bold text-zinc-900">{action.title}</div>
            <p className="text-[11px] text-zinc-400 font-medium mt-1 leading-relaxed">
              {action.description}
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#05C168] mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              Open <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
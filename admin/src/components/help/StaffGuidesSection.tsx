import React from 'react';
import { BookOpen, Clock, FileText } from 'lucide-react';

interface GuideEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  pages: string;
  updated: string;
}

const GUIDES: GuideEntry[] = [
  {
    id: 'g-1',
    title: 'Front Desk Onboarding',
    description: 'Logins, role switching, terminal locking, and desk etiquette.',
    category: 'Onboarding',
    pages: '12 min read',
    updated: 'Aug 2026',
  },
  {
    id: 'g-2',
    title: 'Walk-In Booking & Folio Lifecycle',
    description: 'From guest capture to check-out settlement and reconciliation.',
    category: 'Operations',
    pages: '8 min read',
    updated: 'Aug 2026',
  },
  {
    id: 'g-3',
    title: 'Housekeeping & Room Status Workflow',
    description: 'Dirty, inspected, out-of-order states and handover checklists.',
    category: 'Operations',
    pages: '6 min read',
    updated: 'Jul 2026',
  },
  {
    id: 'g-4',
    title: 'Accounting & Daily Cash Close',
    description: 'Folio payments, tax handling, cash books, and end-of-shift reports.',
    category: 'Finance',
    pages: '10 min read',
    updated: 'Jul 2026',
  },
  {
    id: 'g-5',
    title: 'RFID Keycard & Security Standards',
    description: 'Encoding keys, audit trail, and lost-key procedures.',
    category: 'Security',
    pages: '5 min read',
    updated: 'Jun 2026',
  },
];

export const StaffGuidesSection: React.FC = () => {
  return (
    <section className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Staff Documentation</h3>
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mt-0.5">
            SOP Library · 5 Guides
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {GUIDES.map((guide) => (
          <button
            key={guide.id}
            type="button"
            className="w-full flex items-center justify-between gap-4 p-3.5 rounded-xl border border-zinc-200/70 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900">{guide.title}</div>
                <p className="text-[11px] text-zinc-500 font-medium mt-0.5 truncate">
                  {guide.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wide bg-zinc-100 text-zinc-500 border border-zinc-200">
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                    <Clock className="w-2.5 h-2.5" /> {guide.pages}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono shrink-0">Updated {guide.updated}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
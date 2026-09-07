import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 'faq-1',
    question: 'How do I create a walk-in reservation?',
    answer:
      'Open the Accommodation page, pick a room and select Book Walk-In. Fill the guest details, set the stay duration, add any add-ons, then take payment to confirm. The folio is created immediately and appears in Bookings & Folios.',
  },
  {
    id: 'faq-2',
    question: 'How are room statuses updated after check-out?',
    answer:
      'When a folio is checked out, the room moves to Dirty automatically. Housekeeping marks it Inspected once cleaned and inspected, which returns it to Available for the next booking.',
  },
  {
    id: 'faq-3',
    question: 'Why does the folio show a tax line item?',
    answer:
      'The default Municipal & Hospitality Tax rate is applied to every folio. You can adjust the rate in Settings under Billing & Tax. The rate shown per folio is captured at booking time.',
  },
  {
    id: 'faq-4',
    question: 'How do I encode an RFID keycard for a guest?',
    answer:
      'Open the room detail view and select the active stay. Under Key Management, choose Encode Key 1 or Key 2, then hold the card against the reader until the reader shows a solid green state.',
  },
  {
    id: 'faq-5',
    question: 'What happens when the terminal is locked?',
    answer:
      'Locking the terminal hides all sensitive data and requires your PIN to resume. Use Lock Terminal from the top bar whenever you step away from the desk.',
  },
  {
    id: 'faq-6',
    question: 'Which currency is used for guest folios?',
    answer:
      'The base folio currency is set in Settings under Billing & Tax and defaults to USD. Display conversions to other currencies are for reference only and do not change the settled amount.',
  },
];

export const HelpFaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  return (
    <section className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <HelpCircle className="w-3.5 h-3.5" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Frequently Asked Questions</h3>
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mt-0.5">
            Knowledge Base · 6 Articles
          </span>
        </div>
      </div>

      <div className="divide-y divide-zinc-100">
        {FAQ_ENTRIES.map((entry) => {
          const isOpen = openId === entry.id;
          return (
            <div key={entry.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : entry.id)}
                className="w-full py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <span className={`text-xs font-bold ${isOpen ? 'text-[#05C168]' : 'text-zinc-900'}`}>
                  {entry.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-[#05C168]' : ''}`}
                />
              </button>
              {isOpen && (
                <p className="text-[11px] leading-relaxed text-zinc-500 font-medium pb-4 -mt-1">
                  {entry.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
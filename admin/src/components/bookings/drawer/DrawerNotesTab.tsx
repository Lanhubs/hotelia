import React from 'react';
import { Send } from 'lucide-react';
import { BookingRecord } from '../../../types/booking';

interface DrawerNotesTabProps {
  notes: BookingRecord['notes'];
  newNoteText: string;
  onNoteTextChange: (val: string) => void;
  authorName: string;
  onAddNoteSubmit: (e: React.FormEvent) => void;
}

export const DrawerNotesTab: React.FC<DrawerNotesTabProps> = ({
  notes,
  newNoteText,
  onNoteTextChange,
  authorName,
  onAddNoteSubmit,
}) => {
  return (
    <div className="space-y-4">
      <form onSubmit={onAddNoteSubmit} className="space-y-2.5 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
        <label className="text-xs font-bold text-zinc-800">Append Front Desk Staff Log</label>
        <textarea
          value={newNoteText}
          onChange={(e) => onNoteTextChange(e.target.value)}
          placeholder="Record front desk updates, guest preferences, luggage storage, or billing adjustments..."
          rows={2}
          className="w-full p-2.5 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
        />
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-400">Signed as: {authorName}</span>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-ink text-white text-xs font-bold hover:bg-[#4338CA] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3 h-3" />
            <span>Save Note</span>
          </button>
        </div>
      </form>

      <div className="space-y-2.5">
        {notes.map((note) => (
          <div key={note.id} className="p-3.5 bg-white rounded-xl border border-zinc-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="font-bold text-zinc-800">{note.author} ({note.role})</span>
              <span>{note.timestamp}</span>
            </div>
            <p className="text-zinc-700 leading-relaxed">{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

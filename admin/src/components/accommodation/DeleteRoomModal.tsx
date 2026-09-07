import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';

interface DeleteRoomModalProps {
  room: AccommodationRoom;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteRoomModal: React.FC<DeleteRoomModalProps> = ({ room, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-zinc-200">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Trash2 className="w-5 h-5" />
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100"><X className="w-4 h-4" /></button>
        </div>

        <div>
          <h3 className="text-base font-bold text-zinc-900">Remove Suite from Inventory?</h3>
          <p className="text-xs text-zinc-500 font-normal mt-1 leading-relaxed">
            Are you sure you want to remove <strong className="text-zinc-900 font-bold">{room.name}</strong> from the active room catalog? This action will archive the suite.
          </p>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Active reservations linked to this suite will remain unchanged in the ledger.</span>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-xs font-semibold text-zinc-700 cursor-pointer">Cancel</button>
          <button type="button" onClick={() => onConfirm(room.id)} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer">Confirm Deletion</button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';

interface WalkInPageHeaderProps {
  room: AccommodationRoom;
}

export const WalkInPageHeader: React.FC<WalkInPageHeaderProps> = ({ room }) => {
  return (
    <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <Link
          to={`/admin/accommodation/${room.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-1 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to {room.name}</span>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
          Front Desk Walk-In Reservation
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Receptionist Terminal #01 (Active)
        </span>
      </div>
    </div>
  );
};
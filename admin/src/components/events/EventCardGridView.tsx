import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Eye,
  Edit3,
  Trash2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { Event } from '../../stores/eventsStore';
import { formatMoney } from '../../components/bookings/bookingUtils';

interface EventCardGridViewProps {
  event: Event;
  displayCurrency: 'USD' | 'NGN';
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onViewBookings?: (event: Event) => void;
}

const TYPE_LABELS: Record<string, string> = {
  party: 'Party',
  wedding: 'Wedding',
  corporate: 'Corporate',
  gala: 'Gala',
  conference: 'Conference',
  social: 'Social',
  other: 'Other',
};

const TYPE_COLORS: Record<string, string> = {
  party: 'bg-purple-50 text-purple-700 border-purple-200',
  wedding: 'bg-pink-50 text-pink-700 border-pink-200',
  corporate: 'bg-blue-50 text-blue-700 border-blue-200',
  gala: 'bg-amber-50 text-amber-700 border-amber-200',
  conference: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  social: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  other: 'bg-zinc-50 text-zinc-700 border-zinc-200',
};

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  ongoing: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export const EventCardGridView: React.FC<EventCardGridViewProps> = ({
  event,
  displayCurrency,
  onEdit,
  onDelete,
  onViewBookings,
}) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = event.gallery && event.gallery.length > 0 ? event.gallery : (event.heroImage ? [event.heroImage] : []);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const priceUSD = event.hasTickets && event.ticketTiers?.length > 0
    ? event.ticketTiers[0].priceUSD
    : 0;
  const priceNaira = event.hasTickets && event.ticketTiers?.length > 0
    ? event.ticketTiers[0].priceNaira
    : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      id={`event-card-grid-${event.id}`}
      className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group p-2 gap-2"
    >
      <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-zinc-950 shadow-xs">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-100">
            <Sparkles className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${TYPE_COLORS[event.eventType] || TYPE_COLORS.other}`}>
            {TYPE_LABELS[event.eventType] || event.eventType}
          </span>
          {event.isRecurring && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-xs flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Recurring
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {onEdit && (
            <button
              type="button"
              title="Edit Event"
              onClick={(e) => { e.stopPropagation(); onEdit?.(event); }}
              className="p-1.5 rounded-md bg-black/60 hover:bg-purple-600 text-white cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              title="Delete Event"
              onClick={(e) => { e.stopPropagation(); onDelete?.(event); }}
              className="p-1.5 rounded-md bg-black/60 hover:bg-rose-600 text-white cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white z-10 pointer-events-none">
          <div className="flex items-center gap-1 text-[11px] text-zinc-200 font-medium">
            <MapPin className="w-3 h-3 text-purple-400" />
            <span className="truncate max-w-42.5">
              {(event.venueName || 'TBA').split(',')[0]}
            </span>
          </div>
          <div className="text-[10px] text-zinc-300 font-semibold px-1.5 py-0.5 rounded bg-black/40">
            {event.maxCapacity ? `${event.maxCapacity} guests` : 'Unlimited'}
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-3.5 flex-1 flex flex-col justify-between bg-zinc-50/60 rounded-2xl border border-zinc-100">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 group-hover:text-purple-600 transition-colors cursor-pointer line-clamp-1">
              {event.title}
            </h3>
            <p className="text-xs text-zinc-500 font-normal line-clamp-2 mt-1">
              {event.description || 'No description'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${TYPE_COLORS[event.eventType] || TYPE_COLORS.other}`}>
              {TYPE_LABELS[event.eventType] || event.eventType}
            </span>
            {event.isRecurring && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Recurring
              </span>
            )}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[event.status] || 'bg-zinc-50 text-zinc-700 border-zinc-200'}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-200/60 text-sm">
            <div className="flex items-center gap-1.5 text-zinc-700">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <span>{formatDate(event.startDate)}</span>
              {event.endDate !== event.startDate && (
                <span className="text-zinc-400">– {formatDate(event.endDate)}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-zinc-700">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span>{event.startTime} – {event.endTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-700">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              <span className="truncate max-w-48">{event.venueName || 'TBA'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-700">
              <Users className="h-3.5 w-3.5 text-zinc-400" />
              <span>{event.maxCapacity ? `${event.maxCapacity} guests` : 'Unlimited'}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-200/60 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="text-[11px] text-zinc-400 font-medium">
              Nightly Rate / Ticket
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-zinc-900">
                {event.hasTickets
                  ? (displayCurrency === 'USD'
                    ? `$${priceUSD}`
                    : priceNaira
                      ? `₦${priceNaira.toLocaleString()}`
                      : `$${priceUSD}`)
                  : 'Free RSVP'}
              </span>
              {event.hasTickets && (
                <span className="text-[11px] text-zinc-400 font-normal ml-1">
                  {displayCurrency === 'USD' ? '/ ticket' : ' / ticket'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/events/${event.slug}`)}
              className="flex-1 py-2 px-2.5 rounded-xl border bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span>Details</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit?.(event); }}
              className="py-2 px-2.5 rounded-xl border bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete?.(event); }}
              className="py-2 px-2.5 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-xs font-bold text-red-700 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onViewBookings?.(event)}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manage Bookings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
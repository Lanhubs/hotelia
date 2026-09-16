import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  Eye,
  Edit3,
  Trash2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Tag,
  Sparkles,
} from 'lucide-react';
import type { Event } from '../../stores/eventsStore';
import { formatMoney } from '../../components/bookings/bookingUtils';

interface EventCardListViewProps {
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

export const EventCardListView: React.FC<EventCardListViewProps> = ({
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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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

  return (
    <div
      id={`event-card-list-${event.id}`}
      className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 p-2 flex flex-col lg:flex-row gap-3 group"
    >
      <div className="lg:w-80 xl:w-96 relative bg-zinc-950 shrink-0 aspect-16/10 lg:aspect-auto rounded-2xl overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-100">
            <Sparkles className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${TYPE_COLORS[event.eventType] || TYPE_COLORS.other}`}>
            {TYPE_LABELS[event.eventType] || event.eventType}
          </span>
          {event.isRecurring && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
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
              className="p-1.5 rounded-lg bg-black/40 hover:bg-purple-600 text-white cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              title="Delete Event"
              onClick={(e) => { e.stopPropagation(); onDelete?.(event); }}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-600 text-white cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <>
            <button type="button" onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 z-10 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button type="button" onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 z-10 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1 z-10">
              {images.map((_, idx) => (
                <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 onClick={() => navigate(`/events/${event.slug}`)} className="text-base font-bold text-zinc-900 group-hover:text-purple-600 transition-colors cursor-pointer">{event.title}</h3>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${TYPE_COLORS[event.eventType] || TYPE_COLORS.other}`}>
                  {TYPE_LABELS[event.eventType] || event.eventType}
                </span>
                {event.isRecurring && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Recurring
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{event.venueName || 'TBA'}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200/60 self-start sm:self-auto">
              <span className="text-xs font-bold text-zinc-900">{event.maxCapacity ? `${event.maxCapacity}` : '∞'}</span>
              <span className="text-[11px] text-zinc-400">Capacity</span>
            </div>
          </div>

          <p className="text-xs text-zinc-600 line-clamp-2 mt-2 leading-relaxed">{event.description || 'No description'}</p>

          <div className="flex items-center gap-2 flex-wrap mt-3">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${TYPE_COLORS[event.eventType] || TYPE_COLORS.other}`}>
              {TYPE_LABELS[event.eventType] || event.eventType}
            </span>
            {event.isRecurring && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Recurring
              </span>
            )}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${({ scheduled: 'bg-blue-50 text-blue-700 border-blue-200', ongoing: 'bg-purple-50 text-purple-700 border-purple-200', completed: 'bg-emerald-50 text-emerald-700 border-emerald-200', cancelled: 'bg-red-50 text-red-700 border-red-200' })[event.status] || 'bg-zinc-50 text-zinc-700 border-zinc-200'}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5 p-2.5 rounded-xl bg-white border border-zinc-200/60 text-xs">
            <div className="flex items-center gap-2 text-zinc-700"><Calendar className="w-4 h-4 text-purple-600" /><span className="font-semibold text-zinc-900">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
            <div className="flex items-center gap-2 text-zinc-700"><Clock className="w-4 h-4 text-purple-600" /><span className="font-semibold text-zinc-900">{event.startTime} – {event.endTime}</span></div>
            <div className="flex items-center gap-2 text-zinc-700"><MapPin className="w-4 h-4 text-purple-600" /><span className="font-semibold text-zinc-900 truncate">{event.venueName || 'TBA'}</span></div>
            <div className="flex items-center gap-2 text-zinc-700"><Users className="w-4 h-4 text-purple-600" /><span className="font-semibold text-zinc-900">{event.maxCapacity ? `${event.maxCapacity}` : '∞'}</span></div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-3">
              {event.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-white border border-zinc-200/80 text-[11px] font-medium text-zinc-700 flex items-center gap-1.5 shadow-2xs">
                  <Tag className="w-3 h-3 text-purple-600" />
                  {tag}
                </span>
              ))}
              {event.tags.length > 4 && <span className="text-[11px] font-semibold text-purple-600">+{event.tags.length - 4} more</span>}
            </div>
          )}
        </div>

        <div className="pt-3.5 border-t border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-purple-600" /> {event.venueName || 'TBA'}</span>
            <span className="text-zinc-400 font-medium flex items-center gap-1"><Users className="w-3.5 h-3.5 text-purple-600" /> {event.maxCapacity ? `${event.maxCapacity}` : '∞'}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1.5">
                {event.hasTickets && (
                  <>
                    <span className="text-lg font-extrabold text-zinc-900">
                      {displayCurrency === 'USD'
                        ? `$${event.ticketTiers?.[0]?.priceUSD || 0}`
                        : event.ticketTiers?.[0]?.priceNaira
                          ? `₦${event.ticketTiers[0].priceNaira!.toLocaleString()}`
                          : `$${event.ticketTiers?.[0]?.priceUSD || 0}`}
                    </span>
                    <span className="text-xs text-zinc-400 font-normal">/ ticket</span>
                  </>
                )}
                {!event.hasTickets && (
                  <span className="text-lg font-extrabold text-emerald-600">Free RSVP</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => navigate(`/events/${event.slug}`)} className="px-3 py-2 rounded-lg border bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1 cursor-pointer">
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                <span>Inspect</span>
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); onEdit?.(event); }} className="px-3 py-2 rounded-lg border bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 flex items-center gap-1.5 cursor-pointer">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); onDelete?.(event); }} className="px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 hover:bg-red-100 text-xs font-bold text-red-700 flex items-center gap-1.5 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onViewBookings?.(event)}
              className="flex-1 sm:flex-none py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manage Bookings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Users, Ticket, ImagePlus, Loader2, Trash2, Plus, Minus } from 'lucide-react';
import { uploadToCloudinary } from '../../utils/cloudinary';
import type { Event, TicketTier } from '../../stores/eventsStore';

interface CreateEventModalProps {
  editingEvent: Event | null;
  displayCurrency: 'USD' | 'NGN';
  onClose: () => void;
  onSubmit: (data: Partial<Event>) => Promise<void>;
}

const EVENT_TYPES = [
  { value: 'party', label: 'Party' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'gala', label: 'Gala' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

const CATEGORIES = [
  { value: 'Celebration', label: 'Celebration' },
  { value: 'Social', label: 'Social' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Other', label: 'Other' },
];

const RECURRENCE_FREQ = [
  { value: 'none', label: 'No Recurrence (Single Event)' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  editingEvent,
  onClose,
  onSubmit,
}) => {
  const isEdit = !!editingEvent;
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Event>>({
    title: editingEvent?.title || '',
    eventType: editingEvent?.eventType || 'party',
    category: editingEvent?.category || 'Celebration',
    description: editingEvent?.description || '',
    startDate: editingEvent?.startDate || new Date().toISOString().split('T')[0],
    endDate: editingEvent?.endDate || new Date().toISOString().split('T')[0],
    startTime: editingEvent?.startTime || '19:00',
    endTime: editingEvent?.endTime || '23:00',
    timezone: editingEvent?.timezone || 'Africa/Lagos',
    recurrenceRule: editingEvent?.recurrenceRule || null,
    recurrenceEndDate: editingEvent?.recurrenceEndDate || null,
    recurrenceExceptions: editingEvent?.recurrenceExceptions || [],
    isRecurring: editingEvent?.isRecurring || false,
    venueName: editingEvent?.venueName || '',
    venueDescription: editingEvent?.venueDescription || '',
    maxCapacity: editingEvent?.maxCapacity || null,
    hasTickets: editingEvent?.hasTickets || false,
    ticketTiers: editingEvent?.ticketTiers || [],
    rsvpLimit: editingEvent?.rsvpLimit || null,
    bookingOpensAt: editingEvent?.bookingOpensAt || null,
    bookingClosesAt: editingEvent?.bookingClosesAt || null,
    requiresApproval: editingEvent?.requiresApproval || false,
    heroImage: editingEvent?.heroImage || '',
    gallery: editingEvent?.gallery || [],
    tags: editingEvent?.tags || [],
    isFeatured: editingEvent?.isFeatured || false,
    isPublished: editingEvent?.isPublished !== false,
    status: editingEvent?.status || 'scheduled',
    contactEmail: editingEvent?.contactEmail || '',
    contactPhone: editingEvent?.contactPhone || '',
    externalRegistrationUrl: editingEvent?.externalRegistrationUrl || '',
  });

  const [recurrenceFreq, setRecurrenceFreq] = useState<'none' | 'weekly' | 'monthly'>('none');
  const [weeklyDays, setWeeklyDays] = useState<number[]>([]);
  const [monthlyDay, setMonthlyDay] = useState<number>(1);
  const [monthlyWeek, setMonthlyWeek] = useState<number>(1);
  const [monthlyWeekDay, setMonthlyWeekDay] = useState<number>(1);

  const heroFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    setError(null);
    try {
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, heroImage: url });
    } catch (err: any) {
      setError(err?.message || 'Image upload failed');
    } finally {
      setHeroUploading(false);
      if (heroFileRef.current) heroFileRef.current.value = '';
    }
  };

  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setGalleryUploading(true);
    setError(null);
    try {
      const urls = await Promise.all(files.map(f => uploadToCloudinary(f)));
      setFormData({ ...formData, gallery: [...(formData.gallery || []), ...urls] });
    } catch (err: any) {
      setError(err?.message || 'Image upload failed');
    } finally {
      setGalleryUploading(false);
      if (galleryFileRef.current) galleryFileRef.current.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery?.filter((_, i) => i !== index) || [] });
  };

  const addTicketTier = () => {
    const newTier: TicketTier = {
      id: `tier-${Date.now()}`,
      name: '',
      priceUSD: 0,
      priceNaira: null,
      capacity: null,
      description: '',
    };
    setFormData({ ...formData, ticketTiers: [...(formData.ticketTiers || []), newTier] });
  };

  const updateTicketTier = (index: number, field: keyof TicketTier, value: any) => {
    const tiers = [...(formData.ticketTiers || [])];
    tiers[index] = { ...tiers[index], [field]: value };
    setFormData({ ...formData, ticketTiers: tiers });
  };

  const removeTicketTier = (index: number) => {
    setFormData({ ...formData, ticketTiers: formData.ticketTiers?.filter((_, i) => i !== index) || [] });
  };

  const handleRecurrenceChange = () => {
    if (recurrenceFreq === 'none') {
      setFormData({ ...formData, recurrenceRule: null, isRecurring: false });
    } else if (recurrenceFreq === 'weekly') {
      if (weeklyDays.length === 0) return;
      const byDay = weeklyDays.map(d => ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'][d]).join(',');
      setFormData({ 
        ...formData, 
        recurrenceRule: `FREQ=WEEKLY;INTERVAL=1;BYDAY=${byDay}`, 
        isRecurring: true 
      });
    } else if (recurrenceFreq === 'monthly') {
      if (monthlyDay > 0) {
        setFormData({ 
          ...formData, 
          recurrenceRule: `FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=${monthlyDay}`, 
          isRecurring: true 
        });
      } else {
        const dayNames = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
        setFormData({ 
          ...formData, 
          recurrenceRule: `FREQ=MONTHLY;INTERVAL=1;BYDAY=${monthlyWeek}${dayNames[monthlyWeekDay]}`, 
          isRecurring: true 
        });
      }
    }
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.title?.trim()) { setError('Event title is required'); return false; }
      if (!formData.description?.trim()) { setError('Description is required'); return false; }
    }
    if (step === 2) {
      if (!formData.startDate) { setError('Start date is required'); return false; }
      if (!formData.endDate) { setError('End date is required'); return false; }
      if (new Date(formData.startDate) > new Date(formData.endDate)) { setError('End date must be after start date'); return false; }
      if (recurrenceFreq !== 'none' && !formData.recurrenceRule) { setError('Please configure recurrence properly'); return false; }
    }
    if (step === 3) {
      if (!formData.venueName?.trim()) { setError('Venue name is required'); return false; }
      if (!formData.maxCapacity || formData.maxCapacity < 1) { setError('Valid capacity is required'); return false; }
    }
    if (step === 4 && formData.hasTickets) {
      if (!formData.ticketTiers || formData.ticketTiers.length === 0) { setError('At least one ticket tier is required for paid events'); return false; }
      if (formData.ticketTiers.some(t => !t.name || t.priceUSD <= 0)) { setError('All ticket tiers must have a name and price > 0'); return false; }
    }
    if (step === 5 && !formData.heroImage) {
      setError('Hero image is required');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const submitData = { ...formData };
      if (recurrenceFreq === 'none') {
        submitData.recurrenceRule = null;
        submitData.isRecurring = false;
      }
      await onSubmit(submitData);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Basics', desc: 'Title, type, description' },
    { num: 2, title: 'Schedule', desc: 'Dates, time, recurrence' },
    { num: 3, title: 'Venue', desc: 'Location & capacity' },
    { num: 4, title: 'Tickets', desc: 'Pricing & RSVP settings' },
    { num: 5, title: 'Media', desc: 'Images & gallery' },
    { num: 6, title: 'Settings', desc: 'Publishing & contact' },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-zinc-200 animate-in zoom-in-95">
        <div className="p-6 border-b border-zinc-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">{isEdit ? 'Edit Event' : 'Create New Event / Party'}</h3>
                <p className="text-xs text-zinc-400">{isEdit ? 'Update event details' : 'Set up a new party or event at the hotel'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-1 shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  i + 1 < step ? 'bg-purple-600 text-white' : i + 1 === step ? 'bg-purple-100 text-purple-700' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {i + 1 < step ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                {i < steps.length - 1 && <div className={`w-12 h-0.5 rounded ${i + 1 < step ? 'bg-purple-500' : 'bg-zinc-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-lg font-medium text-zinc-900">Basic Information</h4>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. New Year's Eve Gala 2026"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Event Type *</label>
                  <select
                    value={formData.eventType}
                    onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Description *</label>
                <textarea
                  required
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Describe the event, what guests can expect, highlights..."
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  placeholder="e.g. new-year, gala, black-tie, vip"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-lg font-medium text-zinc-900">Date, Time & Recurrence</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">End Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Timezone</label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 space-y-4">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Recurrence</label>
                <select
                  value={recurrenceFreq}
                  onChange={e => { setRecurrenceFreq(e.target.value as any); handleRecurrenceChange(); }}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  {RECURRENCE_FREQ.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>

                {recurrenceFreq === 'weekly' && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-zinc-700">Select days:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            const newDays = weeklyDays.includes(i) 
                              ? weeklyDays.filter(x => x !== i)
                              : [...weeklyDays, i];
                            setWeeklyDays(newDays);
                            handleRecurrenceChange();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            weeklyDays.includes(i)
                              ? 'bg-purple-600 text-white'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {recurrenceFreq === 'monthly' && (
                  <div className="space-y-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Day of Month (1-31)</label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={monthlyDay}
                          onChange={e => { setMonthlyDay(parseInt(e.target.value) || 1); handleRecurrenceChange(); }}
                          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {recurrenceFreq !== 'none' && (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Recurrence End Date</label>
                    <input
                      type="date"
                      value={formData.recurrenceEndDate || ''}
                      onChange={e => setFormData({ ...formData, recurrenceEndDate: e.target.value || null })}
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                )}

                {(recurrenceFreq === 'weekly' || recurrenceFreq === 'monthly') && (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Exceptions (dates to skip, comma separated)</label>
                    <input
                      type="text"
                      value={formData.recurrenceExceptions?.join(', ') || ''}
                      onChange={e => setFormData({ ...formData, recurrenceExceptions: e.target.value.split(',').map(d => d.trim()).filter(Boolean) })}
                      placeholder="e.g. 2026-04-10, 2026-12-25"
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Venue */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-lg font-medium text-zinc-900">Venue & Capacity</h4>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Venue Name *</label>
                <input
                  type="text"
                  required
                  value={formData.venueName || ''}
                  onChange={e => setFormData({ ...formData, venueName: e.target.value })}
                  placeholder="e.g. Grand Ballroom, Courtyard Garden"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Venue Description</label>
                <textarea
                  value={formData.venueDescription || ''}
                  onChange={e => setFormData({ ...formData, venueDescription: e.target.value })}
                  rows={2}
                  placeholder="Describe the venue, features, amenities..."
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Maximum Capacity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.maxCapacity || ''}
                  onChange={e => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || null })}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* Step 4: Tickets/RSVP */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-lg font-medium text-zinc-900">Tickets & RSVP</h4>
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasTickets}
                    onChange={e => setFormData({ ...formData, hasTickets: e.target.checked })}
                    className="w-4 h-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-zinc-700">This is a paid event with tickets</span>
                </label>
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requiresApproval}
                    onChange={e => setFormData({ ...formData, requiresApproval: e.target.checked })}
                    className="w-4 h-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-zinc-700">Require admin approval for bookings</span>
                </label>
              </div>

              {formData.hasTickets ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-zinc-900">Ticket Tiers</h5>
                    <button type="button" onClick={addTicketTier} className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add Tier
                    </button>
                  </div>
                  {formData.ticketTiers?.map((tier, i) => {
                    return (
                    <div key={tier.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <h6 className="font-medium text-zinc-900">Tier {i + 1}</h6>
                        <button type="button" onClick={() => removeTicketTier(i)} className="p-1 text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-zinc-700 mb-1">Tier Name *</label>
                          <input
                            type="text"
                            required
                            value={tier.name}
                            onChange={e => updateTicketTier(i, 'name', e.target.value)}
                            placeholder="e.g. Early Bird, VIP, Standard"
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-zinc-700 mb-1">Price (USD) *</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={tier.priceUSD}
                            onChange={e => updateTicketTier(i, 'priceUSD', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-zinc-700 mb-1">Price (₦ Naira)</label>
                          <input
                            type="number"
                            min="0"
                            value={tier.priceNaira || ''}
                            onChange={e => updateTicketTier(i, 'priceNaira', parseInt(e.target.value) || null)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-zinc-700 mb-1">Capacity</label>
                          <input
                            type="number"
                            min="1"
                            value={tier.capacity || ''}
                            onChange={e => updateTicketTier(i, 'capacity', parseInt(e.target.value) || null)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-xs font-medium text-zinc-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={tier.description || ''}
                            onChange={e => updateTicketTier(i, 'description', e.target.value)}
                            placeholder="What's included in this tier?"
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                    );
                  })}
                  {(!formData.ticketTiers || formData.ticketTiers.length === 0) && (
                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700">
                      No ticket tiers added yet. Add at least one tier for paid events.
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">RSVP Limit</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.rsvpLimit || ''}
                      onChange={e => setFormData({ ...formData, rsvpLimit: parseInt(e.target.value) || null })}
                      placeholder="Optional: max number of attendees"
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-200 space-y-4">
                <h5 className="font-medium text-zinc-900">Booking Window</h5>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Booking Opens</label>
                    <input
                      type="datetime-local"
                      value={formData.bookingOpensAt ? new Date(formData.bookingOpensAt).toISOString().slice(0, 16) : ''}
                      onChange={e => setFormData({ ...formData, bookingOpensAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Booking Closes</label>
                    <input
                      type="datetime-local"
                      value={formData.bookingClosesAt ? new Date(formData.bookingClosesAt).toISOString().slice(0, 16) : ''}
                      onChange={e => setFormData({ ...formData, bookingClosesAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Media */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-lg font-medium text-zinc-900">Images & Gallery</h4>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Hero Image *</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 relative">
                    {formData.heroImage ? (
                      <img src={formData.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <ImagePlus className="w-8 h-8" />
                      </div>
                    )}
                    {heroUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => heroFileRef.current?.click()}
                      disabled={heroUploading}
                      className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <ImagePlus className="w-4 h-4" />
                      {heroUploading ? 'Uploading...' : formData.heroImage ? 'Change Image' : 'Upload Hero Image'}
                    </button>
                    {formData.heroImage && (
                      <button type="button" onClick={() => setFormData({ ...formData, heroImage: '' })} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-[11px] font-bold hover:bg-red-100 flex items-center gap-1.5 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
                    )}
                    <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroFileChange} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 space-y-1">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Gallery Images</label>
                <div className="flex items-center gap-4 mb-2">
                  <button
                    type="button"
                    onClick={() => galleryFileRef.current?.click()}
                    disabled={galleryUploading}
                    className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <ImagePlus className="w-4 h-4" />
                    {galleryUploading ? 'Uploading...' : 'Add Gallery Images'}
                  </button>
                  <input ref={galleryFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryFileChange} />
                </div>
                {formData.gallery && formData.gallery.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formData.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200">
                        <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 p-1 bg-red-500/90 text-white rounded-full hover:bg-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Settings */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-lg font-medium text-zinc-900">Publishing & Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-5 h-5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isPublished" className="flex-1 cursor-pointer">
                    <p className="font-medium text-zinc-900">Published (visible on website)</p>
                    <p className="text-xs text-zinc-500">Only published events appear on the public events page</p>
                  </label>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isFeatured" className="flex-1 cursor-pointer">
                    <p className="font-medium text-zinc-900">Featured Event</p>
                    <p className="text-xs text-zinc-500">Show prominently on the events page</p>
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 space-y-4">
                <h5 className="font-medium text-zinc-900">Contact Information</h5>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail || ''}
                      onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="events@keoexperience.com"
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={formData.contactPhone || ''}
                      onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+234 813 014 8920"
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">External Registration URL</label>
                  <input
                    type="url"
                    value={formData.externalRegistrationUrl || ''}
                    onChange={e => setFormData({ ...formData, externalRegistrationUrl: e.target.value })}
                    placeholder="https://external-ticketing-site.com/event/123"
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation & Submit */}
          <div className="pt-6 border-t border-zinc-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className="px-4 py-3 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {step === 6 ? (isEdit ? 'Save Changes' : 'Create Event') : 'Continue'}
              {step < 6 && <ChevronRight className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { CheckCircle2, AlertCircle } from 'lucide-react'
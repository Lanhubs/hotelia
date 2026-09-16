import React, { useRef, useState } from 'react';
import { X, UtensilsCrossed, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { ServiceMenuItem } from '../../data/servicesData';
import { uploadToCloudinary } from '../../utils/cloudinary';

interface CreateMenuItemModalProps {
  editingItem: ServiceMenuItem | null;
  displayCurrency: 'USD' | 'NGN';
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'fnb', label: 'Fine Dining & Room Service' },
  { value: 'catering', label: 'Event & Villa Catering' },
  { value: 'spa', label: 'Spa & Wellness' },
  { value: 'concierge', label: 'VIP Concierge & Yacht' },
];

const CATEGORY_LABELS: Record<string, string> = {
  fnb: 'In-Room Gourmet Dining',
  catering: 'Event & Balcony Catering',
  spa: 'Spa & Wellness Sanctuary',
  concierge: 'VIP Concierge & Yacht',
};

export const CreateMenuItemModal: React.FC<CreateMenuItemModalProps> = ({
  editingItem,
  onClose,
  onSubmit,
}) => {
  const isEdit = !!editingItem;

  const [name, setName] = useState(editingItem?.name || '');
  const [category, setCategory] = useState<string>(editingItem?.category || 'fnb');
  const [description, setDescription] = useState(editingItem?.description || '');
  const [priceUSD, setPriceUSD] = useState(editingItem?.priceUSD?.toString() || '');
  const [prepTime, setPrepTime] = useState(editingItem?.prepTime || '');
  const [tags, setTags] = useState((editingItem?.tags || []).join(', '));
  const [dietary, setDietary] = useState((editingItem?.dietary || []).join(', '));
  const [isPopular, setIsPopular] = useState(!!editingItem?.popular);
  const [image, setImage] = useState(editingItem?.image || '');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadToCloudinary(file);
      setImage(url);
    } catch (err: any) {
      setError(err?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Meal/dish name is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: any = {
        name: name.trim(),
        category,
        categoryLabel: CATEGORY_LABELS[category] || 'In-Room Gourmet Dining',
        description: description.trim(),
        priceUSD: Number(priceUSD) || 0,
        prepTime: prepTime.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        dietary: dietary.split(',').map((t) => t.trim()).filter(Boolean),
        isPopular,
        image,
      };
      if (isEdit && editingItem) payload.id = editingItem.id;
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-zinc-200 max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-ink flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                {isEdit ? 'Edit Menu Item' : 'Upload New Meal / Menu Item'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isEdit
                  ? 'Update this item on the on-site restaurant menu'
                  : 'Add a dish or service to your restaurant menu catalog'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Meal / Item Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grilled Atlantic Salmon"
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the dish, ingredients, and preparation..."
              rows={2}
              className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink resize-none"
            />
          </div>

          {/* Price & Prep Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Price (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceUSD}
                onChange={(e) => setPriceUSD(e.target.value)}
                placeholder="e.g. 45"
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Prep Time</label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="e.g. 15-20 min"
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
              />
            </div>
          </div>

          {/* Tags & Dietary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Signature, Seafood, Grilled"
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Dietary (comma separated)</label>
              <input
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="e.g. Gluten-Free, Vegetarian"
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
              />
            </div>
          </div>

          {/* Popular toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => setIsPopular((v) => !v)}
              className={`w-10 h-6 rounded-full transition-colors relative ${isPopular ? 'bg-ink' : 'bg-zinc-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isPopular ? 'translate-x-4' : ''}`}
              />
            </button>
            <span className="text-xs font-bold text-zinc-700">Mark as Popular / Chef Special</span>
          </label>

          {/* Image Upload */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700">Dish Image</label>
            <div className="flex items-center gap-3">
              <div className="w-24 h-20 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 relative">
                {image ? (
                  <img src={image} alt="Dish preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <ImagePlus className="w-6 h-6" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  {uploading ? 'Uploading...' : image ? 'Change Image' : 'Upload Image'}
                </button>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-[11px] font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-5 py-2.5 bg-ink hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Upload Meal / Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
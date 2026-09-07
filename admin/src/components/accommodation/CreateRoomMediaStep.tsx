import React, { useRef, useState, useCallback } from 'react';
import { Image, Video, Plus, Trash2, Link, Upload, Loader2 } from 'lucide-react';
import { uploadToCloudinary, compressImageFile } from '@/src/utils/cloudinary';

interface CreateRoomMediaStepProps {
  heroImage: string;
  setHeroImage: (url: string) => void;
  gallery: string[];
  setGallery: (urls: string[]) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
}

const LUXURY_PHOTO_PRESETS = [
  { label: 'Cliffside Plunge Villa', url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900' },
  { label: 'Presidential Penthouse', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1600&h=900' },
  { label: 'Oceanfront Balcony', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=85&w=1600&h=900' },
  { label: 'Spa & Marble Bath', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=85&w=1600&h=900' },
];


export const CreateRoomMediaStep: React.FC<CreateRoomMediaStepProps> = ({
  heroImage, setHeroImage, gallery, setGallery, videoUrl, setVideoUrl
}) => {
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [heroCompressing, setHeroCompressing] = useState(false);
  const [galleryCompressing, setGalleryCompressing] = useState(false);

  const heroFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const handleHeroFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroCompressing(true);
    try {
      // Compress in browser and upload directly to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);
      setHeroImage(cloudinaryUrl);
    } catch (err: any) {
      console.error('Failed to upload hero image to Cloudinary:', err);
      // Fallback to local compressed data URL if network upload fails
      const { dataUrl } = await compressImageFile(file);
      setHeroImage(dataUrl);
    } finally {
      setHeroCompressing(false);
      e.target.value = '';
    }
  }, [setHeroImage]);

  const handleGalleryFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setGalleryCompressing(true);
    try {
      const uploadedUrls: string[] = await Promise.all(
        files.map(async (f) => {
          try {
            return await uploadToCloudinary(f);
          } catch {
            const { dataUrl } = await compressImageFile(f);
            return dataUrl;
          }
        })
      );
      const deduped = uploadedUrls.filter((url: string) => !gallery.includes(url));
      setGallery([...gallery, ...deduped]);
    } finally {
      setGalleryCompressing(false);
      e.target.value = '';
    }
  }, [gallery, setGallery]);

  const handleAddGalleryUrl = () => {
    if (newGalleryInput.trim() && !gallery.includes(newGalleryInput.trim())) {
      setGallery([...gallery, newGalleryInput.trim()]);
      setNewGalleryInput('');
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero Cover Image */}
      <div>
        <label className="block text-xs font-bold text-zinc-900 mb-1.5 items-center justify-between">
          <span>Cover Hero Image</span>
          <span className="text-[11px] text-zinc-500 font-normal">Primary photo shown on room card</span>
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input type="url" value={heroImage.startsWith('data:') ? '' : heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="Paste URL or upload a file →"
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
            />
            <Image className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroFileChange} />
          <button type="button" onClick={() => heroFileRef.current?.click()}
            disabled={heroCompressing}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shrink-0"
          >
            {heroCompressing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {heroCompressing ? 'Compressing…' : 'Upload'}
          </button>
        </div>

        {heroImage && (
          <div className="mt-2.5 aspect-video w-full max-h-44 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
            <img src={heroImage} alt="Hero preview" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase text-zinc-400">Quick Presets:</span>
          {LUXURY_PHOTO_PRESETS.map((preset, idx) => (
            <button key={idx} type="button" onClick={() => setHeroImage(preset.url)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                heroImage === preset.url ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div className="pt-2 border-t border-zinc-100">
        <label className="block text-xs font-bold text-zinc-900 mb-1.5 items-center justify-between">
          <span>Gallery ({gallery.length} Photos)</span>
          <span className="text-[11px] text-zinc-500 font-normal">Customer carousel — multi-select supported</span>
        </label>

        <div className="flex gap-2">
          <input type="url" value={newGalleryInput} onChange={(e) => setNewGalleryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGalleryUrl()}
            placeholder="Paste high-res gallery photo URL…"
            className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium outline-none focus:border-indigo-400"
          />
          <button type="button" onClick={handleAddGalleryUrl}
            className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add URL
          </button>
          <input ref={galleryFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryFileChange} />
          <button type="button" onClick={() => galleryFileRef.current?.click()}
            disabled={galleryCompressing}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shrink-0"
          >
            {galleryCompressing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {galleryCompressing ? 'Compressing…' : 'Upload Photos'}
          </button>
        </div>

        {gallery.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {gallery.map((url, i) => (
              <div key={i} className="relative aspect-16/10 rounded-lg overflow-hidden border border-zinc-200 group">
                <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setGallery(gallery.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VR Video Tour */}
      <div className="pt-2 border-t border-zinc-100">
        <label className="block text-xs font-bold text-zinc-900 mb-1.5 items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-rose-600" />
            360° VR Video Tour & Walkthrough URL
          </span>
          <span className="text-[11px] text-rose-600 font-bold">Pitch Highlight</span>
        </label>
        <div className="relative">
          <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://vimeo.com/... or https://my.matterport.com/show/?m=..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none"
          />
          <Link className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[11px] text-zinc-400 mt-1">Supports MP4 streams, Vimeo 4K, YouTube 360, or Matterport 3D spatial scans.</p>
      </div>
    </div>
  );
};

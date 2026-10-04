import React, { useState, useEffect } from 'react';
import type { Artwork, ArtworkCategory, Availability } from '../../types/database';
import { X, Upload, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (artwork: Artwork) => void;
  artworkToEdit?: Artwork | null;
}

const CATEGORIES: ArtworkCategory[] = [
  'Paintings',
  'Portraits',
  'Drawings',
  'Contemporary',
  'Abstract',
  'Graphics',
  'Other',
];

const COMMON_MEDIUMS = [
  'Oil on Canvas',
  'Oil on Linen',
  'Charcoal on Paper',
  'Acrylic on Canvas',
  'Gouache & Watercolor',
  'Mixed Media',
];

export const ArtworkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  artworkToEdit,
}) => {
  const isEditing = Boolean(artworkToEdit);

  const [title, setTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [category, setCategory] = useState<ArtworkCategory>('Paintings');
  const [medium, setMedium] = useState('Oil on Canvas');
  const [dimensions, setDimensions] = useState('36 x 48 inches');
  const [price, setPrice] = useState('85000');
  const [isPriceOnRequest, setIsPriceOnRequest] = useState(false);
  const [availability, setAvailability] = useState<Availability>('AVAILABLE');
  const [showOnHomepage, setShowOnHomepage] = useState(true);
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill fields when editing or reset when adding new
  useEffect(() => {
    if (artworkToEdit) {
      setTitle(artworkToEdit.title);
      setPhotoUrl(artworkToEdit.images?.[0]?.storage_path || '');
      setCategory(artworkToEdit.category);
      setMedium(artworkToEdit.medium);
      setDimensions(`${artworkToEdit.width} x ${artworkToEdit.height}`);
      if (artworkToEdit.price && artworkToEdit.price > 0) {
        setPrice(artworkToEdit.price.toString());
        setIsPriceOnRequest(false);
      } else {
        setPrice('');
        setIsPriceOnRequest(true);
      }
      setAvailability(artworkToEdit.availability);
      setShowOnHomepage(artworkToEdit.featured);
      setDescription(artworkToEdit.description || '');
    } else {
      setTitle('');
      setPhotoUrl('');
      setCategory('Paintings');
      setMedium('Oil on Canvas');
      setDimensions('36 x 48 inches');
      setPrice('75000');
      setIsPriceOnRequest(false);
      setAvailability('AVAILABLE');
      setShowOnHomepage(true);
      setDescription('');
    }
    setErrorMessage('');
  }, [artworkToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local file selection from computer or phone
  const handlePhotoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please choose a valid photo (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoUrl(e.target.result as string);
        setErrorMessage('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter an artwork title.');
      return;
    }
    if (!photoUrl.trim()) {
      setErrorMessage('Please upload or provide a photo of the artwork.');
      return;
    }

    // Parse dimensions simply (e.g. "36 x 48 inches" -> width: "36 in", height: "48 in")
    let width = '36 in';
    let height = '48 in';
    const parts = dimensions.split(/x|\*/i);
    if (parts.length >= 2) {
      width = parts[0].trim();
      height = parts[1].trim();
      if (!width.includes('in') && !width.includes('cm')) width += ' in';
      if (!height.includes('in') && !height.includes('cm')) height += ' in';
    } else if (dimensions.trim()) {
      width = dimensions.trim();
      height = dimensions.trim();
    }

    // Auto-generate clean slug in background without bothering the owner
    const cleanSlug = (artworkToEdit?.slug || title)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const finalArtwork: Artwork = {
      id: artworkToEdit?.id || `art-${Date.now()}`,
      title: title.trim(),
      slug: cleanSlug,
      category,
      medium: medium.trim() || 'Oil on Canvas',
      width,
      height,
      year: artworkToEdit?.year || new Date().getFullYear(),
      sale_type: isPriceOnRequest ? 'OFFER' : 'FIXED_PRICE',
      price: !isPriceOnRequest && price ? parseFloat(price) : null,
      availability,
      featured: showOnHomepage,
      signature: artworkToEdit?.signature || false,
      description: description.trim() || `Original ${medium} artwork by Dhirendra.`,
      images: [
        {
          id: `img-${Date.now()}`,
          artwork_id: artworkToEdit?.id || `art-${Date.now()}`,
          storage_path: photoUrl.trim(),
          alt_text: title.trim(),
          sort_order: 1,
          is_primary: true,
        },
      ],
      created_at: artworkToEdit?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(finalArtwork);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-[#E8E5DC] w-full max-w-lg rounded-md shadow-xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E8E5DC] flex items-center justify-between bg-[#FBFBF9]">
          <h2 className="font-serif-display text-xl text-[#141311] font-semibold">
            {isEditing ? 'Edit Artwork' : 'Add New Artwork'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8A857D] hover:text-[#141311] rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Photo Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1.5">
              1. Artwork Photo *
            </label>
            
            {photoUrl ? (
              <div className="space-y-2">
                <div className="relative aspect-[4/3] max-h-56 bg-[#F4F1EA] rounded-sm overflow-hidden border border-[#E8E5DC]">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-xs rounded-xs flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="border-2 border-dashed border-[#D3CEBF] hover:border-[#9B4722] bg-[#FBFBF9] hover:bg-[#FAF5E9] rounded-sm p-6 text-center cursor-pointer block transition-colors">
                  <Upload className="w-7 h-7 mx-auto text-[#9B4722] mb-1.5" />
                  <span className="text-xs font-semibold text-[#141311] block">
                    Click to choose photo from your phone or computer
                  </span>
                  <span className="text-[11px] text-[#8A857D] block mt-0.5">
                    Supports JPG, PNG, WEBP photos
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePhotoUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#8A857D] text-[11px] whitespace-nowrap">Or paste link:</span>
                  <input
                    type="text"
                    placeholder="/photos/Work/..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs border border-[#D3CEBF] rounded-sm focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
              2. Artwork Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Light on the Ghats"
              className="w-full px-3 py-2 text-sm border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
            />
          </div>

          {/* 3. Category & Medium */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ArtworkCategory)}
                className="w-full px-3 py-2 text-xs border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722] bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                Medium
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. Oil on Canvas"
                list="medium-list"
                className="w-full px-3 py-2 text-xs border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              />
              <datalist id="medium-list">
                {COMMON_MEDIUMS.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>
          </div>

          {/* 4. Price & Availability */}
          <div className="p-3.5 bg-[#FAF5E9] border border-[#E8E5DC] rounded-sm space-y-3">
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                  Price in Rupees (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-sm text-[#8A857D]">₹</span>
                  <input
                    type="number"
                    disabled={isPriceOnRequest}
                    value={isPriceOnRequest ? '' : price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={isPriceOnRequest ? 'Price on Request' : '75000'}
                    className="w-full pl-7 pr-2.5 py-1.5 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722] disabled:bg-gray-100 disabled:text-gray-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                  Current Status
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as Availability)}
                  className={`w-full px-2.5 py-1.5 text-xs font-medium border rounded-sm focus:outline-none ${
                    availability === 'AVAILABLE'
                      ? 'bg-green-50 border-green-300 text-green-800'
                      : 'bg-gray-100 border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="AVAILABLE">Available for Sale</option>
                  <option value="SOLD">Sold / Acquired</option>
                  <option value="IN_EXHIBITION">In Exhibition</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#57544E]">
                <input
                  type="checkbox"
                  checked={isPriceOnRequest}
                  onChange={(e) => setIsPriceOnRequest(e.target.checked)}
                  className="rounded text-[#9B4722] focus:ring-[#9B4722]"
                />
                <span>Price on Request (Make an Offer)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#141311] font-medium">
                <input
                  type="checkbox"
                  checked={showOnHomepage}
                  onChange={(e) => setShowOnHomepage(e.target.checked)}
                  className="rounded text-[#9B4722] focus:ring-[#9B4722]"
                />
                <span>Feature on Homepage</span>
              </label>
            </div>
          </div>

          {/* 5. Dimensions */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
              Dimensions / Size
            </label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 36 x 48 inches (or 90 x 120 cm)"
              className="w-full px-3 py-2 text-xs border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
            />
          </div>

          {/* 6. Short Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
              Short Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell buyers a little about this artwork, the inspiration or painting technique..."
              className="w-full px-3 py-2 text-xs border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E8E5DC] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#57544E] hover:text-[#141311] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#141311] hover:bg-[#2C2A26] text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4 text-[#B68B35]" />
              <span>{isEditing ? 'Save Changes' : 'Save & Publish Artwork'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

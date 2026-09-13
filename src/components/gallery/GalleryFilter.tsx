import React, { useState, useMemo } from 'react';
import type { Artwork, ArtworkCategory, Availability } from '../../types/database';
import { MakeOfferModal } from '../forms/MakeOfferModal';
import { PurchaseModal } from '../forms/PurchaseModal';
import { SlidersHorizontal, Maximize2, X, Eye, Sparkles } from 'lucide-react';

interface Props {
  initialArtworks: Artwork[];
}

const CATEGORIES: { label: string; value: 'ALL' | ArtworkCategory }[] = [
  { label: 'All Works', value: 'ALL' },
  { label: 'Paintings', value: 'Paintings' },
  { label: 'Portraits', value: 'Portraits' },
  { label: 'Drawings', value: 'Drawings' },
  { label: 'Contemporary', value: 'Contemporary' },
  { label: 'Abstract', value: 'Abstract' },
  { label: 'Graphics & Prints', value: 'Graphics' },
];

const AVAILABILITIES: { label: string; value: 'ALL' | Availability }[] = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Acquired / Sold', value: 'SOLD' },
];

export const GalleryFilter: React.FC<Props> = ({ initialArtworks }) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ArtworkCategory>('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState<'ALL' | Availability>('ALL');
  const [sortBy, setSortBy] = useState<'FEATURED' | 'NEWEST' | 'TITLE'>('FEATURED');
  const [viewMode, setViewMode] = useState<'EDITORIAL' | 'GRID'>('EDITORIAL');

  // Modal states
  const [offerArtwork, setOfferArtwork] = useState<Artwork | null>(null);
  const [purchaseArtwork, setPurchaseArtwork] = useState<Artwork | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string; title: string } | null>(null);

  const filteredArtworks = useMemo(() => {
    return initialArtworks
      .filter((item) => {
        if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
          return false;
        }
        if (selectedAvailability !== 'ALL' && item.availability !== selectedAvailability) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'FEATURED') {
          if (a.signature && !b.signature) return -1;
          if (!a.signature && b.signature) return 1;
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.year - a.year;
        }
        if (sortBy === 'NEWEST') {
          return b.year - a.year;
        }
        if (sortBy === 'TITLE') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [initialArtworks, selectedCategory, selectedAvailability, sortBy]);

  const formatPrice = (amt?: number | null) => {
    if (!amt) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="w-full">
      {/* Curation & Filter Controls Bar (Non-sticky) */}
      <div className="border-y border-[#E8E5DC] py-6 mb-12 bg-transparent transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none text-xs tracking-wider">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap uppercase text-[11px] font-medium ${
                    active
                      ? 'bg-[#141311] text-[#FBFBF9] shadow-sm'
                      : 'bg-transparent text-[#6B6864] hover:text-[#141311] hover:bg-[#F0ECE3]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Availability & Sorting */}
          <div className="flex items-center gap-4 flex-wrap text-xs">
            {/* Availability */}
            <div className="flex items-center gap-2">
              <span className="text-[#8A857D] text-[11px] uppercase tracking-wider">Status:</span>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value as any)}
                aria-label="Filter by artwork availability status"
                className="bg-white border border-[#D3CEBF] text-[#141311] px-2.5 py-1 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              >
                {AVAILABILITIES.map((av) => (
                  <option key={av.value} value={av.value}>
                    {av.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-[#8A857D] text-[11px] uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort artworks catalogue"
                className="bg-white border border-[#D3CEBF] text-[#141311] px-2.5 py-1 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              >
                <option value="FEATURED">Curated Order</option>
                <option value="NEWEST">Creation Year (Newest)</option>
                <option value="TITLE">Title (A-Z)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-[#D3CEBF] rounded-sm p-0.5 bg-white">
              <button
                onClick={() => setViewMode('EDITORIAL')}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-colors ${
                  viewMode === 'EDITORIAL' ? 'bg-[#141311] text-[#FBFBF9]' : 'text-[#6B6864]'
                }`}
              >
                Editorial
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-colors ${
                  viewMode === 'GRID' ? 'bg-[#141311] text-[#FBFBF9]' : 'text-[#6B6864]'
                }`}
              >
                Grid
              </button>
            </div>

          </div>
        </div>

        {/* Count Indicator */}
        <div className="mt-4 pt-4 border-t border-[#F0ECE3] flex items-center justify-between text-xs text-[#8A857D]">
          <span>
            Exhibiting <strong className="text-[#141311] font-semibold">{filteredArtworks.length}</strong> artwork{filteredArtworks.length === 1 ? '' : 's'}
          </span>
          {selectedCategory !== 'ALL' || selectedAvailability !== 'ALL' ? (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedAvailability('ALL');
              }}
              className="text-[#9B4722] hover:underline"
            >
              Reset Filters
            </button>
          ) : null}
        </div>
      </div>

      {/* Artworks Presentation */}
      {filteredArtworks.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <p className="font-serif-display text-2xl text-[#6B6864]">
            No artworks match your selected curation filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedAvailability('ALL');
            }}
            className="px-6 py-2.5 border border-[#141311] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#141311] hover:text-[#FBFBF9] transition-all"
          >
            Show All Works
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'EDITORIAL'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 gap-x-8'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
          }
        >
          {filteredArtworks.map((artwork, idx) => {
            const primaryImage = artwork.images.find((img) => img.is_primary) || artwork.images[0];
            
            // In editorial layout, create intentional asymmetry based on index
            let colSpan = 'lg:col-span-6';
            let aspectClass = 'aspect-[4/5]';
            if (viewMode === 'EDITORIAL') {
              if (idx % 5 === 0) {
                colSpan = 'lg:col-span-8 lg:col-start-1';
                aspectClass = 'aspect-[16/11]';
              } else if (idx % 5 === 1) {
                colSpan = 'lg:col-span-4';
                aspectClass = 'aspect-[3/4]';
              } else if (idx % 5 === 2) {
                colSpan = 'lg:col-span-5';
                aspectClass = 'aspect-[4/5]';
              } else if (idx % 5 === 3) {
                colSpan = 'lg:col-span-7';
                aspectClass = 'aspect-[5/4]';
              } else {
                colSpan = 'lg:col-span-6';
                aspectClass = 'aspect-[4/5]';
              }
            }

            return (
              <article
                key={artwork.id}
                className={`${colSpan} group relative flex flex-col transition-all duration-300`}
              >
                {/* Visual Image Presentation (Fully Clickable) */}
                <div className="relative overflow-hidden bg-[#F0ECE3] rounded-sm group/img">
                  <a
                    href={`/gallery/${artwork.slug}`}
                    className={`block relative w-full ${aspectClass} overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9B4722]`}
                    aria-label={`View artwork details for ${artwork.title}`}
                  >
                    <img
                      src={primaryImage.storage_path}
                      alt={primaryImage.alt_text}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover/img:scale-105"
                    />
                    
                    {/* Subtle hover shade */}
                    <div className="absolute inset-0 bg-[#141311]/0 group-hover/img:bg-[#141311]/15 transition-colors duration-300" />
                  </a>

                  {/* High-Resolution Zoom Lightbox Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLightboxImage({
                        src: primaryImage.storage_path,
                        alt: primaryImage.alt_text,
                        title: artwork.title,
                      });
                    }}
                    className="absolute top-3 right-3 z-20 p-2 bg-[#FBFBF9]/90 hover:bg-white text-[#141311] rounded-sm shadow-md transition-all hover:scale-110 opacity-90 hover:opacity-100"
                    title="Zoom High-Resolution View"
                    aria-label={`Zoom view for ${artwork.title}`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                    {artwork.signature && (
                      <span className="px-2 py-0.5 text-[10px] tracking-[0.16em] uppercase font-semibold bg-[#141311] text-[#FBFBF9] rounded-[2px] shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#B68B35]" />
                        Signature
                      </span>
                    )}
                    {artwork.availability === 'AVAILABLE' && artwork.sale_type === 'OFFER' && (
                      <span className="px-2 py-0.5 text-[10px] tracking-[0.14em] uppercase font-medium bg-[#B68B35] text-white rounded-[2px] shadow-sm">
                        Accepting Offers
                      </span>
                    )}
                    {artwork.availability === 'AVAILABLE' && artwork.sale_type === 'FIXED_PRICE' && (
                      <span className="px-2 py-0.5 text-[10px] tracking-[0.14em] uppercase font-medium bg-[#2C2A26] text-[#FBFBF9] rounded-[2px] shadow-sm">
                        Available
                      </span>
                    )}
                    {artwork.availability === 'SOLD' && (
                      <span className="px-2 py-0.5 text-[10px] tracking-[0.14em] uppercase font-medium bg-[#8A857D] text-white rounded-[2px]">
                        Acquired
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata Plaque */}
                <div className="pt-4 flex flex-col space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif-display text-2xl text-[#141311] font-medium leading-tight group-hover:text-[#9B4722] transition-colors">
                      <a href={`/gallery/${artwork.slug}`}>
                        {artwork.title}
                      </a>
                    </h3>
                    <span className="text-xs font-mono text-[#8A857D]">
                      {artwork.year}
                    </span>
                  </div>

                  <p className="text-xs text-[#57544E] italic font-serif">
                    {artwork.medium}
                  </p>

                  <p className="text-xs text-[#6B6864] line-clamp-2 pt-1">
                    {artwork.description}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-3 mt-1 border-t border-[#F0ECE3]">
                    <span className="text-[#8A857D] font-mono text-[11px]">
                      {artwork.width} &times; {artwork.height}
                    </span>

                    <div className="flex items-center gap-3">
                      {artwork.availability === 'AVAILABLE' && artwork.sale_type === 'FIXED_PRICE' && (
                        <>
                          <span className="font-medium text-[#141311]">
                            {formatPrice(artwork.price)}
                          </span>
                          <button
                            onClick={() => setPurchaseArtwork(artwork)}
                            className="text-[11px] uppercase tracking-wider text-[#9B4722] hover:text-[#7D3516] font-semibold underline underline-offset-4"
                          >
                            Acquire
                          </button>
                        </>
                      )}

                      {artwork.availability === 'AVAILABLE' && artwork.sale_type === 'OFFER' && (
                        <button
                          onClick={() => setOfferArtwork(artwork)}
                          className="text-[11px] uppercase tracking-wider text-[#B68B35] hover:text-[#9A4621] font-semibold underline underline-offset-4"
                        >
                          Make Offer &rarr;
                        </button>
                      )}

                      {artwork.availability === 'SOLD' && (
                        <span className="text-[#8A857D] text-[11px] uppercase tracking-wider">
                          Private Collection
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Offer Modal */}
      {offerArtwork && (
        <MakeOfferModal
          artwork={offerArtwork}
          isOpen={Boolean(offerArtwork)}
          onClose={() => setOfferArtwork(null)}
        />
      )}

      {/* Purchase Modal */}
      {purchaseArtwork && (
        <PurchaseModal
          artwork={purchaseArtwork}
          isOpen={Boolean(purchaseArtwork)}
          onClose={() => setPurchaseArtwork(null)}
        />
      )}

      {/* Lightbox Zoom Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141311]/90 backdrop-blur-md cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#E8E5DC] p-2"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-h-[82vh] w-auto object-contain rounded-sm shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-white/80 font-serif text-sm italic mt-3 text-center">
              {lightboxImage.title}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

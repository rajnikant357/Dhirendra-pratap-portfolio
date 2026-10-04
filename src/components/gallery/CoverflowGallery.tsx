import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { Artwork } from '../../types/database';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface CoverflowGalleryProps {
  artworks: Artwork[];
}

export default function CoverflowGallery({ artworks }: CoverflowGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [dragged, setDragged] = useState(false);

  // Take the curated artworks for display (up to 8)
  const displayArtworks = artworks.slice(0, 8);

  // Monitor scroll position to update active index indicator
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerLeft = container.scrollLeft;
    const containerCenter = containerLeft + container.clientWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Smooth scroll to a specific card index
  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    const containerWidth = container.clientWidth;
    const cardWidth = card.offsetWidth;
    const targetScroll = card.offsetLeft - (containerWidth / 2 - cardWidth / 2);

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth'
    });
    setActiveIndex(index);
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    setIsDragging(true);
    setDragged(false);
    setStartX(e.pageX);
    setScrollStart(container.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;

    const diff = e.pageX - startX;
    if (Math.abs(diff) > 5) {
      setDragged(true);
    }
    container.scrollLeft = scrollStart - diff;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    } else {
      scrollToIndex(displayArtworks.length - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < displayArtworks.length - 1) {
      scrollToIndex(activeIndex + 1);
    } else {
      scrollToIndex(0);
    }
  };

  return (
    <div className="relative w-full py-4 select-none">
      {/* Normal Flat Horizontal Carousel Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full overflow-x-auto overflow-y-hidden py-6 px-4 sm:px-6 lg:px-8 scroll-smooth no-scrollbar ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: isDragging ? 'none' : 'x mandatory'
        }}
      >
        <div className="inline-flex items-stretch gap-6 sm:gap-8">
          {displayArtworks.map((artwork, idx) => {
            const primaryImg = artwork.images[0]?.storage_path || '';
            const cleanSrc = primaryImg.replace(/%26/g, '&');

            return (
              <div
                key={artwork.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[390px] flex-shrink-0 flex flex-col"
                style={{
                  scrollSnapAlign: 'center'
                }}
              >
                {/* Symmetrical Exhibition Card (Same Format as Gallery Cards) */}
                <article className="h-full bg-white border border-[#E8E5DC] rounded-sm overflow-hidden flex flex-col hover:border-[#B68B35]/60 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                  
                  {/* Uniform Symmetrical Image Container with aspect-[4/3] */}
                  <div className="relative w-full aspect-[4/3] bg-[#F0ECE3] overflow-hidden group/img">
                    <a
                      href={`/gallery/${artwork.slug}`}
                      onClick={(e) => {
                        if (dragged) e.preventDefault();
                      }}
                      className="block w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9B4722]"
                      aria-label={`View dossier for ${artwork.title}`}
                    >
                      <img
                        src={cleanSrc}
                        alt={artwork.title}
                        loading={idx <= 2 ? 'eager' : 'lazy'}
                        draggable={false}
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#141311]/0 group-hover/img:bg-[#141311]/15 transition-colors duration-300" />
                    </a>

                    {/* Symmetrical Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none z-10">
                      {artwork.signature && (
                        <span className="px-2 py-0.5 text-[10px] tracking-[0.16em] uppercase font-semibold bg-[#141311] text-[#FBFBF9] rounded-xs shadow-sm flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#B68B35]" />
                          Signature
                        </span>
                      )}

                      {artwork.featured && !artwork.signature && (
                        <span className="px-2 py-0.5 text-[10px] tracking-[0.14em] uppercase font-medium bg-[#B68B35] text-white rounded-xs shadow-sm">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Symmetrical Card Body (Uniform Padding & Heights, No Pricing) */}
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#9B4722] uppercase tracking-wider text-[11px] font-semibold">
                          {artwork.category}
                        </span>
                        <span className="font-mono text-[#8A857D] text-xs shrink-0">
                          {artwork.year}
                        </span>
                      </div>

                      <h3 className="font-serif-display text-xl sm:text-2xl text-[#141311] font-medium leading-tight group-hover:text-[#9B4722] transition-colors">
                        <a
                          href={`/gallery/${artwork.slug}`}
                          onClick={(e) => {
                            if (dragged) e.preventDefault();
                          }}
                        >
                          {artwork.title}
                        </a>
                      </h3>

                      {artwork.medium && (
                        <p className="text-xs text-[#57544E] italic font-serif">
                          {artwork.medium}
                        </p>
                      )}

                      <p className="text-xs text-[#6B6864] line-clamp-2 leading-relaxed">
                        {artwork.description}
                      </p>
                    </div>

                    {/* Symmetrical Card Footer with Action (NO PRICING) */}
                    <div className="pt-3 border-t border-[#F0ECE3] flex items-center justify-between text-xs mt-auto">
                      <span className="text-[#8A857D] font-mono text-[11px]">
                        {artwork.width && artwork.height
                          ? `${artwork.width} × ${artwork.height}`
                          : 'Studio Masterwork'}
                      </span>

                      <a
                        href={`/gallery/${artwork.slug}`}
                        onClick={(e) => {
                          if (dragged) e.preventDefault();
                        }}
                        className="text-[11px] uppercase tracking-wider text-[#9B4722] hover:text-[#7D3516] font-semibold inline-flex items-center gap-1 group/btn"
                      >
                        <span>View Artwork</span>
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>

                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls: Prev, Next & Dots */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Curatorial Status Hint */}
        <div className="flex items-center gap-2 text-xs text-[#8A857D] font-mono tracking-wider uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-[#9B4722]"></span>
          <span>Curated Masterworks &bull; Scroll, swipe, or click to explore</span>
        </div>

        {/* Arrow Controls & Dot Indicators */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous artwork"
            className="w-10 h-10 rounded-full border border-[#141311] text-[#141311] hover:bg-[#141311] hover:text-[#FBFBF9] flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9B4722]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {displayArtworks.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? 'w-6 h-2 bg-[#9B4722]'
                    : 'w-2 h-2 bg-[#D3CEBF] hover:bg-[#8A857D]'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next artwork"
            className="w-10 h-10 rounded-full border border-[#141311] text-[#141311] hover:bg-[#141311] hover:text-[#FBFBF9] flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9B4722]"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

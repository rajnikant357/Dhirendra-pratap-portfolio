import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { Artwork } from '../../types/database';

interface CoverflowGalleryProps {
  artworks: Artwork[];
}

export default function CoverflowGallery({ artworks }: CoverflowGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [dragged, setDragged] = useState(false);

  // Six rectangular cards
  const displayArtworks = artworks.slice(0, 6);

  // Update 3D coverflow perspective transformations on each card
  const updateTransforms = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerCenter = container.scrollLeft + containerWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;

      const cardWidth = card.offsetWidth;
      const cardCenter = card.offsetLeft + cardWidth / 2;
      const distance = cardCenter - containerCenter;
      const absDistance = Math.abs(distance);

      if (absDistance < minDistance) {
        minDistance = absDistance;
        closestIdx = idx;
      }

      // Normalized distance from center (-1 to 1 for adjacent cards)
      const norm = distance / (cardWidth * 0.85);
      const clampedNorm = Math.max(-3, Math.min(3, norm));

      // 3D Coverflow Curved Perspective:
      // Outer cards tilt inward toward the center/viewer.
      // Left cards (norm < 0) face inward to the right: positive rotateY
      // Right cards (norm > 0) face inward to the left: negative rotateY
      const rotateY = -clampedNorm * 32;
      const translateZ = -Math.min(240, Math.abs(clampedNorm) * 75);
      const scale = Math.max(0.82, 1 - Math.abs(clampedNorm) * 0.08);
      const brightness = Math.max(0.7, 1 - Math.abs(clampedNorm) * 0.14);
      const opacity = Math.max(0.55, 1 - Math.abs(clampedNorm) * 0.15);
      const zIndex = Math.round(50 - Math.min(45, Math.abs(clampedNorm) * 12));

      card.style.transform = `perspective(1200px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
      card.style.filter = `brightness(${brightness})`;
      card.style.opacity = `${opacity}`;
      card.style.zIndex = `${zIndex}`;

      if (Math.abs(norm) < 0.3) {
        card.style.boxShadow = '0 25px 60px -12px rgba(20, 19, 17, 0.32), 0 12px 24px -8px rgba(20, 19, 17, 0.2)';
      } else {
        card.style.boxShadow = '0 15px 35px -8px rgba(20, 19, 17, 0.18)';
      }
    });

    setActiveIndex(closestIdx);
  }, []);

  // Scroll to a specific card index
  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    const containerWidth = container.clientWidth;
    const cardWidth = card.offsetWidth;
    const targetScroll = card.offsetLeft - (containerWidth / 2 - cardWidth / 2);

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }, []);

  // Initialize and center on the second card after render
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial center on card 1 (second card) or card 0
    const initialIndex = displayArtworks.length > 2 ? 1 : 0;
    const timer = setTimeout(() => {
      scrollToIndex(initialIndex);
      updateTransforms();
    }, 100);

    const handleScroll = () => {
      window.requestAnimationFrame(updateTransforms);
    };

    const handleResize = () => {
      window.requestAnimationFrame(updateTransforms);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [displayArtworks.length, scrollToIndex, updateTransforms]);

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

  // Card click: if outer card, center it. If center card, navigate to slug.
  const handleCardClick = (idx: number, slug: string) => {
    if (dragged) return;

    if (idx !== activeIndex) {
      scrollToIndex(idx);
    } else {
      window.location.href = `/gallery/${slug}`;
    }
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

  const formatPrice = (art: Artwork) => {
    if (art.availability === 'SOLD') {
      return 'Sold — Private Collection';
    }
    if (art.sale_type === 'OFFER') {
      return 'Accepting Collector Offers';
    }
    if (art.price) {
      return `₹${art.price.toLocaleString('en-IN')}`;
    }
    return 'Acquisition on Request';
  };

  return (
    <div className="relative w-full py-8 select-none">
      {/* Curved Perspective 3D Stage Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full overflow-x-auto overflow-y-hidden py-12 px-4 scroll-smooth no-scrollbar ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: isDragging ? 'none' : 'x mandatory'
        }}
      >
        <div
          className="inline-flex items-center gap-6 md:gap-10"
          style={{
            transformStyle: 'preserve-3d',
            paddingLeft: 'max(2rem, calc(50vw - 200px))',
            paddingRight: 'max(2rem, calc(50vw - 200px))'
          }}
        >
          {displayArtworks.map((artwork, idx) => {
            const isCenter = idx === activeIndex;
            const primaryImg = artwork.images[0]?.storage_path || '';

            return (
              <div
                key={artwork.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                onClick={() => handleCardClick(idx, artwork.slug)}
                className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[390px] flex-shrink-0 transition-shadow duration-300 group cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity, filter',
                  scrollSnapAlign: 'center'
                }}
              >
                {/* Physical Framed Exhibition Card */}
                <div className="relative bg-white rounded-sm border border-[#E8E5DC] p-3 sm:p-4 shadow-xl overflow-hidden transition-all duration-300">
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between text-[11px] mb-3 pb-2 border-b border-[#F4F1EA]">
                    <span className="uppercase tracking-[0.16em] font-semibold text-[#9B4722]">
                      {artwork.signature ? 'Signature Work' : artwork.category}
                    </span>
                    <span className="font-mono text-[#8A857D] text-[10px]">
                      {artwork.year}
                    </span>
                  </div>

                  {/* Rectangular Image Frame (Cover photography) */}
                  <div className="relative aspect-[4/5] bg-[#E8E5DC] overflow-hidden rounded-sm border border-[#F0ECE3] shadow-inner">
                    <img
                      src={primaryImg}
                      alt={artwork.title}
                      loading={idx <= 2 ? 'eager' : 'lazy'}
                      draggable={false}
                      className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Subtle Overlay Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141311]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-[#FBFBF9] font-medium bg-[#141311]/80 px-3 py-1 rounded-sm backdrop-blur-sm">
                        {isCenter ? 'Click to View Artwork Details' : 'Click to Bring to Center'}
                      </span>
                    </div>

                    {/* Signature / Availability Corner Badge */}
                    {artwork.signature && (
                      <div className="absolute top-2.5 right-2.5 bg-[#141311]/85 backdrop-blur-xs text-[#B68B35] px-2 py-0.5 text-[9px] uppercase tracking-widest font-semibold rounded-xs border border-[#B68B35]/40">
                        Signature
                      </div>
                    )}
                  </div>

                  {/* Plaque / Metadata Underneath */}
                  <div className="pt-3.5 space-y-1">
                    <h3 className="font-serif-display text-lg sm:text-xl text-[#141311] font-medium leading-snug truncate">
                      {artwork.title}
                    </h3>
                    <p className="text-xs text-[#6B6864] font-serif italic truncate">
                      {artwork.medium}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-[#F0ECE3] mt-2">
                      <span className="text-xs font-medium text-[#141311]">
                        {formatPrice(artwork)}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-[#9B4722] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Explore &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls: Prev, Next & Counter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Helper Hint */}
        <div className="flex items-center gap-2 text-xs text-[#8A857D] font-mono tracking-wider uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-[#9B4722] animate-pulse"></span>
          <span>Horizontal 3D Curved Perspective &bull; Scroll, Swipe, or Drag</span>
        </div>

        {/* Arrow Buttons & Dot Indicators */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous artwork"
            className="w-10 h-10 rounded-full border border-[#141311] text-[#141311] hover:bg-[#141311] hover:text-[#FBFBF9] flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9B4722]"
          >
            &larr;
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
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

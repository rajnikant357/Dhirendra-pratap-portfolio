import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { UNIQUE_MEDIA, type MediaItem } from '../../data/media-manifest';
import type { Achievement } from '../../types/database';
import {
  Award,
  Newspaper,
  Search,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialAchievements: Achievement[];
}

const AWARDS_PAGE_SIZE = 18;
const PRESS_PAGE_SIZE = 18;

function cleanImageUrl(src: string): string {
  if (!src) return '';
  return src.replace(/%26/g, '&');
}

function getThumbnailUrl(src: string): string {
  if (!src) return '';
  const cleaned = cleanImageUrl(src);
  return cleaned.replace(/\.(jpg|jpeg|png)$/i, '.thumb.webp');
}

function getWebpUrl(src: string): string {
  if (!src) return '';
  const cleaned = cleanImageUrl(src);
  return cleaned.replace(/\.(jpg|jpeg|png)$/i, '.webp');
}

export const AwardsArchiveView: React.FC<Props> = ({ initialAchievements }) => {
  // Active tab: 'ALL' | 'AWARDS' | 'PRESS'
  const [activeSection, setActiveSection] = useState<'AWARDS' | 'PRESS'>('AWARDS');
  const isProgrammaticScrollRef = useRef(false);

  // Pagination
  const [visibleAwardsCount, setVisibleAwardsCount] = useState<number>(AWARDS_PAGE_SIZE);
  const [visiblePressCount, setVisiblePressCount] = useState<number>(PRESS_PAGE_SIZE);

  // Lightbox state
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  // Awards items from manifest
  const awardsItems = useMemo(() => {
    return UNIQUE_MEDIA.filter((item) => item.category === 'Awards & Recognition');
  }, []);

  // Press items from manifest
  const pressItems = useMemo(() => {
    return UNIQUE_MEDIA.filter((item) => item.category === 'Press & Media');
  }, []);

  const visibleAwards = useMemo(() => {
    return awardsItems.slice(0, visibleAwardsCount);
  }, [awardsItems, visibleAwardsCount]);

  const visiblePress = useMemo(() => {
    return pressItems.slice(0, visiblePressCount);
  }, [pressItems, visiblePressCount]);

  // Auto-jump upper button between 'AWARDS' and 'PRESS' when scrolling past the news articles section
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const newsSection = document.getElementById('news-articles');
          if (newsSection) {
            // Offset threshold accounts for sticky site header (80px) + sticky switcher (~75px) + padding
            const offsetThreshold = 220;
            const newsRect = newsSection.getBoundingClientRect();

            if (newsRect.top <= offsetThreshold) {
              setActiveSection('PRESS');
            } else {
              setActiveSection('AWARDS');
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    section: 'AWARDS' | 'PRESS'
  ) => {
    e.preventDefault();
    setActiveSection(section);
    isProgrammaticScrollRef.current = true;

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      try {
        window.history.replaceState(null, '', `#${targetId}`);
      } catch {}
    }

    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 800);
  };

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxItem) return;
      if (e.key === 'Escape') {
        setLightboxItem(null);
      }
    },
    [lightboxItem]
  );

  useEffect(() => {
    if (lightboxItem) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [lightboxItem, handleKeyDown]);

  return (
    <div className="w-full space-y-16">
      {/* Quick Section Switcher Bar */}
      <div className="sticky top-20 z-30 bg-[#FBFBF9]/95 backdrop-blur-md py-4 border-b border-[#E8E5DC] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a
            href="#recognition"
            onClick={(e) => handleSectionClick(e, 'recognition', 'AWARDS')}
            className={`px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeSection === 'AWARDS'
                ? 'bg-[#141311] text-[#FBFBF9] shadow-sm ring-1 ring-[#141311]'
                : 'bg-white border border-[#E8E5DC] text-[#6B6864] hover:text-[#141311] hover:border-[#141311]'
            }`}
          >
            <Award className={`w-4 h-4 transition-colors ${activeSection === 'AWARDS' ? 'text-[#B68B35]' : 'text-[#8A857D]'}`} />
            <span>Recognition &amp; Awards</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-colors ${
              activeSection === 'AWARDS' ? 'bg-white/20 text-[#FBFBF9]' : 'bg-[#F0ECE3] text-[#57544E]'
            }`}>
              {awardsItems.length}
            </span>
          </a>

          <a
            href="#news-articles"
            onClick={(e) => handleSectionClick(e, 'news-articles', 'PRESS')}
            className={`px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeSection === 'PRESS'
                ? 'bg-[#141311] text-[#FBFBF9] shadow-sm ring-1 ring-[#141311]'
                : 'bg-white border border-[#E8E5DC] text-[#6B6864] hover:text-[#141311] hover:border-[#141311]'
            }`}
          >
            <Newspaper className={`w-4 h-4 transition-colors ${activeSection === 'PRESS' ? 'text-[#9B4722]' : 'text-[#8A857D]'}`} />
            <span>News Articles &amp; Press</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-colors ${
              activeSection === 'PRESS' ? 'bg-white/20 text-[#FBFBF9]' : 'bg-[#F0ECE3] text-[#57544E]'
            }`}>
              {pressItems.length}
            </span>
          </a>
        </div>

        <div className="text-xs text-[#8A857D] font-mono">
          Total Archival Records: <strong className="text-[#141311]">{awardsItems.length + pressItems.length}</strong>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: RECOGNITION & AWARDS */}
      {/* ========================================================= */}
      <section id="recognition" className="scroll-mt-44 space-y-8">
        {/* Clean Section Header */}
        <div className="pb-4 border-b border-[#E8E5DC] flex items-center justify-between">
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#141311] font-medium tracking-tight">
            Recognition &amp; State Awards
          </h2>
          <span className="text-xs text-[#8A857D] font-mono">
            {awardsItems.length} Records
          </span>
        </div>


        {/* Highlighted Verified Accolades (Top 4 Milestone Cards) */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B68B35] font-semibold block">
            Apex Milestones &amp; State Citations
          </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {initialAchievements.slice(0, 4).map((ach) => (
                <div
                  key={ach.id}
                  className="bg-white p-5 rounded-sm border border-[#E8E5DC] flex flex-col justify-between hover:shadow-md transition-all space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 bg-[#FAF5E9] border border-[#E8E5DC] text-[#9B4722] font-semibold uppercase tracking-wider text-[10px]">
                        {ach.category}
                      </span>
                      <span className="font-mono text-[#8A857D]">{ach.year}</span>
                    </div>
                    <h3 className="font-serif-display text-lg text-[#141311] font-medium leading-snug">
                      {ach.title}
                    </h3>
                    <p className="text-xs text-[#6B6864] font-medium">
                      {ach.organization} {ach.location ? `• ${ach.location}` : ''}
                    </p>
                    <p className="text-xs text-[#57544E] leading-relaxed line-clamp-3">
                      {ach.description}
                    </p>
                  </div>

                  {ach.image_path && (
                    <div
                      onClick={() => {
                        const matched = UNIQUE_MEDIA.find(
                          (m) => m.src === ach.image_path || m.rawSrc === ach.image_path
                        );
                        if (matched) setLightboxItem(matched);
                      }}
                      className="cursor-pointer group/ach aspect-[16/10] bg-[#F0ECE3] rounded-sm overflow-hidden border border-[#E8E5DC] relative"
                    >
                      <img
                        src={getThumbnailUrl(ach.image_path)}
                        alt={`${ach.title} citation`}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover group-hover/ach:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const fallback = cleanImageUrl(ach.image_path);
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-[#141311]/0 group-hover/ach:bg-[#141311]/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover/ach:opacity-100 transition-opacity px-2.5 py-1 bg-white/90 text-[10px] uppercase font-semibold text-[#141311] rounded-sm">
                          Inspect &rarr;
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        {/* Full Symmetrical Award Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#8A857D]">
            <span>
              Showing <strong className="text-[#141311]">{visibleAwards.length}</strong> of{' '}
              <strong className="text-[#141311]">{awardsItems.length}</strong> verified certificates &amp; awards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {visibleAwards.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-[#E8E5DC] rounded-sm overflow-hidden flex flex-col hover:border-[#B68B35]/50 hover:shadow-md transition-all duration-300"
                >
                  {/* Uniform Symmetrical Image Container */}
                  <div
                    onClick={() => setLightboxItem(item)}
                    className="relative w-full aspect-[4/3] bg-[#F0ECE3] overflow-hidden cursor-zoom-in group/img"
                  >
                    <img
                      src={getThumbnailUrl(item.src)}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={300}
                      className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover/img:scale-105"
                      onError={(e) => {
                        const fallback = cleanImageUrl(item.src);
                        if (e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-[#141311]/0 group-hover/img:bg-[#141311]/15 transition-colors duration-300" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase font-semibold bg-[#141311]/90 text-white rounded-sm backdrop-blur-xs flex items-center gap-1">
                        <Award className="w-2.5 h-2.5 text-[#B68B35]" />
                        {item.subcategory || 'Recognition'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxItem(item);
                      }}
                      className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 text-[#141311] rounded-sm hover:scale-110 transition-transform shadow-xs"
                      title="Inspect Certificate Full Resolution"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Symmetrical Card Body */}
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#8A857D]">
                        <span className="text-[11px] font-mono font-medium text-[#9B4722]">
                          Certificate #{item.id.replace('award-cert-', '')}
                        </span>
                        <span className="font-mono">{item.year}</span>
                      </div>
                      <h3
                        onClick={() => setLightboxItem(item)}
                        className="font-serif-display text-lg sm:text-xl text-[#141311] font-medium leading-snug hover:text-[#9B4722] cursor-pointer transition-colors"
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#57544E] leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0ECE3] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#8A857D] uppercase tracking-wider">
                        Archival Citation
                      </span>
                      <button
                        onClick={() => setLightboxItem(item)}
                        className="text-[11px] uppercase tracking-wider text-[#9B4722] hover:text-[#7D3516] font-semibold underline underline-offset-4"
                      >
                        Inspect Document &rarr;
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          {/* Load More Button for Awards */}
          {visibleAwardsCount < awardsItems.length && (
            <div className="text-center pt-8">
              <button
                onClick={() => setVisibleAwardsCount((prev) => prev + AWARDS_PAGE_SIZE)}
                className="px-8 py-3.5 bg-[#141311] hover:bg-[#2C2A26] text-[#FBFBF9] text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm"
              >
                Load More Certificates ({awardsItems.length - visibleAwardsCount} Remaining) &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: NEWS ARTICLES & PRESS COVERAGE */}
      {/* ========================================================= */}
      <section id="news-articles" className="scroll-mt-44 space-y-8 pt-12 border-t-2 border-[#E8E5DC]">
        {/* Clean Section Header */}
        <div className="pb-4 border-b border-[#E8E5DC] flex items-center justify-between">
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#141311] font-medium tracking-tight">
            News Articles &amp; Published Press
          </h2>
          <span className="text-xs text-[#8A857D] font-mono">
            {pressItems.length} Records
          </span>
        </div>

        {/* Full Symmetrical News Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#8A857D]">
            <span>
              Showing <strong className="text-[#141311]">{visiblePress.length}</strong> of{' '}
              <strong className="text-[#141311]">{pressItems.length}</strong> published press clippings
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {visiblePress.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-[#E8E5DC] rounded-sm overflow-hidden flex flex-col hover:border-[#9B4722]/50 hover:shadow-md transition-all duration-300"
                >
                  {/* Uniform Symmetrical Image Container */}
                  <div
                    onClick={() => setLightboxItem(item)}
                    className="relative w-full aspect-[4/3] bg-[#F0ECE3] overflow-hidden cursor-zoom-in group/pressimg"
                  >
                    <img
                      src={getThumbnailUrl(item.src)}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={300}
                      className="w-full h-full object-cover object-top transform transition-transform duration-700 ease-out group-hover/pressimg:scale-105"
                      onError={(e) => {
                        const fallback = cleanImageUrl(item.src);
                        if (e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-[#141311]/0 group-hover/pressimg:bg-[#141311]/15 transition-colors duration-300" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase font-semibold bg-[#141311]/90 text-white rounded-sm backdrop-blur-xs flex items-center gap-1">
                        <Newspaper className="w-2.5 h-2.5 text-[#B68B35]" />
                        Press Clipping
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxItem(item);
                      }}
                      className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 text-[#141311] rounded-sm hover:scale-110 transition-transform shadow-xs"
                      title="Inspect Clipping Full Resolution"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Symmetrical Card Body */}
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#8A857D]">
                        <span className="text-[11px] font-mono font-medium text-[#9B4722]">
                          Press Record #{item.id.replace('media-press-', '')}
                        </span>
                        <span className="font-mono">{item.year}</span>
                      </div>
                      <h3
                        onClick={() => setLightboxItem(item)}
                        className="font-serif-display text-lg sm:text-xl text-[#141311] font-medium leading-snug hover:text-[#9B4722] cursor-pointer transition-colors"
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#57544E] leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0ECE3] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#8A857D] uppercase tracking-wider">
                        Published Press
                      </span>
                      <button
                        onClick={() => setLightboxItem(item)}
                        className="text-[11px] uppercase tracking-wider text-[#9B4722] hover:text-[#7D3516] font-semibold underline underline-offset-4"
                      >
                        Read Clipping &rarr;
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          {/* Load More Button for Press */}
          {visiblePressCount < pressItems.length && (
            <div className="text-center pt-8">
              <button
                onClick={() => setVisiblePressCount((prev) => prev + PRESS_PAGE_SIZE)}
                className="px-8 py-3.5 bg-[#141311] hover:bg-[#2C2A26] text-[#FBFBF9] text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm"
              >
                Load More News Articles ({pressItems.length - visiblePressCount} Remaining) &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* HIGH RESOLUTION LIGHTBOX MODAL */}
      {/* ========================================================= */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          className="fixed inset-0 z-50 bg-[#141311]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxItem(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 z-50 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-[#1C1B18] rounded-sm border border-[#33312E] overflow-hidden shadow-2xl"
          >
            {/* Modal Image Frame */}
            <div className="relative flex-grow flex items-center justify-center bg-black/60 p-2 sm:p-4 overflow-hidden min-h-[50vh] max-h-[72vh]">
              <img
                src={getWebpUrl(lightboxItem.src)}
                alt={lightboxItem.alt}
                className="max-h-[70vh] w-auto max-w-full object-contain mx-auto shadow-lg"
                onError={(e) => {
                  const fallback = cleanImageUrl(lightboxItem.src);
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
              />
            </div>

            {/* Modal Metadata Plaque */}
            <div className="p-5 sm:p-6 bg-[#181715] border-t border-[#2C2A26] text-[#FBFBF9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-[#FAF5E9]/10 text-[#B68B35] font-semibold text-[10px] uppercase tracking-wider rounded-xs">
                    {lightboxItem.category}
                  </span>
                  <span className="text-[#8A857D]">&bull;</span>
                  <span className="text-xs text-[#A8A291]">{lightboxItem.subcategory}</span>
                  <span className="text-[#8A857D]">&bull;</span>
                  <span className="font-mono text-xs text-[#8A857D]">{lightboxItem.year}</span>
                </div>
                <h3 className="font-serif-display text-xl sm:text-2xl text-[#FBFBF9] font-medium">
                  {lightboxItem.title}
                </h3>
                <p className="text-xs text-[#A8A291] leading-relaxed">
                  {lightboxItem.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={lightboxItem.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#444] hover:border-white text-xs uppercase tracking-wider text-[#FBFBF9] transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Full Resolution
                </a>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="px-4 py-2 bg-[#B68B35] hover:bg-[#A37B2B] text-[#141311] text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

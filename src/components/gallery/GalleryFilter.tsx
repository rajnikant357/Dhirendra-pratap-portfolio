import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Artwork, ArtworkCategory } from '../../types/database';
import { UNIQUE_MEDIA, type MediaItem } from '../../data/media-manifest';
import { mergeArtworks } from '../../lib/cmsStorage';
import {
  Maximize2,
  X,
  Sparkles,
  Search,
  ExternalLink,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  Layers,
  Palette,
  MessageSquare,
  Grid3X3,
  LayoutGrid,
  Award,
} from 'lucide-react';

interface Props {
  initialArtworks: Artwork[];
}

export interface UnifiedGalleryItem {
  id: string;
  title: string;
  src: string;
  rawSrc: string;
  alt: string;
  category: string;
  subcategory: string;
  description: string;
  year: number;
  featured: boolean;
  tags: string[];
  isArtwork: boolean;
  artworkSlug?: string;
  medium?: string;
  width?: string;
  height?: string;
  signature?: boolean;
  processStage?: 'STARTING' | 'IN_PROGRESS' | 'FINISHED' | null;
  processGroup?: string | null;
  processGroupName?: string | null;
  stageLabel?: string | null;
  filename?: string;
}

interface ProcessGroupData {
  groupId: string;
  groupName: string;
  category: string;
  year: number;
  description: string;
  starting: UnifiedGalleryItem[];
  inProgress: UnifiedGalleryItem[];
  finished: UnifiedGalleryItem[];
}

const CATEGORY_TABS = [
  { label: 'All Creative Works', value: 'ALL' },
  { label: 'Rangoli', value: 'Rangoli' },
  { label: 'Scrap Art', value: 'Scrap Craft' },
  { label: 'Foam Art', value: 'Foam Art' },
  { label: 'Wall Art', value: 'Wall Art' },
  { label: 'Set Design', value: 'Set Design' },
  { label: 'Paintings & Sketches', value: 'Paintings & Sketches' },
  { label: 'Work Process (Starting to Finished)', value: 'PROCESS' },
] as const;

function parseCategoryFromQuery(param: string | null): string | null {
  if (!param) return null;
  let decoded = param;
  try {
    decoded = decodeURIComponent(param);
  } catch {}
  const p = decoded.trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
  if (p === 'all' || p === 'all works') return 'ALL';
  if (p === 'rangoli' || p === 'rangoli art' || p === 'floor art' || p === 'cm yogi') return 'Rangoli';
  if (p === 'scrap' || p === 'scrap art' || p === 'scrap craft' || p === 'sculpture' || p === 'sculptures') return 'Scrap Craft';
  if (p === 'foam' || p === 'foam art' || p === 'thermocol' || p === '3d foam') return 'Foam Art';
  if (p === 'wall' || p === 'wall art' || p === 'mural' || p === 'murals') return 'Wall Art';
  if (p === 'set' || p === 'set design' || p === 'stage' || p === 'stage design' || p === 'theatrical') return 'Set Design';
  if (
    p === 'paintings' ||
    p === 'painting' ||
    p === 'sketches' ||
    p === 'sketch' ||
    p === 'paintings & sketches' ||
    p === 'paintings and sketches' ||
    p === 'sketches & paintings' ||
    p === 'sketches and paintings' ||
    p === 'portraits' ||
    p === 'fine art'
  ) return 'Paintings & Sketches';
  if (p === 'process' || p === 'work process' || p === 'progress' || p === 'starting to finished') return 'PROCESS';
  return null;
}

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

const PAGE_SIZE = 24;

export const GalleryFilter: React.FC<Props> = ({ initialArtworks }) => {
  const [artworksList, setArtworksList] = useState<Artwork[]>(() => mergeArtworks(initialArtworks));

  useEffect(() => {
    setArtworksList(mergeArtworks(initialArtworks));
    const handleUpdate = () => {
      setArtworksList(mergeArtworks(initialArtworks));
    };
    window.addEventListener('dhirendra_cms_updated', handleUpdate);
    return () => window.removeEventListener('dhirendra_cms_updated', handleUpdate);
  }, [initialArtworks]);

  // Active filters initialized from URL query params if present
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mapped = parseCategoryFromQuery(params.get('category'));
      if (mapped) return mapped;
    }
    return 'ALL';
  });

  // Sync with URL query parameter changes
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const mapped = parseCategoryFromQuery(params.get('category'));
      if (mapped) {
        setSelectedCategory(mapped);
        setSelectedSubcategory('ALL');
        setVisibleCount(PAGE_SIZE);
      } else if (!params.get('category')) {
        setSelectedCategory('ALL');
        setSelectedSubcategory('ALL');
        setVisibleCount(PAGE_SIZE);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);

    const handleCategoryLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href) {
        try {
          const url = new URL(target.href, window.location.origin);
          if (url.pathname === '/gallery') {
            const mapped = parseCategoryFromQuery(url.searchParams.get('category'));
            setSelectedCategory(mapped || 'ALL');
            setSelectedSubcategory('ALL');
            setVisibleCount(PAGE_SIZE);
          }
        } catch {}
      }
    };
    document.addEventListener('click', handleCategoryLinkClick);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      document.removeEventListener('click', handleCategoryLinkClick);
    };
  }, []);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('ALL');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'FEATURED' | 'NEWEST' | 'OLDEST' | 'TITLE'>('FEATURED');
  const [gridColumns, setGridColumns] = useState<'3_COL' | '4_COL'>('3_COL');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Normalize path helper for reliable matching
  const normalizePath = (p: string) => {
    try {
      return decodeURIComponent(p).replace(/^\//, '').replace(/\\/g, '/').toLowerCase();
    } catch {
      return p.replace(/^\//, '').replace(/\\/g, '/').toLowerCase();
    }
  };

  // Build unified creative works (excluding standalone news & certificates, which have moved to /awards)
  const allUnifiedItems = useMemo<UnifiedGalleryItem[]>(() => {
    // Map artworks by normalized primary image path
    const artworkByPath = new Map<string, Artwork>();
    for (const art of artworksList) {
      for (const img of art.images) {
        if (img.storage_path) {
          artworkByPath.set(normalizePath(img.storage_path), art);
        }
      }
    }

    const matchedArtworkIds = new Set<string>();

    // Only include creative artistic works (Paintings, Wall Art, Rangoli, Scrap Craft, Foam Art, etc.)
    // Explicitly exclude standalone news, awards certificates, and personal profile photos (e.g. Dhirendra.jpeg)
    const creativeMedia = UNIQUE_MEDIA.filter(
      (item) =>
        item.category !== 'Awards & Recognition' &&
        item.category !== 'Press & Media' &&
        item.category !== 'Profile' &&
        item.id !== 'profile-001' &&
        !item.src.toLowerCase().includes('dhirendra.jpeg') &&
        !item.rawSrc.toLowerCase().includes('dhirendra.jpeg')
    );

    const manifestItems: UnifiedGalleryItem[] = creativeMedia.map((item) => {
      const normRaw = normalizePath(item.rawSrc);
      const normSrc = normalizePath(item.src);
      const matched = artworkByPath.get(normRaw) || artworkByPath.get(normSrc);

      if (matched) {
        matchedArtworkIds.add(matched.id);
        return {
          id: matched.id,
          title: matched.title,
          src: item.src,
          rawSrc: item.rawSrc,
          alt: matched.title,
          category: item.category,
          subcategory: item.subcategory,
          description: matched.description || item.description,
          year: matched.year || item.year,
          featured: matched.featured || item.featured,
          tags: item.tags,
          isArtwork: true,
          artworkSlug: matched.slug,
          medium: matched.medium,
          width: matched.width,
          height: matched.height,
          signature: matched.signature,
          processStage: item.processStage || null,
          processGroup: item.processGroup || null,
          processGroupName: item.processGroupName || null,
          stageLabel: item.stageLabel || null,
          filename: item.filename,
        };
      }

      return {
        id: item.id,
        title: item.title,
        src: item.src,
        rawSrc: item.rawSrc,
        alt: item.alt,
        category: item.category,
        subcategory: item.subcategory,
        description: item.description,
        year: item.year,
        featured: item.featured,
        tags: item.tags,
        isArtwork: false,
        processStage: item.processStage || null,
        processGroup: item.processGroup || null,
        processGroupName: item.processGroupName || null,
        stageLabel: item.stageLabel || null,
        filename: item.filename,
      };
    });

    // Append any custom CMS artworks that weren't in UNIQUE_MEDIA
    const unmatchedArtworks: UnifiedGalleryItem[] = artworksList
      .filter((art) => !matchedArtworkIds.has(art.id))
      .map((art) => {
        const prim = art.images.find((img) => img.is_primary) || art.images[0];
        return {
          id: art.id,
          title: art.title,
          src: prim?.storage_path || '',
          rawSrc: prim?.storage_path || '',
          alt: prim?.alt_text || art.title,
          category: art.category,
          subcategory: 'Fine Art Works',
          description: art.description,
          year: art.year,
          featured: art.featured,
          tags: ['artwork', art.category.toLowerCase()],
          isArtwork: true,
          artworkSlug: art.slug,
          medium: art.medium,
          width: art.width,
          height: art.height,
          signature: art.signature,
          filename: prim?.storage_path ? prim.storage_path.split('/').pop() : art.title,
        };
      });

    return [...unmatchedArtworks, ...manifestItems];
  }, [artworksList]);

  // Extract Process Groups (Arranging Starting Work -> In Progress -> Finished Work together)
  const processGroups = useMemo<ProcessGroupData[]>(() => {
    const groupMap = new Map<string, ProcessGroupData>();

    for (const item of allUnifiedItems) {
      if (item.processGroup) {
        if (!groupMap.has(item.processGroup)) {
          groupMap.set(item.processGroup, {
            groupId: item.processGroup,
            groupName: item.processGroupName || 'Creative Process Series',
            category: item.category,
            year: item.year,
            description: item.description,
            starting: [],
            inProgress: [],
            finished: [],
          });
        }
        const g = groupMap.get(item.processGroup)!;
        if (item.processStage === 'STARTING') g.starting.push(item);
        else if (item.processStage === 'IN_PROGRESS') g.inProgress.push(item);
        else if (item.processStage === 'FINISHED') g.finished.push(item);
      }
    }

    return Array.from(groupMap.values()).filter(
      (g) => g.starting.length > 0 && g.finished.length > 0
    );
  }, [allUnifiedItems]);

  // Dynamic category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: allUnifiedItems.length,
      PROCESS: processGroups.length,
    };
    for (const item of allUnifiedItems) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [allUnifiedItems, processGroups]);

  // Extract unique subcategories for selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'PROCESS') return [];
    const subs = new Set<string>();
    for (const item of allUnifiedItems) {
      if (selectedCategory === 'ALL' || item.category === selectedCategory) {
        if (item.subcategory) subs.add(item.subcategory);
      }
    }
    return Array.from(subs).sort();
  }, [allUnifiedItems, selectedCategory]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('ALL');
    setVisibleCount(PAGE_SIZE);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (cat === 'ALL') {
        url.searchParams.delete('category');
      } else if (cat === 'Scrap Craft') {
        url.searchParams.set('category', 'Scrap Art');
      } else {
        url.searchParams.set('category', cat);
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleSubcategoryChange = (sub: string) => {
    setSelectedSubcategory(sub);
    setVisibleCount(PAGE_SIZE);
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = allUnifiedItems;

    // Category filter
    if (selectedCategory !== 'ALL' && selectedCategory !== 'PROCESS') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory !== 'ALL') {
      result = result.filter((item) => item.subcategory === selectedSubcategory);
    }

    // Featured only toggle
    if (onlyFeatured) {
      result = result.filter((item) => item.featured || item.signature);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.subcategory.toLowerCase().includes(q) ||
          item.year.toString().includes(q) ||
          (item.processGroupName && item.processGroupName.toLowerCase().includes(q)) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          (item.medium && item.medium.toLowerCase().includes(q))
      );
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'FEATURED') {
        if (a.signature && !b.signature) return -1;
        if (!a.signature && b.signature) return 1;
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.isArtwork && !b.isArtwork) return -1;
        if (!a.isArtwork && b.isArtwork) return 1;
        return b.year - a.year;
      }
      if (sortBy === 'NEWEST') return b.year - a.year;
      if (sortBy === 'OLDEST') return a.year - b.year;
      if (sortBy === 'TITLE') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [allUnifiedItems, selectedCategory, selectedSubcategory, onlyFeatured, searchQuery, sortBy]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null
        );
      }
    },
    [lightboxIndex, filteredItems.length]
  );

  useEffect(() => {
    if (lightboxIndex !== null) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [lightboxIndex, handleKeyDown]);

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="w-full space-y-8">
      {/* 1. Clean Page Header */}
      <div className="pb-4 border-b border-[#E8E5DC] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#141311] font-medium tracking-tight">
            The Works Gallery
          </h1>
        </div>

        {/* Symmetrical Grid Column Switcher */}
        {selectedCategory !== 'PROCESS' && (
          <div className="hidden sm:flex items-center border border-[#D3CEBF] rounded-sm p-0.5 bg-[#FAF5E9]">
            <button
              type="button"
              onClick={() => setGridColumns('3_COL')}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 ${
                gridColumns === '3_COL' ? 'bg-[#141311] text-[#FBFBF9]' : 'text-[#6B6864]'
              }`}
              title="Symmetrical 3-Column Grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>3 Columns</span>
            </button>
            <button
              type="button"
              onClick={() => setGridColumns('4_COL')}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 ${
                gridColumns === '4_COL' ? 'bg-[#141311] text-[#FBFBF9]' : 'text-[#6B6864]'
              }`}
              title="Symmetrical 4-Column Compact Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>4 Columns</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Primary Category Tabs */}
      <div className="border-b border-[#E8E5DC] pb-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORY_TABS.map((tab) => {
            const count = categoryCounts[tab.value] || 0;
            const active = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleCategoryChange(tab.value)}
                className={`px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all duration-200 flex items-center gap-2 ${
                  active
                    ? 'bg-[#141311] text-[#FBFBF9] shadow-sm'
                    : 'bg-white border border-[#E8E5DC] text-[#6B6864] hover:text-[#141311] hover:border-[#141311]'
                }`}
              >
                {tab.value === 'PROCESS' && <Layers className="w-3.5 h-3.5 text-[#B68B35]" />}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? 'bg-white/20 text-[#FBFBF9]' : 'bg-[#F0ECE3] text-[#57544E]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Active Count Indicator & Reset */}
      {selectedCategory !== 'PROCESS' && (
        <div className="flex items-center justify-between text-xs text-[#8A857D] px-1">
          <span>
            Displaying <strong className="text-[#141311] font-semibold">{visibleItems.length}</strong> of{' '}
            <strong className="text-[#141311] font-semibold">{filteredItems.length}</strong> works
            {selectedCategory !== 'ALL' && (
              <span> in <span className="text-[#9B4722] font-medium">{selectedCategory}</span></span>
            )}
          </span>

          {selectedCategory !== 'ALL' && (
            <button
              onClick={() => handleCategoryChange('ALL')}
              className="text-[#9B4722] hover:text-[#7D3516] font-medium inline-flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" /> View All Works
            </button>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5A. WORK PROCESS VIEW (Starting to Finished Work Sequences) */}
      {/* ========================================================= */}
      {selectedCategory === 'PROCESS' ? (
        <div key="process-view" className="animate-fade-in space-y-16">


          <div className="space-y-12">
            {processGroups.map((group, groupIndex) => {
              const primaryStart = group.starting[0];
              const primaryFinish = group.finished[0];
              const midStage = group.inProgress[0];

              return (
                <article
                  key={group.groupId}
                  className="bg-white p-6 sm:p-8 rounded-sm border border-[#E8E5DC] shadow-sm hover:shadow-md hover:border-[#B68B35]/40 transition-all duration-300 space-y-6"
                >
                  {/* Group Header */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-[#E8E5DC] gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span className="px-2 py-0.5 bg-[#FAF5E9] text-[#9B4722] font-semibold uppercase tracking-wider text-[10px] rounded-xs border border-[#E8E5DC]">
                          {group.category}
                        </span>
                        <span className="text-[#8A857D]">&bull;</span>
                        <span className="text-[#8A857D] font-mono text-xs">Series {groupIndex + 1}</span>
                      </div>
                      <h3 className="font-serif-display text-2xl sm:text-3xl text-[#141311] font-medium">
                        {group.groupName}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-[#8A857D]">{group.year}</span>
                  </div>

                  {/* Symmetrical Arranged Process Progression (Starting -> Finished) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Stage 1: STARTING WORK */}
                    <div className="lg:col-span-6 bg-[#FBFBF9] p-4 rounded-sm border border-[#E8E5DC] flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-[#141311] text-[#FBFBF9] text-[10px] uppercase tracking-wider font-semibold rounded-xs">
                            Stage 1: Starting of the Work
                          </span>
                          <span className="text-[11px] text-[#8A857D] font-mono">
                            Initial Foundation
                          </span>
                        </div>
                        <p className="text-xs text-[#57544E] font-medium">
                          {primaryStart.stageLabel || 'Initial surface preparation, structural armature & layout'}
                        </p>
                      </div>

                      {/* Symmetrical Image Frame */}
                      <div
                        onClick={() => {
                          const idx = filteredItems.findIndex((i) => i.id === primaryStart.id);
                          if (idx !== -1) setLightboxIndex(idx);
                        }}
                        className="relative w-full aspect-[4/3] bg-[#E8E5DC] rounded-sm overflow-hidden cursor-zoom-in group/start"
                      >
                        <img
                          src={getThumbnailUrl(primaryStart.src)}
                          alt={`Starting work for ${group.groupName}`}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover/start:scale-105"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const fallback = cleanImageUrl(primaryStart.src);
                            if (e.currentTarget.src !== fallback && e.currentTarget.src !== primaryStart.rawSrc) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-[#141311]/0 group-hover/start:bg-[#141311]/15 transition-colors" />
                        <span className="absolute bottom-2 right-2 p-1.5 bg-black/70 text-white rounded-xs opacity-0 group-hover/start:opacity-100 transition-opacity">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div className="pt-2 text-[11px] text-[#8A857D] flex items-center justify-between border-t border-[#E8E5DC]">
                        <span className="truncate max-w-[200px]" title={primaryStart.filename || primaryStart.title}>Photo: {primaryStart.filename || primaryStart.title}</span>
                        <span className="font-medium text-[#141311]">Stage: Beginning</span>
                      </div>
                    </div>

                    {/* Stage 2: FINISHED WORK */}
                    <div className="lg:col-span-6 bg-[#FAF5E9]/60 p-4 rounded-sm border border-[#B68B35]/40 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-[#B68B35] text-[#141311] text-[10px] uppercase tracking-wider font-bold rounded-xs">
                            Stage 2: Finished Masterpiece
                          </span>
                          <span className="text-[11px] text-[#9B4722] font-semibold uppercase tracking-wider">
                            Completed Work
                          </span>
                        </div>
                        <p className="text-xs text-[#57544E] font-medium">
                          {primaryFinish.stageLabel || 'Finished and completed public artwork'}
                        </p>
                      </div>

                      {/* Symmetrical Image Frame */}
                      <div
                        onClick={() => {
                          const idx = filteredItems.findIndex((i) => i.id === primaryFinish.id);
                          if (idx !== -1) setLightboxIndex(idx);
                        }}
                        className="relative w-full aspect-[4/3] bg-[#E8E5DC] rounded-sm overflow-hidden cursor-zoom-in group/finish"
                      >
                        <img
                          src={getThumbnailUrl(primaryFinish.src)}
                          alt={`Finished work for ${group.groupName}`}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover/finish:scale-105"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const fallback = cleanImageUrl(primaryFinish.src);
                            if (e.currentTarget.src !== fallback && e.currentTarget.src !== primaryFinish.rawSrc) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-[#141311]/0 group-hover/finish:bg-[#141311]/15 transition-colors" />
                        <span className="absolute bottom-2 right-2 p-1.5 bg-black/70 text-white rounded-xs opacity-0 group-hover/finish:opacity-100 transition-opacity">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div className="pt-2 text-[11px] text-[#8A857D] flex items-center justify-between border-t border-[#E8E5DC]">
                        <span className="truncate max-w-[200px]" title={primaryFinish.filename || primaryFinish.title}>Photo: {primaryFinish.filename || primaryFinish.title}</span>
                        <span className="font-semibold text-[#9B4722]">Status: Complete</span>
                      </div>
                    </div>

                  </div>

                  {/* Mid-Stage Progression Thumbnails (if available in this project) */}
                  {group.inProgress.length > 0 && (
                    <div className="pt-4 border-t border-[#F0ECE3] space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A857D] block">
                        Intermediate Layering &amp; On-Site Construction Stages ({group.inProgress.length} recorded):
                      </span>
                      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                        {group.inProgress.slice(0, 6).map((mid) => (
                          <div
                            key={mid.id}
                            onClick={() => {
                              const idx = filteredItems.findIndex((i) => i.id === mid.id);
                              if (idx !== -1) setLightboxIndex(idx);
                            }}
                            className="cursor-pointer shrink-0 w-28 aspect-video bg-[#F0ECE3] rounded-xs overflow-hidden border border-[#E8E5DC] relative group/sub"
                            title={mid.stageLabel || mid.title}
                          >
                            <img
                              src={getThumbnailUrl(mid.src)}
                              alt={mid.title}
                              width={112}
                              height={63}
                              className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                const fallback = cleanImageUrl(mid.src);
                                if (e.currentTarget.src !== fallback && e.currentTarget.src !== mid.rawSrc) {
                                  e.currentTarget.src = fallback;
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-[#141311]/0 group-hover/sub:bg-[#141311]/20 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Curatorial Annotation */}
                  <div className="pt-2 text-xs text-[#57544E] leading-relaxed italic font-serif">
                    {group.description}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* 5B. SYMMETRICAL CARDS GALLERY GRID (Images & Work)        */
        /* ========================================================= */
        <div className="space-y-12">
          {filteredItems.length === 0 ? (
            <div className="py-24 text-center space-y-4 bg-white border border-[#E8E5DC] rounded-sm p-8">
              <p className="font-serif-display text-2xl text-[#6B6864]">
                No original artworks match your current search query.
              </p>
              <p className="text-xs text-[#8A857D] max-w-md mx-auto">
                Try resetting your search query or choosing another discipline to view Dhirendra's complete creative portfolio.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedSubcategory('ALL');
                  setOnlyFeatured(false);
                  setSearchQuery('');
                  setVisibleCount(PAGE_SIZE);
                }}
                className="px-6 py-2.5 border border-[#141311] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#141311] hover:text-[#FBFBF9] transition-all"
              >
                Reset &amp; Show All Works
              </button>
            </div>
          ) : (
            <div
              key={`${selectedCategory}-${selectedSubcategory}-${sortBy}-${gridColumns}`}
              className={`animate-fade-in grid gap-6 sm:gap-8 items-stretch ${
                gridColumns === '3_COL'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              }`}
            >
              {visibleItems.map((item, idx) => (
                <article
                  key={item.id}
                  className="bg-white border border-[#E8E5DC] rounded-sm overflow-hidden flex flex-col hover:border-[#B68B35]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Uniform Symmetrical Image Container with aspect-[4/3] */}
                  <div className="relative w-full aspect-[4/3] bg-[#F0ECE3] overflow-hidden group/img">
                    {item.isArtwork && item.artworkSlug ? (
                      <a
                        href={`/gallery/${item.artworkSlug}`}
                        className="block w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9B4722]"
                        aria-label={`View dossier for ${item.title}`}
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
                            if (e.currentTarget.src !== fallback && e.currentTarget.src !== item.rawSrc) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-[#141311]/0 group-hover/img:bg-[#141311]/15 transition-colors duration-300" />
                      </a>
                    ) : (
                      <div
                        onClick={() => setLightboxIndex(idx)}
                        className="block w-full h-full cursor-zoom-in focus:outline-none"
                        role="button"
                        tabIndex={0}
                        aria-label={`Zoom view for ${item.title}`}
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
                            if (e.currentTarget.src !== fallback && e.currentTarget.src !== item.rawSrc) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-[#141311]/0 group-hover/img:bg-[#141311]/15 transition-colors duration-300" />
                      </div>
                    )}

                    {/* Zoom Trigger Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLightboxIndex(idx);
                      }}
                      className="absolute top-3 right-3 z-20 p-2 bg-[#FBFBF9]/90 hover:bg-white text-[#141311] rounded-sm shadow-md transition-all hover:scale-110 opacity-90 hover:opacity-100"
                      title="Inspect High-Resolution"
                      aria-label={`Zoom high resolution for ${item.title}`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Symmetrical Status & Discipline Badges on Top Left */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none z-10">
                      {item.signature && (
                        <span className="px-2 py-0.5 text-[10px] tracking-[0.16em] uppercase font-semibold bg-[#141311] text-[#FBFBF9] rounded-xs shadow-sm flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#B68B35]" />
                          Signature
                        </span>
                      )}

                      {item.featured && !item.signature && (
                        <span className="px-2 py-0.5 text-[10px] tracking-[0.14em] uppercase font-medium bg-[#B68B35] text-white rounded-xs shadow-sm">
                          Featured
                        </span>
                      )}

                      {item.processStage === 'STARTING' && (
                        <span className="px-2 py-0.5 text-[10px] tracking-[0.12em] uppercase font-semibold bg-[#141311]/85 text-white rounded-xs backdrop-blur-xs flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5 text-[#B68B35]" />
                          Starting Work
                        </span>
                      )}

                      {item.processStage === 'FINISHED' && (
                        <span className="px-2 py-0.5 text-[10px] tracking-[0.12em] uppercase font-semibold bg-green-950/85 text-green-100 rounded-xs backdrop-blur-xs flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-green-400" />
                          Finished Work
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Symmetrical Card Body (Uniform Padding & Heights) */}
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#9B4722] uppercase tracking-wider text-[11px] font-semibold">
                          {item.category}
                        </span>
                        <span className="font-mono text-[#8A857D] text-xs shrink-0">
                          {item.year}
                        </span>
                      </div>

                      <h3 className="font-serif-display text-xl sm:text-2xl text-[#141311] font-medium leading-tight group-hover:text-[#9B4722] transition-colors">
                        {item.isArtwork && item.artworkSlug ? (
                          <a href={`/gallery/${item.artworkSlug}`}>{item.title}</a>
                        ) : (
                          <button
                            onClick={() => setLightboxIndex(idx)}
                            className="text-left hover:underline"
                          >
                            {item.title}
                          </button>
                        )}
                      </h3>

                      {item.medium && (
                        <p className="text-xs text-[#57544E] italic font-serif">
                          {item.medium}
                        </p>
                      )}

                      <p className="text-xs text-[#6B6864] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Symmetrical Card Footer with Action Buttons (NO PRICING) */}
                    <div className="pt-3 border-t border-[#F0ECE3] flex items-center justify-between text-xs mt-auto">
                      <span className="text-[#8A857D] font-mono text-[11px]">
                        {item.width && item.height
                          ? `${item.width} × ${item.height}`
                          : item.subcategory || 'Studio Original'}
                      </span>

                      <div className="flex items-center gap-2">
                        {item.processGroup ? (
                          <button
                            type="button"
                            onClick={() => setSelectedCategory('PROCESS')}
                            className="text-[11px] uppercase tracking-wider text-[#B68B35] hover:text-[#9B4722] font-semibold inline-flex items-center gap-1"
                          >
                            <Layers className="w-3 h-3" />
                            Process &rarr;
                          </button>
                        ) : item.isArtwork && item.artworkSlug ? (
                          <a
                            href={`/gallery/${item.artworkSlug}`}
                            className="text-[11px] uppercase tracking-wider text-[#9B4722] hover:text-[#7D3516] font-semibold underline underline-offset-4"
                          >
                            View Dossier &rarr;
                          </a>
                        ) : (
                          <a
                            href={`/contact?subject=${encodeURIComponent('Inquiry regarding artwork: ' + item.title)}`}
                            className="text-[11px] uppercase tracking-wider text-[#9B4722] hover:text-[#7D3516] font-semibold inline-flex items-center gap-1 hover:underline"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Inquire
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More Pagination */}
          {visibleCount < filteredItems.length && (
            <div className="text-center pt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-8 py-4 bg-[#141311] hover:bg-[#2C2A26] text-[#FBFBF9] text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm"
              >
                Load More Original Works ({filteredItems.length - visibleCount} Remaining) &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. LIGHTBOX MODAL (High-Resolution Inspection)           */}
      {/* ========================================================= */}
      {activeLightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.title}
          className="fixed inset-0 z-50 bg-[#141311]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Close high-resolution viewer"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-[#1C1B18] rounded-sm border border-[#33312E] overflow-hidden shadow-2xl"
          >
            {/* Modal Image Display */}
            <div className="relative flex-grow flex items-center justify-center bg-black/60 p-2 sm:p-4 overflow-hidden min-h-[50vh] max-h-[72vh]">
              <img
                src={getWebpUrl(activeLightboxItem.src)}
                alt={activeLightboxItem.alt}
                className="max-h-[70vh] w-auto max-w-full object-contain mx-auto shadow-lg"
                onError={(e) => {
                  const fallback = cleanImageUrl(activeLightboxItem.src);
                  if (e.currentTarget.src !== fallback && e.currentTarget.src !== activeLightboxItem.rawSrc) {
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
                    {activeLightboxItem.category}
                  </span>
                  <span className="text-[#8A857D]">&bull;</span>
                  <span className="text-xs text-[#A8A291]">{activeLightboxItem.subcategory}</span>
                  <span className="text-[#8A857D]">&bull;</span>
                  <span className="font-mono text-xs text-[#8A857D]">{activeLightboxItem.year}</span>
                </div>
                <h3 className="font-serif-display text-xl sm:text-2xl text-[#FBFBF9] font-medium">
                  {activeLightboxItem.title}
                </h3>
                {activeLightboxItem.medium && (
                  <p className="text-xs text-[#B68B35] italic font-serif">
                    {activeLightboxItem.medium} {activeLightboxItem.width && `• ${activeLightboxItem.width} × ${activeLightboxItem.height}`}
                  </p>
                )}
                <p className="text-xs text-[#A8A291] leading-relaxed">
                  {activeLightboxItem.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {activeLightboxItem.isArtwork && activeLightboxItem.artworkSlug ? (
                  <a
                    href={`/gallery/${activeLightboxItem.artworkSlug}`}
                    className="px-4 py-2 bg-[#9B4722] hover:bg-[#7D3516] text-[#FBFBF9] text-xs uppercase tracking-wider font-semibold transition-colors"
                  >
                    View Artwork Dossier
                  </a>
                ) : (
                  <a
                    href={`/contact?subject=${encodeURIComponent('Inquiry regarding work: ' + activeLightboxItem.title)}`}
                    className="px-4 py-2 bg-[#B68B35] hover:bg-[#A37B2B] text-[#141311] text-xs uppercase tracking-wider font-semibold transition-colors"
                  >
                    Inquire About Work
                  </a>
                )}
                <a
                  href={activeLightboxItem.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#444] hover:border-white text-xs uppercase tracking-wider text-[#FBFBF9] transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Full Resolution
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import type { Artwork, Project, Achievement, Bid, Order, Enquiry, Availability } from '../../types/database';
import {
  mergeArtworks,
  saveArtwork,
  deleteArtwork,
  mergeProjects,
  saveProject,
  deleteProject,
  mergeAchievements,
  saveAchievement,
  deleteAchievement,
  mergeOrders,
  mergeBids,
  mergeEnquiries,
  getSiteContent,
  saveSiteContent,
  type SiteContent,
  isStudioAdminLoggedIn,
  setStudioAdminLoggedIn
} from '../../lib/cmsStorage';
import { ArtworkModal } from './ArtworkModal';
import { ProjectModal } from './ProjectModal';
import { AchievementModal } from './AchievementModal';
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  CheckCircle,
  X,
  Palette,
  Briefcase,
  Award,
  Globe,
  Mail,
  LogOut,
  AlertTriangle,
  Upload,
  Check,
  Image as ImageIcon
} from 'lucide-react';

interface Props {
  initialArtworks: Artwork[];
  initialBids: Bid[];
  initialOrders: Order[];
  initialEnquiries: Enquiry[];
  initialProjects: Project[];
  initialAchievements: Achievement[];
  isSupabaseConnected?: boolean;
}

type SimpleTab = 'artworks' | 'achievements' | 'projects' | 'site_content' | 'messages';

export const AdminPortal: React.FC<Props> = ({
  initialArtworks,
  initialBids,
  initialOrders,
  initialEnquiries,
  initialProjects,
  initialAchievements = [],
}) => {
  // Session Authentication Enforcement (OWASP ASVS V4.1)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isStudioAdminLoggedIn());

  useEffect(() => {
    if (!isStudioAdminLoggedIn()) {
      window.location.href = '/admin/login';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Navigation: 5 clear, focused tabs
  const [activeTab, setActiveTab] = useState<SimpleTab>('artworks');

  // Datasets
  const [artworks, setArtworks] = useState<Artwork[]>(() => mergeArtworks(initialArtworks));
  const [projects, setProjects] = useState<Project[]>(() => mergeProjects(initialProjects));
  const [achievements, setAchievements] = useState<Achievement[]>(() => mergeAchievements(initialAchievements));
  const [bids, setBids] = useState<Bid[]>(() => mergeBids(initialBids));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => mergeEnquiries(initialEnquiries));
  const [orders] = useState<Order[]>(() => mergeOrders(initialOrders));

  // Site Pages & Photos State
  const [siteContent, setSiteContent] = useState<SiteContent>(() => getSiteContent());
  const [isSavingSiteContent, setIsSavingSiteContent] = useState(false);

  // Modal states
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  // Delete Confirmation
  const [deleteItem, setDeleteItem] = useState<{
    type: 'artwork' | 'project' | 'achievement';
    id: string;
    title: string;
  } | null>(null);

  // Simple Search & Filter for Artworks
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'SOLD'>('ALL');

  // Friendly Toast Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync across tabs & windows
  useEffect(() => {
    const handleUpdate = () => {
      setArtworks(mergeArtworks(initialArtworks));
      setProjects(mergeProjects(initialProjects));
      setAchievements(mergeAchievements(initialAchievements));
      setBids(mergeBids(initialBids));
      setEnquiries(mergeEnquiries(initialEnquiries));
      setSiteContent(getSiteContent());
    };
    window.addEventListener('dhirendra_cms_updated', handleUpdate);
    return () => window.removeEventListener('dhirendra_cms_updated', handleUpdate);
  }, [initialArtworks, initialProjects, initialAchievements, initialBids, initialEnquiries]);

  // ==================== CRUD OPERATIONS ====================

  // Save Artwork
  const handleSaveArtwork = async (art: Artwork) => {
    const isNew = !artworks.some((a) => a.id === art.id);
    saveArtwork(art);
    setArtworks(mergeArtworks(initialArtworks));
    showToast(isNew ? `"${art.title}" added to your gallery!` : `"${art.title}" updated!`);

    try {
      await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(art),
      });
    } catch (e) {}
  };

  // One-Click Toggle Availability (Available <-> Sold)
  const handleToggleAvailability = (art: Artwork) => {
    const newStatus: Availability = art.availability === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE';
    const updated = { ...art, availability: newStatus };
    saveArtwork(updated);
    setArtworks(mergeArtworks(initialArtworks));
    showToast(newStatus === 'AVAILABLE' ? `Marked "${art.title}" as Available!` : `Marked "${art.title}" as Sold!`);
  };

  // Save Project
  const handleSaveProject = (proj: Project) => {
    saveProject(proj);
    setProjects(mergeProjects(initialProjects));
    showToast(`Project "${proj.title}" saved!`);
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proj),
    }).catch(() => {});
  };

  // Save Achievement / Award
  const handleSaveAchievement = (ach: Achievement) => {
    saveAchievement(ach);
    setAchievements(mergeAchievements(initialAchievements));
    showToast(`Award "${ach.title}" saved!`);
    fetch('/api/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ach),
    }).catch(() => {});
  };

  // Delete Artwork / Project / Achievement
  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    const { type, id, title } = deleteItem;

    if (type === 'artwork') {
      deleteArtwork(id);
      setArtworks(mergeArtworks(initialArtworks));
      showToast(`Removed "${title}" from website.`);
      fetch(`/api/artworks?id=${id}`, { method: 'DELETE' }).catch(() => {});
    } else if (type === 'achievement') {
      deleteAchievement(id);
      setAchievements(mergeAchievements(initialAchievements));
      showToast(`Removed award "${title}".`);
    } else {
      deleteProject(id);
      setProjects(mergeProjects(initialProjects));
      showToast(`Removed project "${title}".`);
    }
    setDeleteItem(null);
  };

  // Save Site Pages & Photos
  const handleSaveSiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSiteContent(true);
    saveSiteContent(siteContent);
    setTimeout(() => {
      setIsSavingSiteContent(false);
      showToast('Website pages & photos updated successfully!');
    }, 250);
  };

  // Image Upload helper for Site Content
  const handleSiteImageUpload = (file: File, field: 'heroImage' | 'aboutPortraitImage' | 'featuredOfferImage') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSiteContent((prev) => ({ ...prev, [field]: e.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Sign out
  const handleSignOut = () => {
    setStudioAdminLoggedIn(false);
    window.location.href = '/admin/login';
  };

  // Filter artworks
  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'AVAILABLE' && art.availability === 'AVAILABLE') ||
        (statusFilter === 'SOLD' && art.availability === 'SOLD');

      return matchesSearch && matchesStatus;
    });
  }, [artworks, searchQuery, statusFilter]);

  const availableCount = artworks.filter((a) => a.availability === 'AVAILABLE').length;
  const soldCount = artworks.filter((a) => a.availability === 'SOLD').length;
  const totalMessagesCount = bids.length + enquiries.length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 border border-[#E8E5DC] rounded-sm shadow-sm">
          <div className="w-10 h-10 mx-auto bg-[#141311] text-[#FBFBF9] rounded-sm flex items-center justify-center font-serif text-xl font-bold">
            D
          </div>
          <h2 className="font-serif-display text-xl text-[#141311]">Verifying Curatorial Session...</h2>
          <p className="text-xs text-[#6B6864]">Restricted administrative area. Redirecting to studio login.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#141311] pb-16">
      
      {/* Friendly Top Navigation Header */}
      <header className="bg-white border-b border-[#E8E5DC] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo / Portal Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#141311] text-white rounded-md flex items-center justify-center font-serif text-xl font-bold">
                D
              </div>
              <div>
                <h1 className="font-serif-display text-xl sm:text-2xl font-bold text-[#141311] leading-tight">
                  Studio Website Manager
                </h1>
                <p className="text-xs text-[#6B6864] hidden sm:block">
                  Simple Content Management Portal for Dhirendra
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingArtwork(null);
                  setIsArtworkModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#9B4722] hover:bg-[#7D3516] text-white text-xs sm:text-sm font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Artwork</span>
              </button>

              <a
                href="/gallery"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#D3CEBF] hover:bg-[#F4F1EA] text-xs font-medium text-[#141311] rounded-md transition-colors"
                title="Open your website in a new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Website</span>
              </a>

              <button
                type="button"
                onClick={handleSignOut}
                title="Log out of CMS"
                className="p-2 text-[#8A857D] hover:text-[#141311] rounded-md hover:bg-[#F4F1EA]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Simple 5 Focused Tabs */}
          <div className="flex items-center gap-2 pt-1 pb-2 border-t border-[#F0ECE3] overflow-x-auto text-xs sm:text-sm font-medium no-scrollbar">
            
            {/* 1. Artworks Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('artworks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'artworks'
                  ? 'bg-[#141311] text-white'
                  : 'text-[#57544E] hover:bg-[#F4F1EA] hover:text-[#141311]'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Artworks</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-mono ${
                activeTab === 'artworks' ? 'bg-white/20 text-white' : 'bg-[#E8E5DC] text-[#57544E]'
              }`}>
                {artworks.length}
              </span>
            </button>

            {/* 2. Awards & Achievements Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'achievements'
                  ? 'bg-[#141311] text-white'
                  : 'text-[#57544E] hover:bg-[#F4F1EA] hover:text-[#141311]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Awards & Honors</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-mono ${
                activeTab === 'achievements' ? 'bg-white/20 text-white' : 'bg-[#E8E5DC] text-[#57544E]'
              }`}>
                {achievements.length}
              </span>
            </button>

            {/* 3. Design Projects Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'projects'
                  ? 'bg-[#141311] text-white'
                  : 'text-[#57544E] hover:bg-[#F4F1EA] hover:text-[#141311]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Design Projects</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-mono ${
                activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-[#E8E5DC] text-[#57544E]'
              }`}>
                {projects.length}
              </span>
            </button>

            {/* 4. Website Pages & Photos Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('site_content')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'site_content'
                  ? 'bg-[#141311] text-white'
                  : 'text-[#57544E] hover:bg-[#F4F1EA] hover:text-[#141311]'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Website Content & Photos</span>
            </button>

            {/* 5. Inquiries & Offers Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'messages'
                  ? 'bg-[#141311] text-white'
                  : 'text-[#57544E] hover:bg-[#F4F1EA] hover:text-[#141311]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Inquiries & Offers</span>
              {totalMessagesCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === 'messages' ? 'bg-[#B68B35] text-white' : 'bg-[#FAF5E9] text-[#9B4722]'
                }`}>
                  {totalMessagesCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">

        {/* ======================================================== */}
        {/* TAB 1: ARTWORKS (MAIN CRUD)                              */}
        {/* ======================================================== */}
        {activeTab === 'artworks' && (
          <div className="space-y-6">

            {/* Filter Bar */}
            <div className="bg-white border border-[#E8E5DC] rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#8A857D]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, medium..."
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#FBFBF9] border border-[#D3CEBF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-[#8A857D] hover:text-[#141311]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs text-[#8A857D] mr-1 hidden sm:inline">Show:</span>
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    statusFilter === 'ALL'
                      ? 'bg-[#141311] text-white'
                      : 'bg-[#F4F1EA] text-[#57544E] hover:bg-[#E8E5DC]'
                  }`}
                >
                  All ({artworks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('AVAILABLE')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    statusFilter === 'AVAILABLE'
                      ? 'bg-green-700 text-white'
                      : 'bg-[#F4F1EA] text-green-800 hover:bg-[#E8E5DC]'
                  }`}
                >
                  Available ({availableCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('SOLD')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    statusFilter === 'SOLD'
                      ? 'bg-gray-800 text-white'
                      : 'bg-[#F4F1EA] text-gray-700 hover:bg-[#E8E5DC]'
                  }`}
                >
                  Sold ({soldCount})
                </button>
              </div>
            </div>

            {/* Empty State */}
            {filteredArtworks.length === 0 && (
              <div className="text-center py-16 bg-white border border-[#E8E5DC] rounded-md p-6 space-y-3">
                <Palette className="w-10 h-10 mx-auto text-[#8A857D]" />
                <h3 className="font-serif-display text-xl text-[#141311]">No artworks found</h3>
                <p className="text-xs text-[#6B6864]">Click "+ Add Artwork" to add a new piece to your website.</p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingArtwork(null);
                    setIsArtworkModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#9B4722] text-white text-xs font-semibold rounded-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Artwork</span>
                </button>
              </div>
            )}

            {/* Artworks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArtworks.map((art) => (
                <div
                  key={art.id}
                  className="bg-white border border-[#E8E5DC] rounded-md overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-sm transition-shadow"
                >
                  <div className="relative aspect-[4/3] bg-[#E8E5DC] overflow-hidden">
                    <img
                      src={art.images[0]?.storage_path || '/photos/awards/certificates%20and%20awards/438304121_950748996557945_5294600570921436411_n.jpg'}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* 1-Click Status Switcher */}
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(art)}
                      title="Click to toggle Available or Sold"
                      className={`absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-transform hover:scale-105 shadow-sm ${
                        art.availability === 'AVAILABLE'
                          ? 'bg-green-700 hover:bg-green-800 text-white'
                          : 'bg-gray-800 hover:bg-black text-white'
                      }`}
                    >
                      {art.availability === 'AVAILABLE' ? '🟢 Available' : '⚪ Sold'}
                    </button>

                    <a
                      href={`/gallery/${art.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Preview on live website"
                      className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 hover:bg-black text-white rounded-md text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-4 space-y-2 flex-1">
                    <div className="flex items-center justify-between text-xs text-[#8A857D]">
                      <span className="font-medium text-[#9B4722]">{art.category}</span>
                      <span className="font-mono">{art.width} x {art.height}</span>
                    </div>

                    <h3 className="font-serif-display text-lg font-bold text-[#141311] leading-snug line-clamp-1">
                      {art.title}
                    </h3>

                    <p className="text-xs text-[#6B6864] italic truncate">
                      {art.medium}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-base font-serif font-bold text-[#141311]">
                        {art.price ? `₹${art.price.toLocaleString('en-IN')}` : 'Price on Request'}
                      </span>
                      {art.featured && (
                        <span className="text-[11px] font-medium text-[#B68B35] bg-[#FAF5E9] px-2 py-0.5 rounded-full">
                          ★ Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FBFBF9] border-t border-[#F0ECE3] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingArtwork(art);
                        setIsArtworkModalOpen(true);
                      }}
                      className="flex-1 py-2 bg-white hover:bg-[#FAF5E9] border border-[#D3CEBF] text-[#141311] text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#9B4722]" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteItem({ type: 'artwork', id: art.id, title: art.title })}
                      className="py-2 px-3 text-red-600 hover:bg-red-50 hover:text-red-800 text-xs font-medium rounded-md transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: AWARDS & ACHIEVEMENTS (MINIMAL CRUD)              */}
        {/* ======================================================== */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-[#E8E5DC] rounded-md p-4 sm:p-5 flex items-center justify-between shadow-xs">
              <div>
                <h3 className="font-serif-display text-xl font-bold text-[#141311]">
                  Awards, Honors & Exhibitions
                </h3>
                <p className="text-xs text-[#6B6864]">
                  Manage awards, Lalit Kala Akademi accolades, and government honors shown on your About page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingAchievement(null);
                  setIsAchievementModalOpen(true);
                }}
                className="px-4 py-2 bg-[#9B4722] hover:bg-[#7D3516] text-white text-xs sm:text-sm font-semibold rounded-md flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Award / Honor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {achievements.map((ach) => (
                <div key={ach.id} className="bg-white border border-[#E8E5DC] rounded-md overflow-hidden flex flex-col justify-between shadow-2xs">
                  {ach.image_path && (
                    <div className="aspect-[16/9] bg-[#E8E5DC] overflow-hidden">
                      <img src={ach.image_path} alt={ach.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-4 space-y-2 flex-1">
                    <div className="flex items-center justify-between text-xs text-[#8A857D]">
                      <span className="font-medium text-[#B68B35] bg-[#FAF5E9] px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                        {ach.category}
                      </span>
                      <span className="font-mono">{ach.year}</span>
                    </div>

                    <h4 className="font-serif-display text-base sm:text-lg font-bold text-[#141311] leading-snug">
                      {ach.title}
                    </h4>

                    <p className="text-xs font-semibold text-[#57544E]">
                      {ach.organization} {ach.location ? `• ${ach.location}` : ''}
                    </p>

                    <p className="text-xs text-[#6B6864] line-clamp-3 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  <div className="p-3 border-t border-[#F0ECE3] bg-[#FBFBF9] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAchievement(ach);
                        setIsAchievementModalOpen(true);
                      }}
                      className="text-xs font-semibold text-[#141311] hover:text-[#9B4722] flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteItem({ type: 'achievement', id: ach.id, title: ach.title })}
                      className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: DESIGN PROJECTS                                   */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-[#E8E5DC] rounded-md p-4 sm:p-5 flex items-center justify-between shadow-xs">
              <div>
                <h3 className="font-serif-display text-xl font-bold text-[#141311]">
                  Commercial & Graphic Design Works
                </h3>
                <p className="text-xs text-[#6B6864]">
                  Posters, client branding, and visual compositions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsProjectModalOpen(true);
                }}
                className="px-4 py-2 bg-[#141311] hover:bg-[#2C2A26] text-white text-xs sm:text-sm font-semibold rounded-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white border border-[#E8E5DC] rounded-md overflow-hidden flex flex-col justify-between shadow-2xs">
                  <div className="aspect-[16/9] bg-[#E8E5DC] overflow-hidden">
                    <img src={proj.images[0]?.storage_path} alt={proj.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-1.5 flex-1">
                    <span className="text-[11px] font-medium text-[#9B4722]">{proj.category}</span>
                    <h4 className="font-serif-display text-base font-bold text-[#141311] line-clamp-1">
                      {proj.title}
                    </h4>
                    {proj.client_or_org && (
                      <p className="text-xs text-[#8A857D] font-medium">{proj.client_or_org}</p>
                    )}
                    <p className="text-xs text-[#57544E] line-clamp-2">
                      {proj.description}
                    </p>
                  </div>
                  <div className="p-3 border-t border-[#F0ECE3] bg-[#FBFBF9] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(proj);
                        setIsProjectModalOpen(true);
                      }}
                      className="text-xs font-semibold text-[#141311] hover:text-[#9B4722] flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteItem({ type: 'project', id: proj.id, title: proj.title })}
                      className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: WEBSITE PAGES & PHOTOS                            */}
        {/* ======================================================== */}
        {activeTab === 'site_content' && (
          <form onSubmit={handleSaveSiteContent} className="space-y-8 max-w-4xl">
            
            <div className="bg-white border border-[#E8E5DC] rounded-md p-5 flex items-center justify-between shadow-xs">
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#141311]">
                  Website Pages & Photos Editor
                </h3>
                <p className="text-xs text-[#6B6864]">
                  Update your Homepage Hero banner and your About page biography & photo without touching any code.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSavingSiteContent}
                className="px-5 py-2.5 bg-[#9B4722] hover:bg-[#7D3516] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>{isSavingSiteContent ? 'Saving...' : 'Save All Changes'}</span>
              </button>
            </div>

            {/* 1. HOMEPAGE & HERO SECTION */}
            <div className="bg-white border border-[#E8E5DC] rounded-md p-6 space-y-5 shadow-2xs">
              <div className="border-b border-[#F0ECE3] pb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#9B4722] block">
                  Homepage Customization
                </span>
                <h4 className="font-serif-display text-xl font-bold text-[#141311]">
                  Hero Section & Main Artwork
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Hero Photo Changer */}
                <div className="md:col-span-5 space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311]">
                    Hero Artwork Photo
                  </label>
                  <div className="relative aspect-[4/5] bg-[#F4F1EA] rounded-md overflow-hidden border border-[#E8E5DC]">
                    <img
                      src={siteContent.heroImage}
                      alt="Hero Artwork"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <label className="flex-1 text-center py-2 bg-[#141311] hover:bg-[#2C2A26] text-white text-xs font-semibold rounded-md cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleSiteImageUpload(e.target.files[0], 'heroImage');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={siteContent.heroImage}
                    onChange={(e) => setSiteContent({ ...siteContent, heroImage: e.target.value })}
                    placeholder="Or paste image link"
                    className="w-full px-2.5 py-1 text-xs border border-[#D3CEBF] rounded-md focus:outline-none"
                  />
                </div>

                {/* Hero Texts */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                      Main Name / Headline
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroHeadline}
                      onChange={(e) => setSiteContent({ ...siteContent, heroHeadline: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-[#D3CEBF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                      Subtitle / Title
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroSubtitle}
                      onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-[#D3CEBF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                      Artist Tagline / Hero Statement
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroQuote}
                      onChange={(e) => setSiteContent({ ...siteContent, heroQuote: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-[#D3CEBF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                      Short Bio Overview
                    </label>
                    <textarea
                      rows={4}
                      value={siteContent.heroDescription}
                      onChange={(e) => setSiteContent({ ...siteContent, heroDescription: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#D3CEBF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* 2. ABOUT PAGE */}
            <div className="bg-white border border-[#E8E5DC] rounded-md p-6 space-y-5 shadow-2xs">
              <div className="border-b border-[#F0ECE3] pb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#9B4722] block">
                  About Page Customization
                </span>
                <h4 className="font-serif-display text-xl font-bold text-[#141311]">
                  Artist Portrait & Biography
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Artist Photo Changer */}
                <div className="md:col-span-5 space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311]">
                    Artist Portrait / Studio Photo
                  </label>
                  <div className="relative aspect-[4/5] bg-[#F4F1EA] rounded-md overflow-hidden border border-[#E8E5DC]">
                    <img
                      src={siteContent.aboutPortraitImage}
                      alt="Artist in Studio"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <label className="flex-1 text-center py-2 bg-[#141311] hover:bg-[#2C2A26] text-white text-xs font-semibold rounded-md cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Studio Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleSiteImageUpload(e.target.files[0], 'aboutPortraitImage');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={siteContent.aboutPortraitImage}
                    onChange={(e) => setSiteContent({ ...siteContent, aboutPortraitImage: e.target.value })}
                    placeholder="Or paste photo link"
                    className="w-full px-2.5 py-1 text-xs border border-[#D3CEBF] rounded-md focus:outline-none"
                  />
                </div>

                {/* About Page Texts */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                      Artistic Philosophy Quote
                    </label>
                    <textarea
                      rows={3}
                      value={siteContent.aboutQuote}
                      onChange={(e) => setSiteContent({ ...siteContent, aboutQuote: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#D3CEBF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9B4722] italic font-serif text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                      Artist Biography / Studio Journey
                    </label>
                    <textarea
                      rows={7}
                      value={siteContent.aboutBio}
                      onChange={(e) => setSiteContent({ ...siteContent, aboutBio: e.target.value })}
                      placeholder="Share your story, artistic education, and approach..."
                      className="w-full px-3 py-2 text-xs border border-[#D3CEBF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9B4722] leading-relaxed"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* 3. HOMEPAGE FEATURED OFFER SHOWCASE */}
            <div className="bg-white border border-[#E8E5DC] rounded-md p-6 space-y-5 shadow-2xs">
              <div className="border-b border-[#F0ECE3] pb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#B68B35] block">
                  Homepage Spotlight
                </span>
                <h4 className="font-serif-display text-xl font-bold text-[#141311]">
                  Featured Artwork Offer Showcase
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Featured Photo Changer */}
                <div className="md:col-span-5 space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311]">
                    Spotlight Artwork Photo
                  </label>
                  <div className="relative aspect-[4/3] bg-[#F4F1EA] rounded-md overflow-hidden border border-[#E8E5DC]">
                    <img
                      src={siteContent.featuredOfferImage || '/photos/Work/sketches%20&%20paintings/IMG_20221027_185129.jpg'}
                      alt="Featured Spotlight"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <label className="flex-1 text-center py-2 bg-[#141311] hover:bg-[#2C2A26] text-white text-xs font-semibold rounded-md cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleSiteImageUpload(e.target.files[0], 'featuredOfferImage');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={siteContent.featuredOfferImage || ''}
                    onChange={(e) => setSiteContent({ ...siteContent, featuredOfferImage: e.target.value })}
                    placeholder="Or paste image link"
                    className="w-full px-2.5 py-1 text-xs border border-[#D3CEBF] rounded-md focus:outline-none"
                  />
                </div>

                {/* Featured Showcase Texts */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                      Featured Artwork Title
                    </label>
                    <input
                      type="text"
                      value={siteContent.featuredOfferTitle || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, featuredOfferTitle: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-[#D3CEBF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                      Medium, Material & Year
                    </label>
                    <input
                      type="text"
                      value={siteContent.featuredOfferSubtitle || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, featuredOfferSubtitle: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-[#D3CEBF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#141311] mb-1">
                      Artwork Link / Page URL
                    </label>
                    <input
                      type="text"
                      value={siteContent.featuredOfferLink || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, featuredOfferLink: e.target.value })}
                      placeholder="/gallery/artwork-slug or full link"
                      className="w-full px-3 py-2 text-xs border border-[#D3CEBF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingSiteContent}
                className="px-8 py-3 bg-[#9B4722] hover:bg-[#7D3516] text-white text-xs uppercase tracking-wider font-semibold rounded-md transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isSavingSiteContent ? 'Saving Changes...' : 'Save & Update Website'}</span>
              </button>
            </div>

          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 5: BUYER INQUIRIES & OFFERS                          */}
        {/* ======================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">

            <div className="bg-white border border-[#E8E5DC] rounded-md p-4 sm:p-5 shadow-xs">
              <h3 className="font-serif-display text-xl font-bold text-[#141311]">
                Customer Inquiries & Price Offers
              </h3>
              <p className="text-xs text-[#6B6864]">
                Messages and purchase inquiries sent by website visitors.
              </p>
            </div>

            <div className="space-y-3">
              {bids.map((bid) => (
                <div key={bid.id} className="bg-white border border-[#E8E5DC] rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FAF5E9] text-[#B68B35] font-bold text-xs rounded-xs">
                        Price Offer
                      </span>
                      <span className="font-bold text-sm text-[#141311]">{bid.name}</span>
                      <span className="text-xs text-[#8A857D]">•</span>
                      <span className="font-serif font-bold text-[#9B4722]">
                        Offered: ₹{bid.offer_amount?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#57544E]">
                      Artwork: <strong className="text-[#141311]">{bid.artwork_title || bid.artwork_id}</strong>
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#8A857D]">
                      <span>Email: {bid.email}</span>
                      <span>Phone: {bid.phone}</span>
                    </div>

                    {bid.message && (
                      <p className="text-xs text-[#6B6864] italic pt-1">
                        "{bid.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={`mailto:${bid.email}?subject=Regarding your offer for ${bid.artwork_title || 'Artwork'}`}
                      className="px-3 py-1.5 bg-[#141311] hover:bg-[#2C2A26] text-white text-xs font-semibold rounded-md transition-colors"
                    >
                      Reply to Buyer
                    </a>
                  </div>
                </div>
              ))}

              {enquiries.map((enq) => (
                <div key={enq.id} className="bg-white border border-[#E8E5DC] rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-semibold text-xs rounded-xs">
                        Inquiry: {enq.type}
                      </span>
                      <span className="font-bold text-sm text-[#141311]">{enq.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#8A857D]">
                      <span>Email: {enq.email}</span>
                      <span>Phone: {enq.phone}</span>
                    </div>

                    <p className="text-xs text-[#57544E] pt-1">
                      "{enq.message}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={`mailto:${enq.email}?subject=Inquiry response - Dhirendra Art Studio`}
                      className="px-3 py-1.5 border border-[#D3CEBF] hover:bg-[#FAF5E9] text-[#141311] text-xs font-semibold rounded-md transition-colors"
                    >
                      Email Back
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* MODALS                                                   */}
      {/* ======================================================== */}
      <ArtworkModal
        isOpen={isArtworkModalOpen}
        onClose={() => setIsArtworkModalOpen(false)}
        onSave={handleSaveArtwork}
        artworkToEdit={editingArtwork}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        projectToEdit={editingProject}
      />

      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        onSave={handleSaveAchievement}
        achievementToEdit={editingAchievement}
      />

      {/* Delete Confirmation Popup */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E5DC] max-w-sm w-full rounded-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 text-red-600">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-serif-display text-lg font-bold text-[#141311]">
                Delete this item?
              </h3>
            </div>
            <p className="text-xs text-[#57544E] leading-relaxed">
              Are you sure you want to remove <strong className="text-[#141311]">"{deleteItem.title}"</strong> from your website?
            </p>
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                className="px-3.5 py-1.5 text-xs text-[#57544E] hover:text-[#141311] rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Friendly Bottom Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#141311] text-white border border-[#B68B35] px-4 py-3 rounded-md shadow-lg flex items-center gap-2.5 text-xs">
          <CheckCircle className="w-4 h-4 text-[#B68B35] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

import type { Artwork, Project, Achievement, Bid, Order, Enquiry, OrderStatus, BidStatus } from '../types/database';

const KEYS = {
  ARTWORKS: 'dhirendra_cms_artworks',
  PROJECTS: 'dhirendra_cms_projects',
  ACHIEVEMENTS: 'dhirendra_cms_achievements',
  BIDS: 'dhirendra_cms_bids',
  ORDERS: 'dhirendra_cms_orders',
  ENQUIRIES: 'dhirendra_cms_enquiries',
  AUTH: 'dhirendra_cms_auth',
  SITE_CONTENT: 'dhirendra_cms_site_content',
  DELETED_ARTWORKS: 'dhirendra_cms_deleted_artworks',
  DELETED_PROJECTS: 'dhirendra_cms_deleted_projects',
  DELETED_ACHIEVEMENTS: 'dhirendra_cms_deleted_achievements',
};

// Check if running in browser
const isBrowser = typeof window !== 'undefined';

function getStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key ${key}`, err);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('dhirendra_cms_updated', { detail: { key } }));
  } catch (err) {
    console.warn(`Error writing localStorage key ${key}`, err);
  }
}

// ==================== ARTWORKS ====================

export function getCustomArtworks(): Artwork[] {
  return getStorage<Artwork[]>(KEYS.ARTWORKS, []);
}

export function getDeletedArtworkIds(): string[] {
  return getStorage<string[]>(KEYS.DELETED_ARTWORKS, []);
}

export function mergeArtworks(initialArtworks: Artwork[]): Artwork[] {
  if (!isBrowser) return initialArtworks;
  const custom = getCustomArtworks();
  const deletedIds = new Set(getDeletedArtworkIds());

  // Filter out any initially passed artworks that were deleted
  const filteredInitial = initialArtworks.filter((art) => !deletedIds.has(art.id));

  // Map of initial artworks by id
  const artworkMap = new Map<string, Artwork>();
  for (const art of filteredInitial) {
    artworkMap.set(art.id, art);
  }

  // Overlay custom / edited artworks
  for (const art of custom) {
    if (!deletedIds.has(art.id)) {
      artworkMap.set(art.id, art);
    }
  }

  return Array.from(artworkMap.values());
}

export function saveArtwork(artwork: Artwork): Artwork {
  const current = getCustomArtworks();
  const index = current.findIndex((a) => a.id === artwork.id);

  let updated: Artwork[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...artwork, updated_at: new Date().toISOString() };
  } else {
    updated = [{ ...artwork, updated_at: new Date().toISOString() }, ...current];
  }

  setStorage(KEYS.ARTWORKS, updated);

  // If it was in deleted list, remove it from deleted list
  const deleted = getDeletedArtworkIds().filter((id) => id !== artwork.id);
  setStorage(KEYS.DELETED_ARTWORKS, deleted);

  return artwork;
}

export function deleteArtwork(id: string): void {
  // Remove from custom
  const current = getCustomArtworks().filter((a) => a.id !== id);
  setStorage(KEYS.ARTWORKS, current);

  // Add to deleted set so default artworks can also be removed
  const deleted = Array.from(new Set([...getDeletedArtworkIds(), id]));
  setStorage(KEYS.DELETED_ARTWORKS, deleted);
}

// ==================== PROJECTS ====================

export function getCustomProjects(): Project[] {
  return getStorage<Project[]>(KEYS.PROJECTS, []);
}

export function getDeletedProjectIds(): string[] {
  return getStorage<string[]>(KEYS.DELETED_PROJECTS, []);
}

export function mergeProjects(initialProjects: Project[]): Project[] {
  if (!isBrowser) return initialProjects;
  const custom = getCustomProjects();
  const deletedIds = new Set(getDeletedProjectIds());

  const filteredInitial = initialProjects.filter((p) => !deletedIds.has(p.id));
  const map = new Map<string, Project>();
  for (const p of filteredInitial) {
    map.set(p.id, p);
  }
  for (const p of custom) {
    if (!deletedIds.has(p.id)) {
      map.set(p.id, p);
    }
  }
  return Array.from(map.values());
}

export function saveProject(project: Project): Project {
  const current = getCustomProjects();
  const index = current.findIndex((p) => p.id === project.id);
  let updated: Project[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = project;
  } else {
    updated = [project, ...current];
  }
  setStorage(KEYS.PROJECTS, updated);

  const deleted = getDeletedProjectIds().filter((id) => id !== project.id);
  setStorage(KEYS.DELETED_PROJECTS, deleted);
  return project;
}

export function deleteProject(id: string): void {
  const current = getCustomProjects().filter((p) => p.id !== id);
  setStorage(KEYS.PROJECTS, current);
  const deleted = Array.from(new Set([...getDeletedProjectIds(), id]));
  setStorage(KEYS.DELETED_PROJECTS, deleted);
}

// ==================== ACHIEVEMENTS ====================

export function getCustomAchievements(): Achievement[] {
  return getStorage<Achievement[]>(KEYS.ACHIEVEMENTS, []);
}

export function getDeletedAchievementIds(): string[] {
  return getStorage<string[]>(KEYS.DELETED_ACHIEVEMENTS, []);
}

export function mergeAchievements(initial: Achievement[]): Achievement[] {
  if (!isBrowser) return initial;
  const custom = getCustomAchievements();
  const deletedIds = new Set(getDeletedAchievementIds());

  const filteredInitial = initial.filter((a) => !deletedIds.has(a.id));
  const map = new Map<string, Achievement>();
  for (const a of filteredInitial) {
    map.set(a.id, a);
  }
  for (const a of custom) {
    if (!deletedIds.has(a.id)) {
      map.set(a.id, a);
    }
  }
  return Array.from(map.values());
}

export function saveAchievement(achievement: Achievement): Achievement {
  const current = getCustomAchievements();
  const index = current.findIndex((a) => a.id === achievement.id);
  let updated: Achievement[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = achievement;
  } else {
    updated = [achievement, ...current];
  }
  setStorage(KEYS.ACHIEVEMENTS, updated);

  const deleted = getDeletedAchievementIds().filter((id) => id !== achievement.id);
  setStorage(KEYS.DELETED_ACHIEVEMENTS, deleted);
  return achievement;
}

export function deleteAchievement(id: string): void {
  const current = getCustomAchievements().filter((a) => a.id !== id);
  setStorage(KEYS.ACHIEVEMENTS, current);
  const deleted = Array.from(new Set([...getDeletedAchievementIds(), id]));
  setStorage(KEYS.DELETED_ACHIEVEMENTS, deleted);
}

// ==================== ORDERS ====================

export function mergeOrders(initial: Order[]): Order[] {
  if (!isBrowser) return initial;
  const custom = getStorage<Order[]>(KEYS.ORDERS, []);
  const map = new Map<string, Order>();
  for (const o of initial) {
    map.set(o.id, o);
  }
  for (const o of custom) {
    map.set(o.id, o);
  }
  return Array.from(map.values());
}

export function updateOrder(orderId: string, updates: Partial<Order>): Order | null {
  const custom = getStorage<Order[]>(KEYS.ORDERS, []);
  const index = custom.findIndex((o) => o.id === orderId);
  let targetOrder: Order;

  if (index >= 0) {
    targetOrder = { ...custom[index], ...updates, updated_at: new Date().toISOString() };
    custom[index] = targetOrder;
  } else {
    // Check if initial has it
    targetOrder = { id: orderId, ...updates } as Order;
    custom.push(targetOrder);
  }

  setStorage(KEYS.ORDERS, custom);
  return targetOrder;
}

// ==================== BIDS ====================

export function mergeBids(initial: Bid[]): Bid[] {
  if (!isBrowser) return initial;
  const custom = getStorage<Bid[]>(KEYS.BIDS, []);
  const map = new Map<string, Bid>();
  for (const b of initial) {
    map.set(b.id, b);
  }
  for (const b of custom) {
    map.set(b.id, b);
  }
  return Array.from(map.values());
}

export function updateBid(bidId: string, updates: Partial<Bid>): Bid | null {
  const custom = getStorage<Bid[]>(KEYS.BIDS, []);
  const index = custom.findIndex((b) => b.id === bidId);
  let targetBid: Bid;

  if (index >= 0) {
    targetBid = { ...custom[index], ...updates };
    custom[index] = targetBid;
  } else {
    targetBid = { id: bidId, ...updates } as Bid;
    custom.push(targetBid);
  }

  setStorage(KEYS.BIDS, custom);
  return targetBid;
}

// ==================== ENQUIRIES ====================

export function mergeEnquiries(initial: Enquiry[]): Enquiry[] {
  if (!isBrowser) return initial;
  const custom = getStorage<Enquiry[]>(KEYS.ENQUIRIES, []);
  const map = new Map<string, Enquiry>();
  for (const e of initial) {
    map.set(e.id, e);
  }
  for (const e of custom) {
    map.set(e.id, e);
  }
  return Array.from(map.values());
}

export function updateEnquiryStatus(enquiryId: string, status: 'NEW' | 'CONTACTED' | 'RESOLVED'): void {
  const custom = getStorage<Enquiry[]>(KEYS.ENQUIRIES, []);
  const index = custom.findIndex((e) => e.id === enquiryId);
  if (index >= 0) {
    custom[index] = { ...custom[index], status };
  } else {
    custom.push({ id: enquiryId, status } as Enquiry);
  }
  setStorage(KEYS.ENQUIRIES, custom);
}

// ==================== BACKUP & RESTORE ====================

export function exportCatalogueBackup(): string {
  const backup = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    artworks: getCustomArtworks(),
    deletedArtworkIds: getDeletedArtworkIds(),
    projects: getCustomProjects(),
    achievements: getCustomAchievements(),
    orders: getStorage(KEYS.ORDERS, []),
    bids: getStorage(KEYS.BIDS, []),
    enquiries: getStorage(KEYS.ENQUIRIES, []),
    siteContent: getSiteContent()
  };
  return JSON.stringify(backup, null, 2);
}

export function importCatalogueBackup(jsonString: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data.artworks)) {
      setStorage(KEYS.ARTWORKS, data.artworks);
    }
    if (Array.isArray(data.deletedArtworkIds)) {
      setStorage(KEYS.DELETED_ARTWORKS, data.deletedArtworkIds);
    }
    if (Array.isArray(data.projects)) {
      setStorage(KEYS.PROJECTS, data.projects);
    }
    if (Array.isArray(data.achievements)) {
      setStorage(KEYS.ACHIEVEMENTS, data.achievements);
    }
    if (Array.isArray(data.orders)) {
      setStorage(KEYS.ORDERS, data.orders);
    }
    if (Array.isArray(data.bids)) {
      setStorage(KEYS.BIDS, data.bids);
    }
    if (Array.isArray(data.enquiries)) {
      setStorage(KEYS.ENQUIRIES, data.enquiries);
    }
    if (data.siteContent) {
      setStorage(KEYS.SITE_CONTENT, data.siteContent);
    }
    window.dispatchEvent(new CustomEvent('dhirendra_cms_updated', { detail: { fullReload: true } }));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Invalid backup file format' };
  }
}

export function resetAllCatalogueData(): void {
  if (!isBrowser) return;
  Object.values(KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
  window.dispatchEvent(new CustomEvent('dhirendra_cms_updated', { detail: { fullReload: true } }));
}

// ==================== AUTH & SESSION MANAGEMENT (OWASP ASVS V3) ====================

const SESSION_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours maximum session lifetime

export function isStudioAdminLoggedIn(): boolean {
  if (!isBrowser) return false;
  try {
    const sessionRaw = localStorage.getItem(KEYS.AUTH);
    if (!sessionRaw) return false;

    // Structured JSON session verification
    const session = JSON.parse(sessionRaw);
    if (!session || !session.authenticated || !session.expiresAt) {
      localStorage.removeItem(KEYS.AUTH);
      return false;
    }

    if (Date.now() > Number(session.expiresAt)) {
      localStorage.removeItem(KEYS.AUTH);
      return false;
    }

    return true;
  } catch {
    // Malformed session data - reject and clear
    localStorage.removeItem(KEYS.AUTH);
    return false;
  }
}

export function setStudioAdminLoggedIn(val: boolean): void {
  if (!isBrowser) return;
  if (val) {
    const session = {
      authenticated: true,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_EXPIRY_MS,
    };
    localStorage.setItem(KEYS.AUTH, JSON.stringify(session));
  } else {
    localStorage.removeItem(KEYS.AUTH);
  }
}

// ==================== SITE PAGES & IMAGES CONTENT ====================

export interface SiteContent {
  heroHeadline: string;
  heroSubtitle: string;
  heroQuote: string;
  heroDescription: string;
  heroImage: string;
  aboutQuote: string;
  aboutBio: string;
  aboutPortraitImage: string;
  featuredOfferTitle: string;
  featuredOfferSubtitle: string;
  featuredOfferImage: string;
  featuredOfferLink: string;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroHeadline: 'Dhirendra',
  heroSubtitle: 'Artist & Graphics Designer',
  heroQuote: 'Creating art that connects observation, imagination, and expression.',
  heroDescription: 'An accomplished artist with an academic background in BVA and MVA (Department of Fine Arts, University of Lucknow), more than seven years of dedicated studio practice, and honors across national, state, and civic platforms.',
  heroImage: '/photos/awards/certificates%20and%20awards/438304121_950748996557945_5294600570921436411_n.jpg',
  aboutQuote: '"Art is not an ornament on the surface of reality; it is an investigation into the silence beneath everyday observation."',
  aboutBio: 'Dhirendra Pratap is an accomplished Indian visual artist and graphic designer whose practice spans over seven years of rigorous studio investigation. With an academic foundation in the Department of Fine Arts, University of Lucknow (MVA), his practice bridges fine art painting, observational drawing, public wall murals, rangoli floor art, and monumental scrap craft.',
  aboutPortraitImage: '/photos/Dhirendra.jpeg',
  featuredOfferTitle: 'Contemplative Portrait Study in Graphite',
  featuredOfferSubtitle: 'Graphite on Archival Drawing Paper • 2022',
  featuredOfferImage: '/photos/Work/sketches%20&%20paintings/IMG_20221027_185129.jpg',
  featuredOfferLink: '/gallery/contemplative-portrait-study',
};

export function hasCustomSiteContent(): boolean {
  if (!isBrowser) return false;
  try {
    return Boolean(localStorage.getItem(KEYS.SITE_CONTENT));
  } catch {
    return false;
  }
}

export function getSiteContent(): SiteContent {
  return getStorage<SiteContent>(KEYS.SITE_CONTENT, DEFAULT_SITE_CONTENT);
}

export function saveSiteContent(content: SiteContent): SiteContent {
  setStorage(KEYS.SITE_CONTENT, content);
  return content;
}


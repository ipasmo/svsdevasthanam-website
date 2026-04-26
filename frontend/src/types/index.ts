// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = "SUPER_ADMIN" | "CONTENT_EDITOR" | "FINANCE_ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export type PageStatus = "ACTIVE" | "DISABLED" | "DRAFT" | "SCHEDULED";

export interface Page {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  translations: PageTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface PageTranslation {
  id: string;
  pageId: string;
  languageCode: string;
  title: string;
  content: string;
}

// ─── Deities ─────────────────────────────────────────────────────────────────

export interface Deity {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  shortDescription: string;
  description: string;
  significance: string;
  rituals: string;
  orderIndex: number;
}

// ─── Events & Festivals ──────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  endDate?: string;
  coverImage: string;
  photos: string[];
  videoUrls: string[];
  isPublished: boolean;
  createdAt: string;
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface GalleryImage {
  id: string;
  categoryId: string;
  category?: GalleryCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  altText?: string;
  width?: number;
  height?: number;
  createdAt: string;
}

// ─── Videos ──────────────────────────────────────────────────────────────────

export interface Video {
  id: string;
  title: string;
  description?: string;
  youtubeUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  isLive?: boolean;
  createdAt: string;
}

// ─── Temple Timings ──────────────────────────────────────────────────────────

export interface TempleTimingEntry {
  id: string;
  activity: string;
  time: string;
  description?: string;
  dayType: "ALL" | "WEEKDAY" | "WEEKEND" | "SPECIAL";
  orderIndex: number;
}

// ─── Poojas & Sevas ──────────────────────────────────────────────────────────

export type PoojaType = "DAILY" | "WEEKLY" | "SPECIAL";

export interface Pooja {
  id: string;
  name: string;
  description: string;
  time: string;
  notes?: string;
  type: PoojaType;
  cost?: number;
  imageUrl?: string;
}

// ─── Donations ───────────────────────────────────────────────────────────────

export type DonationStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type DonationPurpose =
  | "GENERAL"
  | "ANNADANAM"
  | "FESTIVAL"
  | "TEMPLE_MAINTENANCE"
  | "SEVA";

export interface Donation {
  id: string;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  purpose: DonationPurpose;
  paymentReference?: string;
  status: DonationStatus;
  message?: string;
  date: string;
}

export interface DonationFormData {
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  purpose: DonationPurpose;
  message?: string;
}

// ─── Announcements ───────────────────────────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isImportant: boolean;
  expiresAt?: string;
  createdAt: string;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  i18nKey?: string;
  children?: NavItem[];
  isExternal?: boolean;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── i18n ────────────────────────────────────────────────────────────────────

export type SupportedLocale = "en" | "te" | "hi";

export interface LanguageOption {
  code: SupportedLocale;
  label: string;
  nativeLabel: string;
  flag: string;
}

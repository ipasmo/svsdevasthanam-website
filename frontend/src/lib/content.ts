// Server-side content loading for public pages.
// Reads from the backend API (cached by Next.js for REVALIDATE_SECONDS) and falls
// back to the static data in constants.ts when the API is unreachable, slow
// (e.g. Render free plan waking up), errors, or returns nothing. Visitors always
// get a page; the API just keeps it up to date.
import type { Deity, Festival, Pooja, PoojaType, TempleTimingEntry } from "@/types";
import { DEITIES, FESTIVALS, POOJAS, TEMPLE_TIMINGS } from "./constants";

export const REVALIDATE_SECONDS = 300;
export const API_TIMEOUT_MS = 5000;

// ─── API response shapes (backend Prisma models) ─────────────────────────────
interface LocalizedName {
  nameEn: string;
  nameTe?: string | null;
  nameHi?: string | null;
}

export interface ApiDeity extends LocalizedName {
  id: string;
  slug: string;
  descriptionEn: string;
  descriptionTe?: string | null;
  descriptionHi?: string | null;
  shortDescriptionEn?: string | null;
  significance?: string | null;
  rituals?: unknown;
  imageUrl?: string | null;
  orderIndex: number;
}

export interface ApiTiming {
  id: string;
  activity: string;
  activityTe?: string | null;
  startTime: string;
  endTime?: string | null;
  dayType: TempleTimingEntry["dayType"];
  sortOrder: number;
}

export interface ApiPooja extends LocalizedName {
  id: string;
  descriptionEn?: string | null;
  type: PoojaType;
  timeEn?: string | null;
  notes?: string | null;
  cost?: number | null;
}

export interface ApiFestival extends LocalizedName {
  id: string;
  slug: string;
  descriptionEn?: string | null;
  month?: string | null;
  icon?: string | null;
  isHighlighted: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
// Telugu/Hindi when that language is selected and a translation exists; otherwise English.
export function pickLocalized(locale: string, en: string, te?: string | null, hi?: string | null): string {
  if (locale === "te" && te) return te;
  if (locale === "hi" && hi) return hi;
  return en;
}

async function fetchList<T>(path: string): Promise<T[] | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return null;
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[content] ${path} returned ${res.status}; using static fallback`);
      return null;
    }
    const data: unknown = await res.json();
    return Array.isArray(data) && data.length > 0 ? (data as T[]) : null;
  } catch (error) {
    console.warn(`[content] ${path} unavailable (${(error as Error).name}); using static fallback`);
    return null;
  }
}

// ─── Mappers: API shape → the shapes the pages already render ───────────────
export function toDeity(d: ApiDeity, locale: string): Deity {
  return {
    id: d.id,
    slug: d.slug,
    name: pickLocalized(locale, d.nameEn, d.nameTe, d.nameHi),
    imageUrl: d.imageUrl ?? "",
    shortDescription: d.shortDescriptionEn ?? "",
    description: pickLocalized(locale, d.descriptionEn, d.descriptionTe, d.descriptionHi),
    significance: d.significance ?? "",
    rituals: Array.isArray(d.rituals) ? d.rituals.join(", ") : typeof d.rituals === "string" ? d.rituals : "",
    orderIndex: d.orderIndex,
  };
}

export function toTiming(t: ApiTiming, locale: string): TempleTimingEntry {
  return {
    id: t.id,
    activity: pickLocalized(locale, t.activity, t.activityTe),
    time: t.endTime ? `${t.startTime} - ${t.endTime}` : t.startTime,
    dayType: t.dayType,
    orderIndex: t.sortOrder,
  };
}

export function toPooja(p: ApiPooja, locale: string): Pooja {
  return {
    id: p.id,
    name: pickLocalized(locale, p.nameEn, p.nameTe, p.nameHi),
    description: p.descriptionEn ?? "",
    time: p.timeEn ?? "",
    notes: p.notes ?? undefined,
    type: p.type,
    cost: p.cost ?? undefined,
  };
}

export function toFestival(f: ApiFestival, locale: string): Festival {
  return {
    id: f.id,
    slug: f.slug,
    name: pickLocalized(locale, f.nameEn, f.nameTe, f.nameHi),
    month: f.month ?? "",
    description: f.descriptionEn ?? "",
    icon: f.icon ?? "🪔",
    highlight: f.isHighlighted,
  };
}

// ─── Public loaders ──────────────────────────────────────────────────────────
export async function getDeities(locale: string): Promise<Deity[]> {
  const data = await fetchList<ApiDeity>("/deities");
  return data ? data.map((d) => toDeity(d, locale)) : DEITIES;
}

export async function getTimings(locale: string): Promise<TempleTimingEntry[]> {
  const data = await fetchList<ApiTiming>("/timings");
  return data ? data.map((t) => toTiming(t, locale)) : TEMPLE_TIMINGS;
}

export async function getPoojas(locale: string): Promise<Pooja[]> {
  const data = await fetchList<ApiPooja>("/poojas");
  return data ? data.map((p) => toPooja(p, locale)) : POOJAS;
}

export async function getFestivals(locale: string): Promise<Festival[]> {
  const data = await fetchList<ApiFestival>("/festivals");
  return data ? data.map((f) => toFestival(f, locale)) : FESTIVALS;
}

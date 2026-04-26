import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { storage } from "./utils";
import type {
  ApiResponse,
  PaginatedResponse,
  Deity,
  Event,
  GalleryCategory,
  GalleryImage,
  Video,
  Announcement,
  Donation,
  DonationFormData,
  Pooja,
  TempleTimingEntry,
  Page,
  User,
} from "@/types";

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = storage.get<string>("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.remove("auth_token");
      storage.remove("auth_user");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Generic Request ──────────────────────────────────────────────────────────
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await api.request<ApiResponse<T>>(config);
  return response.data.data;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) =>
    request<{ user: User; token: string }>({
      method: "POST",
      url: "/auth/login",
      data: { email, password },
    }),

  logout: async () =>
    request<void>({ method: "POST", url: "/auth/logout" }),

  getProfile: async () =>
    request<User>({ method: "GET", url: "/auth/profile" }),
};

// ─── Pages API ────────────────────────────────────────────────────────────────
export const pagesApi = {
  getAll: async () =>
    request<Page[]>({ method: "GET", url: "/pages" }),

  getBySlug: async (slug: string) =>
    request<Page>({ method: "GET", url: `/pages/${slug}` }),

  // Admin
  create: async (data: Partial<Page>) =>
    request<Page>({ method: "POST", url: "/admin/pages", data }),

  update: async (id: string, data: Partial<Page>) =>
    request<Page>({ method: "PUT", url: `/admin/pages/${id}`, data }),

  delete: async (id: string) =>
    request<void>({ method: "DELETE", url: `/admin/pages/${id}` }),
};

// ─── Deities API ──────────────────────────────────────────────────────────────
export const deitiesApi = {
  getAll: async () =>
    request<Deity[]>({ method: "GET", url: "/deities" }),

  getBySlug: async (slug: string) =>
    request<Deity>({ method: "GET", url: `/deities/${slug}` }),

  // Admin
  create: async (data: Partial<Deity>) =>
    request<Deity>({ method: "POST", url: "/admin/deities", data }),

  update: async (id: string, data: Partial<Deity>) =>
    request<Deity>({ method: "PUT", url: `/admin/deities/${id}`, data }),

  delete: async (id: string) =>
    request<void>({ method: "DELETE", url: `/admin/deities/${id}` }),
};

// ─── Gallery API ──────────────────────────────────────────────────────────────
export const galleryApi = {
  getCategories: async () =>
    request<GalleryCategory[]>({ method: "GET", url: "/gallery/categories" }),

  getImages: async (categoryId?: string, page = 1, limit = 20) =>
    request<PaginatedResponse<GalleryImage>>({
      method: "GET",
      url: "/gallery",
      params: { categoryId, page, limit },
    }),

  // Admin
  uploadImage: async (formData: FormData) =>
    request<GalleryImage>({
      method: "POST",
      url: "/admin/gallery",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteImage: async (id: string) =>
    request<void>({ method: "DELETE", url: `/admin/gallery/${id}` }),
};

// ─── Events API ───────────────────────────────────────────────────────────────
export const eventsApi = {
  getAll: async (page = 1, limit = 10) =>
    request<PaginatedResponse<Event>>({
      method: "GET",
      url: "/events",
      params: { page, limit },
    }),

  getBySlug: async (slug: string) =>
    request<Event>({ method: "GET", url: `/events/${slug}` }),

  // Admin
  create: async (data: Partial<Event>) =>
    request<Event>({ method: "POST", url: "/admin/events", data }),

  update: async (id: string, data: Partial<Event>) =>
    request<Event>({ method: "PUT", url: `/admin/events/${id}`, data }),

  delete: async (id: string) =>
    request<void>({ method: "DELETE", url: `/admin/events/${id}` }),
};

// ─── Videos API ───────────────────────────────────────────────────────────────
export const videosApi = {
  getAll: async (page = 1, limit = 12) =>
    request<PaginatedResponse<Video>>({
      method: "GET",
      url: "/videos",
      params: { page, limit },
    }),

  getLive: async () =>
    request<Video | null>({ method: "GET", url: "/videos/live" }),
};

// ─── Announcements API ────────────────────────────────────────────────────────
export const announcementsApi = {
  getAll: async () =>
    request<Announcement[]>({ method: "GET", url: "/announcements" }),

  // Admin
  create: async (data: Partial<Announcement>) =>
    request<Announcement>({ method: "POST", url: "/admin/announcements", data }),

  update: async (id: string, data: Partial<Announcement>) =>
    request<Announcement>({ method: "PUT", url: `/admin/announcements/${id}`, data }),

  delete: async (id: string) =>
    request<void>({ method: "DELETE", url: `/admin/announcements/${id}` }),
};

// ─── Timings API ──────────────────────────────────────────────────────────────
export const timingsApi = {
  getAll: async () =>
    request<TempleTimingEntry[]>({ method: "GET", url: "/timings" }),

  // Admin
  update: async (id: string, data: Partial<TempleTimingEntry>) =>
    request<TempleTimingEntry>({ method: "PUT", url: `/admin/timings/${id}`, data }),
};

// ─── Poojas API ───────────────────────────────────────────────────────────────
export const poojasApi = {
  getAll: async () =>
    request<Pooja[]>({ method: "GET", url: "/poojas" }),
};

// ─── Donations API ────────────────────────────────────────────────────────────
export const donationsApi = {
  create: async (data: DonationFormData) =>
    request<{ orderId: string; amount: number }>({
      method: "POST",
      url: "/donations",
      data,
    }),

  verify: async (paymentData: {
    orderId: string;
    paymentId: string;
    signature: string;
  }) =>
    request<Donation>({
      method: "POST",
      url: "/donations/verify",
      data: paymentData,
    }),

  // Admin
  getAll: async (page = 1, limit = 20) =>
    request<PaginatedResponse<Donation>>({
      method: "GET",
      url: "/admin/donations",
      params: { page, limit },
    }),
};

export default api;

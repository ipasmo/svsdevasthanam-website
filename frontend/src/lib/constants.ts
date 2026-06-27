import type { LanguageOption, NavItem, Deity, Pooja, TempleTimingEntry } from "@/types";

// ─── Site ─────────────────────────────────────────────────────────────────────
export const SITE_NAME = "Sri Venkata Sai Devasthanam";
export const SITE_TAGLINE = "Yemmiganur, Kurnool, Andhra Pradesh";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.srivenkatasai.org";
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

// ─── Temple Info ──────────────────────────────────────────────────────────────
export const TEMPLE_INFO = {
  name: "Sri Venkata Sai Devasthanam",
  address: "Yemmiganur, Kurnool District, Andhra Pradesh 518 360, India",
  phone: ["+91 98765 43210", "+91 87654 32109"],
  email: "info@srivenkatasai.org",
  founded: "2004",
  coordinates: { lat: 15.7654, lng: 78.0061 },
  youtubeChannel: "https://www.youtube.com/@SriVenkataSaiTemple",
  facebook: "https://facebook.com/srivenkatasaitemple",
  instagram: "https://instagram.com/srivenkatasaitemple",
};

// ─── Languages ────────────────────────────────────────────────────────────────
export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు", flag: "🇮🇳" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", flag: "🇮🇳" },
];

export const DEFAULT_LOCALE = "en";

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", i18nKey: "home" },
  { label: "About", href: "/about", i18nKey: "about" },
  {
    label: "Deities",
    href: "/deities",
    i18nKey: "deities",
    children: [
      { label: "Sri Vigneshwara Swamy", href: "/deities/vigneshwara" },
      { label: "Lord Sri Hanuman", href: "/deities/hanuman" },
      { label: "Sai Baba", href: "/deities/sai-baba" },
      { label: "Sri Venkateshwara Swamy", href: "/deities/venkateshwara" },
      { label: "Lord Shiva", href: "/deities/shiva" },
      { label: "Nava Graha", href: "/deities/nava-graha" },
    ],
  },
  { label: "Poojas & Sevas", href: "/poojas", i18nKey: "poojas" },
  { label: "Festivals", href: "/festivals", i18nKey: "festivals" },
  {
    label: "Gallery",
    href: "/gallery",
    i18nKey: "gallery",
    children: [
      { label: "Photos", href: "/gallery" },
      { label: "Videos", href: "/gallery/videos" },
    ],
  },
  { label: "Live", href: "/live", i18nKey: "live" },
  { label: "Annadanam", href: "/annadanam", i18nKey: "annadanam" },
  { label: "Timings", href: "/timings", i18nKey: "timings" },
  { label: "News", href: "/news", i18nKey: "news" },
  { label: "Contact", href: "/contact", i18nKey: "contact" },
  { label: "Donate", href: "/donate", i18nKey: "donate" },
];

// ─── Deities ─────────────────────────────────────────────────────────────────
export const DEITIES: Deity[] = [
  {
    id: "1",
    name: "Sri Vigneshwara Swamy",
    slug: "vigneshwara",
    imageUrl: "/images/deities/vigneshwara.jpg",
    shortDescription: "Lord of Beginnings, Remover of Obstacles",
    description:
      "Sri Vigneshwara Swamy (Lord Ganesha) is the son of Lord Shiva and Goddess Parvati. He is worshipped as the god of beginnings, the remover of obstacles, and the patron of arts, sciences, and intellect. Before any important undertaking, devotees seek his blessings.",
    significance:
      "Worshipped first before any religious ceremony or auspicious beginning. His presence ensures the removal of all hurdles and obstacles.",
    rituals:
      "Modak offering, Durva grass archana, Ganesh Chaturthi celebrations, Monday special poojas",
    orderIndex: 1,
  },
  {
    id: "2",
    name: "Lord Sri Hanuman",
    slug: "hanuman",
    imageUrl: "/images/deities/hanuman.jpg",
    shortDescription: "Devoted Servant of Lord Rama, Symbol of Strength",
    description:
      "Lord Hanuman is the epitome of devotion, strength, and selfless service. He is the greatest devotee of Lord Rama and is believed to be ever-present wherever the name of Rama is chanted. He bestows courage, physical strength, and spiritual wisdom.",
    significance:
      "Protector from evil spirits and negative energies. Grants strength, courage, and unwavering devotion.",
    rituals:
      "Tuesday and Saturday special poojas, Hanuman Chalisa recitation, Sundara Kanda parayanam",
    orderIndex: 2,
  },
  {
    id: "3",
    name: "Sai Baba",
    slug: "sai-baba",
    imageUrl: "/images/deities/sai-baba.jpg",
    shortDescription: "Universal Saint, Embodiment of Love and Unity",
    description:
      "Shirdi Sai Baba was a spiritual master and saint revered by both Hindus and Muslims. His teachings centered on love, forgiveness, helping others, charity, contentment, inner peace, and devotion to God and guru. He is known for his message 'Sabka Malik Ek' (One God for All).",
    significance:
      "Transcends religious boundaries, embraced by all. Known for healing the sick and fulfilling devotees' wishes.",
    rituals:
      "Thursday special pooja with Udi (sacred ash), Sai Satcharitra parayanam, Sai Aradhana celebrations",
    orderIndex: 3,
  },
  {
    id: "4",
    name: "Lord Sri Venkateshwara Swamy",
    slug: "venkateshwara",
    imageUrl: "/images/deities/venkateshwara.jpg",
    shortDescription: "Lord of Seven Hills, Provider of Blessings",
    description:
      "Lord Sri Venkateshwara Swamy, also known as Balaji or Srinivasa, is a form of Lord Vishnu. He is the presiding deity of the Tirumala Venkateswara Temple and is one of the most widely worshipped deities in India. He is believed to fulfill the wishes of his devotees.",
    significance:
      "Grants material and spiritual prosperity. The main deity of this temple, representing divine grace and compassion.",
    rituals:
      "Daily Suprabhatam, Archana with Tulasi, Saturdays special seva, Brahmotsavam celebrations",
    orderIndex: 4,
  },
  {
    id: "5",
    name: "Lord Shiva",
    slug: "shiva",
    imageUrl: "/images/deities/shiva.jpg",
    shortDescription: "The Auspicious One, Destroyer and Transformer",
    description:
      "Lord Shiva is one of the principal deities of Hinduism — the Supreme Being in Shaivism. He is the Destroyer within the Trimurti, the three aspects of the divine in Hinduism. Shiva is also worshipped as the patron deity of yoga, meditation, and the arts.",
    significance:
      "Represents destruction of evil and transformation. Worshipped for liberation (moksha), peace, and spiritual awakening.",
    rituals:
      "Monday special abhishekam, Maha Shivaratri celebrations, Pradosha pooja, Rudrabhishekam",
    orderIndex: 5,
  },
  {
    id: "6",
    name: "Nava Graha",
    slug: "nava-graha",
    imageUrl: "/images/deities/nava-graha.jpg",
    shortDescription: "Nine Celestial Planets, Cosmic Influences",
    description:
      "Nava Graha refers to the nine celestial bodies in Hindu astrology — Surya (Sun), Chandra (Moon), Mangal (Mars), Budha (Mercury), Brihaspati (Jupiter), Shukra (Venus), Shani (Saturn), Rahu, and Ketu. They are said to influence every aspect of human life.",
    significance:
      "Worshipping Nava Graha neutralizes negative planetary influences and enhances positive ones in one's horoscope.",
    rituals:
      "Nava Graha homa, Saturday Shani pooja, Sunday Surya namaskar, Rahu-Ketu shanti puja",
    orderIndex: 6,
  },
];

// ─── Poojas ──────────────────────────────────────────────────────────────────
export const POOJAS: Pooja[] = [
  {
    id: "1",
    name: "Suprabhatam",
    description: "Morning awakening prayer offering to the Lord",
    time: "5:30 AM",
    notes: "Daily, begins the day's worship",
    type: "DAILY",
  },
  {
    id: "2",
    name: "Abhishekam",
    description: "Ritual bathing of the deity with sacred substances including milk, honey, yoghurt, and rosewater",
    time: "6:00 AM",
    notes: "Daily ritual with 16 sacred items",
    type: "DAILY",
  },
  {
    id: "3",
    name: "Naivedyam",
    description: "Offering of prasadam (sacred food) to the deities",
    time: "8:00 AM & 12:00 PM & 7:00 PM",
    notes: "Three times daily",
    type: "DAILY",
  },
  {
    id: "4",
    name: "Maha Archana",
    description: "Complete archana with 108 names of the deity",
    time: "9:00 AM",
    notes: "Book in advance",
    type: "DAILY",
    cost: 116,
  },
  {
    id: "5",
    name: "Sahasranama Archana",
    description: "Archana with 1008 names of the Lord",
    time: "On Request",
    notes: "Special seva, advance booking required",
    type: "SPECIAL",
    cost: 501,
  },
  {
    id: "6",
    name: "Kalyanam (Celestial Wedding)",
    description: "Ritual depicting the divine wedding of the Lord",
    time: "Sunday 10:00 AM",
    notes: "Weekly special seva",
    type: "WEEKLY",
    cost: 1116,
  },
  {
    id: "7",
    name: "Annadanam",
    description: "Community meal offering blessed by the temple",
    time: "12:30 PM",
    notes: "Sponsorship available, contact temple office",
    type: "DAILY",
    cost: 5000,
  },
  {
    id: "8",
    name: "Maha Rudrabhishekam",
    description: "Grand abhishekam with Rudra mantras for Lord Shiva",
    time: "On Request",
    notes: "Special occasion seva, 3 hours duration",
    type: "SPECIAL",
    cost: 2116,
  },
];

// ─── Temple Timings ──────────────────────────────────────────────────────────
export const TEMPLE_TIMINGS: TempleTimingEntry[] = [
  { id: "1", activity: "Temple Opens", time: "5:30 AM", dayType: "ALL", orderIndex: 1 },
  { id: "2", activity: "Suprabhatam & Abhishekam", time: "5:30 - 7:00 AM", dayType: "ALL", orderIndex: 2 },
  { id: "3", activity: "Morning Darshan", time: "7:00 AM - 12:00 PM", dayType: "ALL", orderIndex: 3 },
  { id: "4", activity: "Noon Naivedyam", time: "12:00 PM", dayType: "ALL", orderIndex: 4 },
  { id: "5", activity: "Annadanam (Lunch Prasadam)", time: "12:30 - 1:30 PM", dayType: "ALL", orderIndex: 5 },
  { id: "6", activity: "Afternoon Break (Temple Closed)", time: "1:30 - 4:00 PM", dayType: "ALL", orderIndex: 6 },
  { id: "7", activity: "Evening Darshan Opens", time: "4:00 PM", dayType: "ALL", orderIndex: 7 },
  { id: "8", activity: "Sandhya Archana", time: "6:00 PM", dayType: "ALL", orderIndex: 8 },
  { id: "9", activity: "Evening Naivedyam", time: "7:30 PM", dayType: "ALL", orderIndex: 9 },
  { id: "10", activity: "Ekanta Seva (Closing Prayers)", time: "8:00 PM", dayType: "ALL", orderIndex: 10 },
  { id: "11", activity: "Temple Closes", time: "8:30 PM", dayType: "ALL", orderIndex: 11 },
  { id: "12", activity: "Extended Darshan", time: "4:00 - 10:00 PM", dayType: "WEEKEND", orderIndex: 12 },
];

// ─── Gallery Categories ───────────────────────────────────────────────────────
export const GALLERY_CATEGORIES = [
  { id: "all", name: "All", slug: "all" },
  { id: "temple", name: "Temple", slug: "temple" },
  { id: "festivals", name: "Festivals", slug: "festivals" },
  { id: "poojas", name: "Poojas", slug: "poojas" },
  { id: "annadanam", name: "Annadanam", slug: "annadanam" },
];

// ─── Donation Amounts ─────────────────────────────────────────────────────────
export const DONATION_AMOUNTS = [116, 251, 501, 1008, 1116, 2116, 5001, 10001];

export const DONATION_PURPOSES = [
  { value: "GENERAL", label: "General Temple Fund" },
  { value: "ANNADANAM", label: "Annadanam (Food Donation)" },
  { value: "FESTIVAL", label: "Festival Celebrations" },
  { value: "TEMPLE_MAINTENANCE", label: "Temple Maintenance" },
  { value: "SEVA", label: "Special Seva" },
];

// ─── Admin Roles ──────────────────────────────────────────────────────────────
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ["*"],
  CONTENT_EDITOR: ["pages", "deities", "gallery", "events", "announcements", "timings"],
  FINANCE_ADMIN: ["donations"],
};

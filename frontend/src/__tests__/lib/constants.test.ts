/**
 * Unit tests for src/lib/constants.ts
 * Validates shape and integrity of static data used throughout the app.
 */

import {
  SITE_NAME,
  TEMPLE_INFO,
  LANGUAGES,
  DEFAULT_LOCALE,
  NAV_ITEMS,
  DEITIES,
  POOJAS,
  TEMPLE_TIMINGS,
  GALLERY_CATEGORIES,
  DONATION_AMOUNTS,
  DONATION_PURPOSES,
} from "@/lib/constants";

// ─── Site constants ───────────────────────────────────────────────────────────
describe("Site constants", () => {
  it("SITE_NAME is defined and non-empty", () => {
    expect(typeof SITE_NAME).toBe("string");
    expect(SITE_NAME.length).toBeGreaterThan(0);
  });

  it("DEFAULT_LOCALE is one of the supported locales", () => {
    const supported = ["en", "te", "hi"];
    expect(supported).toContain(DEFAULT_LOCALE);
  });
});

// ─── Temple info ──────────────────────────────────────────────────────────────
describe("TEMPLE_INFO", () => {
  it("has a non-empty name", () => {
    expect(TEMPLE_INFO.name).toBeTruthy();
  });

  it("has an address mentioning Yemmiganur", () => {
    expect(TEMPLE_INFO.address).toContain("Yemmiganur");
  });

  it("has at least one phone number", () => {
    expect(Array.isArray(TEMPLE_INFO.phone)).toBe(true);
    expect(TEMPLE_INFO.phone.length).toBeGreaterThan(0);
  });

  it("has valid email format", () => {
    expect(TEMPLE_INFO.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("has valid coordinates in Kurnool region", () => {
    expect(TEMPLE_INFO.coordinates.lat).toBeCloseTo(15.76, 0);
    expect(TEMPLE_INFO.coordinates.lng).toBeCloseTo(78.0, 0);
  });

  it("has a YouTube channel URL", () => {
    expect(TEMPLE_INFO.youtubeChannel).toContain("youtube.com");
  });
});

// ─── Languages ────────────────────────────────────────────────────────────────
describe("LANGUAGES", () => {
  it("contains exactly 3 language entries", () => {
    expect(LANGUAGES).toHaveLength(3);
  });

  it("each entry has required keys: code, label, nativeLabel, flag", () => {
    LANGUAGES.forEach((lang) => {
      expect(lang).toHaveProperty("code");
      expect(lang).toHaveProperty("label");
      expect(lang).toHaveProperty("nativeLabel");
      expect(lang).toHaveProperty("flag");
    });
  });

  it("codes are en, te, hi", () => {
    const codes = LANGUAGES.map((l) => l.code);
    expect(codes).toEqual(expect.arrayContaining(["en", "te", "hi"]));
  });
});

// ─── Nav items ────────────────────────────────────────────────────────────────
describe("NAV_ITEMS", () => {
  it("has at least 5 items", () => {
    expect(NAV_ITEMS.length).toBeGreaterThanOrEqual(5);
  });

  it("each item has label, href, and i18nKey", () => {
    NAV_ITEMS.forEach((item) => {
      expect(typeof item.label).toBe("string");
      expect(typeof item.href).toBe("string");
      expect(item.href.startsWith("/")).toBe(true);
      expect(typeof item.i18nKey).toBe("string");
    });
  });

  it("includes a Donate link", () => {
    const donateItem = NAV_ITEMS.find((item) => item.href === "/donate");
    expect(donateItem).toBeDefined();
  });

  it("includes a Home link pointing to /", () => {
    const homeItem = NAV_ITEMS.find((item) => item.href === "/");
    expect(homeItem).toBeDefined();
    expect(homeItem?.i18nKey).toBe("home");
  });

  it("Deities item has children", () => {
    const deity = NAV_ITEMS.find((item) => item.href === "/deities");
    expect(deity?.children).toBeDefined();
    expect(deity!.children!.length).toBeGreaterThan(0);
  });

  it("child items have label and href", () => {
    NAV_ITEMS.filter((item) => item.children).forEach((item) => {
      item.children!.forEach((child) => {
        expect(typeof child.label).toBe("string");
        expect(child.href.startsWith("/")).toBe(true);
      });
    });
  });
});

// ─── Deities ─────────────────────────────────────────────────────────────────
describe("DEITIES", () => {
  it("contains 6 deities", () => {
    expect(DEITIES).toHaveLength(6);
  });

  it("each deity has required fields", () => {
    DEITIES.forEach((d) => {
      expect(d.id).toBeTruthy();
      expect(d.name).toBeTruthy();
      expect(d.slug).toBeTruthy();
      expect(d.shortDescription).toBeTruthy();
      expect(typeof d.orderIndex).toBe("number");
    });
  });

  it("deities are ordered by orderIndex starting from 1", () => {
    const indices = DEITIES.map((d) => d.orderIndex);
    expect(indices[0]).toBe(1);
    for (let i = 1; i < indices.length; i++) {
      expect(indices[i]).toBeGreaterThan(indices[i - 1]);
    }
  });

  it("includes Sri Venkateshwara Swamy", () => {
    const found = DEITIES.find((d) => d.slug === "venkateshwara");
    expect(found).toBeDefined();
  });
});

// ─── Poojas ──────────────────────────────────────────────────────────────────
describe("POOJAS", () => {
  it("has at least 5 poojas", () => {
    expect(POOJAS.length).toBeGreaterThanOrEqual(5);
  });

  it("each pooja has id, name, description, time, type", () => {
    POOJAS.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.time).toBeTruthy();
      expect(["DAILY", "WEEKLY", "SPECIAL"]).toContain(p.type);
    });
  });

  it("includes Abhishekam pooja", () => {
    const found = POOJAS.find((p) => p.name === "Abhishekam");
    expect(found).toBeDefined();
  });
});

// ─── Temple timings ───────────────────────────────────────────────────────────
describe("TEMPLE_TIMINGS", () => {
  it("has at least 8 entries", () => {
    expect(TEMPLE_TIMINGS.length).toBeGreaterThanOrEqual(8);
  });

  it("each entry has id, activity, time, dayType, orderIndex", () => {
    TEMPLE_TIMINGS.forEach((t) => {
      expect(t.id).toBeTruthy();
      expect(t.activity).toBeTruthy();
      expect(t.time).toBeTruthy();
      expect(["ALL", "WEEKDAY", "WEEKEND", "SPECIAL"]).toContain(t.dayType);
      expect(typeof t.orderIndex).toBe("number");
    });
  });

  it("first timing is temple opening (orderIndex 1)", () => {
    const first = TEMPLE_TIMINGS.find((t) => t.orderIndex === 1);
    expect(first?.activity.toLowerCase()).toContain("open");
  });

  it("contains at least one ALL-day entry", () => {
    const allDay = TEMPLE_TIMINGS.filter((t) => t.dayType === "ALL");
    expect(allDay.length).toBeGreaterThan(0);
  });
});

// ─── Gallery categories ───────────────────────────────────────────────────────
describe("GALLERY_CATEGORIES", () => {
  it("has at least 3 categories", () => {
    expect(GALLERY_CATEGORIES.length).toBeGreaterThanOrEqual(3);
  });

  it("first category is 'all'", () => {
    expect(GALLERY_CATEGORIES[0].id).toBe("all");
  });

  it("each category has id, name, slug", () => {
    GALLERY_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.slug).toBeTruthy();
    });
  });
});

// ─── Donation amounts ─────────────────────────────────────────────────────────
describe("DONATION_AMOUNTS", () => {
  it("has at least 5 preset amounts", () => {
    expect(DONATION_AMOUNTS.length).toBeGreaterThanOrEqual(5);
  });

  it("all amounts are positive numbers", () => {
    DONATION_AMOUNTS.forEach((amount) => {
      expect(typeof amount).toBe("number");
      expect(amount).toBeGreaterThan(0);
    });
  });

  it("amounts are in ascending order", () => {
    for (let i = 1; i < DONATION_AMOUNTS.length; i++) {
      expect(DONATION_AMOUNTS[i]).toBeGreaterThan(DONATION_AMOUNTS[i - 1]);
    }
  });
});

// ─── Donation purposes ────────────────────────────────────────────────────────
describe("DONATION_PURPOSES", () => {
  it("includes GENERAL purpose", () => {
    const general = DONATION_PURPOSES.find((p) => p.value === "GENERAL");
    expect(general).toBeDefined();
  });

  it("includes ANNADANAM purpose", () => {
    const annadanam = DONATION_PURPOSES.find((p) => p.value === "ANNADANAM");
    expect(annadanam).toBeDefined();
  });

  it("each purpose has value and label", () => {
    DONATION_PURPOSES.forEach((p) => {
      expect(p.value).toBeTruthy();
      expect(p.label).toBeTruthy();
    });
  });
});
